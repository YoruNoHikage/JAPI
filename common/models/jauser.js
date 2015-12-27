module.exports = function(jauser) {

    /*
     To erase the ACLs set for User ( base Class ) and apply those in config
     https://github.com/strongloop/loopback/issues/559
      */
    jauser.settings.acls.length = 0;
    jauserConfig = require('./jauser.json');
    jauserConfig.acls.forEach(function (r) {
        jauser.settings.acls.push(r);
    });

    jauser.disableRemoteMethod("create", true);
    jauser.disableRemoteMethod("upsert", true);
    jauser.disableRemoteMethod("updateAll", true);
    jauser.disableRemoteMethod("updateAttributes", false);
    jauser.disableRemoteMethod("createChangeStream", true);

    jauser.disableRemoteMethod("find", true);
    jauser.disableRemoteMethod("findById", true);
    jauser.disableRemoteMethod("findOne", true);

    jauser.disableRemoteMethod("deleteById", true);

    jauser.disableRemoteMethod("confirm", true);
    jauser.disableRemoteMethod("count", true);
    jauser.disableRemoteMethod("exists", true);
    jauser.disableRemoteMethod("resetPassword", true);

    jauser.disableRemoteMethod("resetPassword", true);

    jauser.disableRemoteMethod('__create__accessTokens', false);
    jauser.disableRemoteMethod('__delete__accessTokens', false);
    jauser.disableRemoteMethod('__count__accessTokens', false);
    jauser.disableRemoteMethod('__destroyById__accessTokens', false);
    jauser.disableRemoteMethod('__findById__accessTokens', false);
    jauser.disableRemoteMethod('__get__accessTokens', false);
    jauser.disableRemoteMethod('__updateById__accessTokens', false);

    jauser.disableRemoteMethod('__create__teams', false);
    jauser.disableRemoteMethod('__delete__teams', false);
    jauser.disableRemoteMethod('__count__teams', false);
    jauser.disableRemoteMethod('__exists__teams', false);
    jauser.disableRemoteMethod('__destroyById__teams', false);
    jauser.disableRemoteMethod('__findById__teams', false);
    jauser.disableRemoteMethod('__updateById__teams', false);


    jauser.disableRemoteMethod('__create__favorites', false);
    jauser.disableRemoteMethod('__count__favorites', false);
    jauser.disableRemoteMethod('__exists__favorites', false);
    jauser.disableRemoteMethod('__delete__favorites', false);
    jauser.disableRemoteMethod('__destroyById__favorites', false);
    jauser.disableRemoteMethod('__findById__favorites', false);
    jauser.disableRemoteMethod('__updateById__favorites', false);
};
