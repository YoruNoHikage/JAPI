var loopbackslug = require("loopback-slug");

// copy-pasted from loopback source, moved id to slug
function convertNullToNotFoundError(ctx, cb) {
   if (ctx.result !== null) return cb();

   var modelName = ctx.method.sharedClass.name;
   var slug = ctx.getArgByName('slug');
   var msg = 'Unknown "' + modelName + '" slug "' + slug + '".';
   var error = new Error(msg);
   error.statusCode = error.status = 404;
   error.code = 'MODEL_NOT_FOUND';
   cb(error);
}

module.exports = function(game) {
    game.disableRemoteMethod("findById", true);
    game.disableRemoteMethod("create", true);
    game.disableRemoteMethod("upsert", true);
    game.disableRemoteMethod("updateAll", true);
    game.disableRemoteMethod("deleteById", true);
    //game.disableRemoteMethod("updateAttributes", false);
    game.disableRemoteMethod("createChangeStream", true);
    game.disableRemoteMethod("count", true);
    game.disableRemoteMethod("findOne", true);
    game.disableRemoteMethod("exists", true);

    // TODO: filter
    game.findBySlug = function(slug, filter, cb) {
        this.findOne({where: {slug: slug}}, function(err, data) {
            cb(null, data);
        });
    }

    game.remoteMethod('findBySlug', {
        description: 'Find a model instance by slug from the data source.',
        accessType: 'READ',
        accepts: [{
            arg: 'slug',
            type: 'any',
            description: 'Model slug',
            required: true,
            http: {source: 'path'}
        }, {
            arg: 'filter',
            type: 'object',
            description: 'Filter defining fields and include'
        }],
        returns: {arg: 'data', type: game.modelName, root: true},
        http: {verb: 'get', path: '/:slug'},
        rest: {after: convertNullToNotFoundError}
    });

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
