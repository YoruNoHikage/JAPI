module.exports = function(app) {

    var User = app.models.jauser;
    var Team = app.models.team;
    var Game = app.models.game;
    var Role = app.models.Role;

    Role.registerResolver('team_member', function(role, context, cb) {
        function reject(err) {
            if(err) {
                return cb(err);
            }
            cb(null, false);
        }
        if (context.modelName !== 'game') {
            // the target model is not project
            return reject();
        }

        var userId = context.accessToken.userId;
        if (!userId) {
            return reject(); // do not allow anonymous users
        }

        // check if team is in user table
        context.model.findById(context.modelId, function(err, game) {

            if(err || !game) {
                reject(err);
            }

            User.findById(userId, function(err, user) {

                if(err || !user) {
                    reject(err);
                }

                // Silly :\ count would fit better
                user.teams.findById(game.teamId, function(err, team) {

                    if(err){
                        reject(err);
                    } else {
                        cb(null, true);
                    }

                });
            });
        });
    });

    console.log('Role base set.');

};