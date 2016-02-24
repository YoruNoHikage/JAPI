/**
 * Created by kilian on 2/23/16.
 */

var test = require('tape');
var request = require('request');

users = {
    "Brindesable" : {username : "Brindesable", password : "opensesame"},
    "YoruNoHikage" : {username : "YoruNoHikage", password : "opensesame"},
    "SteamDev" : {username : "SteamDev", password : "opensesame"}
};

/**
 * Get a string with the url and the parameters url?parameter1=value1&parameter2=value2
 * @param url
 * @param parameters {parameter1: value1, parameter2 : value2}
 * @returns the formatted url
 */
function addUrlParameters(url, parameters){
    if(Object.keys(parameters).length > 0) {
        urlParameters = [];
        for(var key in parameters){
            urlParameters.push(key + "=" + parameters[key]);
        }
        url += ("?" + urlParameters.join("&"));
    }
    return url;
}

/**
 * GET HTTP
 * @param url Path to test
 * @param t Tape transaction object
 * @param cb Function that takes the response json object as only parameter
 */
function getData(url, t, cb){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            cb(info);
        } else {
            if(error){
                t.fail('API not responding');
            } else {
                if(response.message){
                    t.fail(response.message);
                } else {
                    t.fail('Wrong status code : ' + response.statusCode + ' instead of 200');
                }
            }
        }
    });
}

/**
 * PUT HTTP, success expected
 * @param url Path to test
 * @param t Tape transaction object
 * @param data Data to give as input
 * @param cb Function that takes the response json object as only parameter
 */
function putDataSuccess(url, t, data, cb){
    request({
        url: url,
        method: 'PUT',
        json: data
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            cb(body);
        } else {
            if(error){
                t.fail('API not responding');
            } else {
                if(response.message){
                    t.fail(response.message);
                } else {
                    t.fail('Wrong status code : ' + response.statusCode + ' instead of 200');
                }
            }
        }
    });
}

/**
 * PUT HTTP, errors expected
 * @param url Path to test
 * @param t Tape transaction object
 * @param data Data to give as input
 * @param cb Function that takes the response error json object as only parameter
 */
function putDataFail(url, t, data, cb){
    request({
        url: url,
        method: 'PUT',
        json: data
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            t.fail('API should not respond')
        } else {
            if(error){
                t.fail('API not responding');
            } else {
                cb(response.body.error);
            }
        }
    });
}

/***
 * Get the login token
 * @param username
 * @param t Tape transaction object
 * @param cb Function that takes the token as only parameter
 */
function login(username, t, cb){
    request({
        url: 'http://0.0.0.0:3000/api/users/login',
        method: 'POST',
        json: users[username]
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            cb(body.id);
        } else {
            if(error){
                t.fail('API not responding');
            } else {
                if(response.message){
                    t.fail(response.message);
                } else {
                    t.fail('Wrong status code : ' + response.statusCode + ' instead of 200');
                }
            }
        }
    });
}

test('Get all games', function (t) {
    getData('http://0.0.0.0:3000/api/games', t, function(data){
        t.equal(data.length, 4, "We got all games");
    });
    t.end();
});

test('Get one game', function (t) {
    getData('http://0.0.0.0:3000/api/games/1', t, function(data){
        t.equal(data.id, 1, "We got game #1");
    });
    t.end();
});

test('Get the game\'s owner', function (t) {
    getData('http://0.0.0.0:3000/api/games/1/owner', t, function(data){
        t.deepEqual(data, {}, "Game #1 has no owner");
    });
    getData('http://0.0.0.0:3000/api/games/4/owner', t, function(data){
        t.equal(data.id, 1, "Game #4 has user #1 as owner");
    });
    t.end();
});

test('Get the game\'s team', function (t) {
    getData('http://0.0.0.0:3000/api/games/4/team', t, function(data){
        t.deepEqual(data, {}, "Game #4 has no team");
    });
    getData('http://0.0.0.0:3000/api/games/1/team', t, function(data){
        t.equal(data.id, 1, "Game #1 has team #1 as owner");
    });
    t.end();
});

test('Put game data', function (t) {

    putDataFail('http://0.0.0.0:3000/api/games/4', t, {}, function(response){
        t.deepEqual(response.status, 401, "Right error status (user not authentified)");
        t.deepEqual(response.code, "AUTHORIZATION_REQUIRED", "Right error code (user not authentified)");
    });

    login("Brindesable", t, function(token){
        randomName = Math.random().toString();
        putDataSuccess(addUrlParameters('http://0.0.0.0:3000/api/games/4', {access_token: token}), t, {name: randomName}, function(data){
            t.equal(data.name, randomName, "Game's name successfully changed (user is owner)");
        });
        putDataSuccess(addUrlParameters('http://0.0.0.0:3000/api/games/1', {access_token: token}), t, {name: randomName}, function(data){
            t.equal(data.name, randomName, "Game's name successfully changed (user is in team)");
        });
        putDataFail(addUrlParameters('http://0.0.0.0:3000/api/games/2', {access_token: token}), t, {name: randomName}, function(response){
            t.deepEqual(response.status, 401, "Right error status (user authenticated but has not the rights)");
            t.deepEqual(response.code, "AUTHORIZATION_REQUIRED", "Right error code (user authenticated but has not the rights)");
        });
    });

    t.end();
});