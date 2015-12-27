module.exports = function(team) {
    team.disableRemoteMethod("create", true);
    team.disableRemoteMethod("upsert", true);
    team.disableRemoteMethod("updateAll", true);
    team.disableRemoteMethod("deleteById", true);
    team.disableRemoteMethod("updateAttributes", false);
    team.disableRemoteMethod("createChangeStream", true);
    team.disableRemoteMethod("count", true);
    team.disableRemoteMethod("findOne", true);
    team.disableRemoteMethod("exists", true);
};
