module.exports = function(app) {
    var User = app.models.jauser;
    //var Role = app.models.Role;
    //var RoleMapping = app.models.RoleMapping;
    var Team = app.models.team;
    var Game = app.models.game;

    User.destroyAll(function(err) {
        if (err) throw err;

        console.log('User base cleared.');

        User.create([
            {username: "Brindesable", email: 'brindesable@mail.com', password: 'opensesame'},
            {username: 'YoruNoHikage', email: 'yorunohikage@mail.com', password: 'opensesame'},
            {username: 'SteamDev', email: 'steamdev@mail.com', password: 'opensesame'}
        ], function(err, users) {
            if (err) throw err;

            console.log('Users created:', users);

            Team.destroyAll(function(err) {

                console.log('Team base cleared.');

                Team.create([
                    {name: "Switchcode", leader : users[0].id},
                    {name: "Valve", leader : users[2].id},
                ], function(err, teams) {
                    if (err) throw err;

                    console.log('Teams created:', teams);

                    users[0].teams.add(teams[0].id, function (err) {
                        if (err) throw err;
                    });
                    users[1].teams.add(teams[0].id, function (err) {
                        if (err) throw err;
                    });
                    users[2].teams.add(teams[1].id, function (err) {
                        if (err) throw err;
                    });

                    Game.destroyAll(function(err) {
                        if (err) throw err;
                        console.log('Game base cleared.');

                        Game.create([{
                            name: "8-Bit Robot Music Party",
                            createdAt : new Date(),
                            updatedAt : new Date(),
                            team : teams[0]
                        },{
                            name: "Portal 3",
                            createdAt : new Date(),
                            updatedAt : new Date(),
                            team : teams[1]
                        },{
                            name: "8-Bit Robot Music Party",
                            createdAt : new Date(),
                            updatedAt : new Date(),
                            team : teams[0]
                        }], function(err, games) {

                            console.log('Games created.');
                        });
                    });
                });
            });

            //create the admin role
            /*Role.create({
                name: 'admin'
            }, function(err, role) {
                if (err) throw err;

                console.log('Created role:', role);

                //make bob an admin
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: users[0].id
                }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                });
            });*/
        });
    });
};