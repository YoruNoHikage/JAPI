var test = require('tape');
var request = require('supertest');
var app = require('../server/server.js');

// TODOs :
// - Get fixtures from the same file for loopback
// - Replace nesting with promises and promises.all to end the test
// - Replace id with slugs in some requests

users = {
    "Brindesable" : {username : "Brindesable", password : "opensesame"},
    "YoruNoHikage" : {username : "YoruNoHikage", password : "opensesame"},
    "SteamDev" : {username : "SteamDev", password : "opensesame"}
};

test("Should return a list of games", (t) => {
  request(app)
    .get('/api/games')
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No request error');
      t.equal(res.body.length, 4, "We got all games"); // TODO: replace with t.same(res.body, gamesFixtures, 'Games as expected');
      t.end();
    });
});

test("Should return one game", (t) => {
    request(app)
      .get('/api/games/8-bit-robot-music-party')
      .expect(200)
      .end((err, res) => {
        t.error(err, 'No request error');
        t.equal(res.body.slug, '8-bit-robot-music-party', "We got game");
        t.end();
      });
});

test("Should return game's owner", (t) => {
  request(app)
    .get('/api/games/8-bit-robot-music-party')
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No error');
      t.equal(res.body.owner, undefined, "Game has no owner");

      request(app)
        .get('/api/games/portal-3')
        .expect(200)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body.owner, 1, "Game has user #1 as owner");
          t.end();
        });
    });
});

test("Should return game's team", (t) => {
  request(app)
    .get('/api/games/portal-3')
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No request error');
      t.equal(res.body.teamId, undefined, "Game has no team");

      request(app)
        .get('/api/games/portal-3')
        .expect(200)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body.teamId, 1, "Game has team #1 as owner");
          t.end();
        });
    });
});

test("Should edit game's data", (t) => {
  request(app)
    .put('/api/games/1') // TODO: slug
    .set('Content-Type', 'application/json')
    .send({name: 'Jambon Beurre'})
    .expect(401)
    .end((err, res) => {
      t.error(err, 'No request error');

      login("Brindesable", t, function(token) {
        request(app)
          .put('/api/games/4') // TODO: slug
          .set('Authorization', token)
          .set('Content-Type', 'application/json')
          .send({name: 'Jambon'})
          .expect(200)
          .end((err, res) => {
            t.error(err, 'No request error');
            t.equal(res.body.name, 'Jambon', "Game's name successfully changed (user is owner)");

            request(app)
              .put('/api/games/1') // TODO: slug
              .set('Authorization', token)
              .set('Content-Type', 'application/json')
              .send({name: 'Yolo'})
              .expect(200)
              .end((err, res) => {
                t.error(err, 'No request error');
                t.equal(res.body.name, 'Yolo', "Game's name successfully changed (user is in team)");

                request(app)
                  .put('/api/games/2') // TODO: slug
                  .set('Authorization', token)
                  .set('Content-Type', 'application/json')
                  .send({name: 'Yolo'})
                  .expect(401)
                  .end((err, res) => {
                    t.error(err, 'No request error');
                    t.end();
                  });
              });
          });
      });
    });
});

function login(username, t, cb) {
    request(app)
      .post('/api/users/login')
      .send(users[username])
      .expect(200)
      .end((err, res) => {
        cb(res.body.id)
      });
}
