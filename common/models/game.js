var loopbackslug = require("loopback-slug");

module.exports = function(game) {
    game.disableRemoteMethod("create", true);
    game.disableRemoteMethod("upsert", true);
    game.disableRemoteMethod("updateAll", true);
    game.disableRemoteMethod("deleteById", true);
    game.disableRemoteMethod("updateAttributes", false);
    game.disableRemoteMethod("createChangeStream", true);
    game.disableRemoteMethod("count", true);
    game.disableRemoteMethod("findOne", true);
    game.disableRemoteMethod("exists", true);

    /*
        Gen the slug
     */
    game.observe('before save', function (ctx, next) {
        loopbackslug.middleware(game, ctx, {
            fields: ['name'],
            slug: "slug"
        }, function (err) {
            if (err) return next(err);
            else next(null);
        });
    });
};
