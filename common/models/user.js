module.exports = function(user) {
  var User = user;

//ensuer user
User.ensureUser = function(kid, cb) {
  User.find( { where:{ id:kid } }, function (err, result) {
    if(err) cb(err);

        result[0].updateAttributes({emailVerified: true }, function(err,res){
              if(err) cb(err);
              cb(null,res);
          }
        )

  })

};

User.remoteMethod(
  'ensureUser', {
    accepts: { arg: 'id', type: 'string' },
    returns: { arg: 'flag', type: 'object', root: true },
    http: {  path: '/ensureUser', verb: 'get' }
  }
);

//find not v user
User.findNotVerfiedUsers = function(cb) {
  User.find( { where:{ emailVerified: false } }, function (err, result) {
    if(err) cb(err);
    cb(null, result);
  })

};
User.remoteMethod(
  'findNotVerfiedUsers', {
    returns: { arg: 'users', type: ['user'], root: true },
    http: {  path: '/findNotVerfiedUsers', verb: 'get' }
  }
);




User.getApp(function(err, app) {

//---app.OrgRoleObject in boot initrole.js
  function creaMappingWithUserIdAndPosition(userId, position, cb){
        var RoleMapping = app.models.RoleMapping;
        var role = app.OrgRoleObject[position];
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: userId
        }, function(err, principal) {
          if(err) cb(err);
          cb(null, true);
        });
  }
//{userId:"",position:""}
  User.addUserPermissions = function(data, cb) {
    creaMappingWithUserIdAndPosition(data.userId, data.position, function(err,result){
      if(err) cb(err);
      cb(null,result);
    })
  };

  User.remoteMethod(
    'addUserPermissions', {
      accepts: { arg: 'data', type: 'object', http:{ source:'body' } },
      returns: { arg: 'flag', type: 'object', root: true },
      http: {  path: '/addUserPermissions', verb: 'post' }
    }
  );


  User.afterRemote(
      'create',
        function (ctx, kuser, next) {
            var RoleMapping = app.models.RoleMapping;
            app.generalUserRole.principals.create({
              principalType: RoleMapping.USER,
              principalId: kuser.id
            }, function(err, principal) {
              if (err) return next(err);
              next();
            });
        }
    );
  });



};
