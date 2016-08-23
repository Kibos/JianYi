var async = require("async");
var _ = require("lodash");

module.exports = function( app ){

  require('events').EventEmitter.prototype._maxListeners = 100;

  function initAdminRole( ) {

  app.models.Role.find({where:{name:'admin'}}, function(err, roles){
      if (err || roles.length != 1){
        app.models.Role.create({
          name: 'admin',
          ownerId: 0
        }, function(err, role) {
          if (err){
            console.log('Can not init admin role: ', err);
            return;
          }
          app.adminRole = role;
        });
      } else {
        app.adminRole = roles[0];
      }

    });
  }

  initAdminRole();



  var orgRoles = [
                  'canBuy',
                  'canCell',
                  'generalUser',
                  'orgCreat',
                  'orgGeneralUser',
                  'orgNewsManageUser',
                  'orgProductsManageUser',
                  'orgPersonManageUser'
                ];


  var JyRoles = [ 
                  'JygeneralUser',
                  'OperatingSystemAdministrator', 
                  'SupportSystemAdministrator',
                  'InformationSystemAdministrator', 
                  'UserSystemAdministrator',
                  'ProductSystemAdministrator',
                  'ThirdPartyPlatformSystemAdministrator'
                ];

  initRoles(orgRoles,'OrgRoleObject');
  initRoles(JyRoles, 'JyRoleObject');

  function initRoles(roleNames, objectName) {
      async.map(roleNames, function (item, cb) {
        var roleName = item
        var key = roleName + "Role"
        app.models.Role.find({where:{name:roleName}}, function(err, roles){
              if (err || roles.length != 1){
                app.models.Role.create({
                  name: roleName,
                  ownerId: 0
                }, function(err, role) {
                  if (err){
                    cb(err);
                  }
                  app[key] = role;
                  cb(null,role);
                }); 
              } else {
                app[key] = roles[0];
                cb(null,roles[0]);
              }
          });

      }, function (err, results) {
        app[objectName] =  _.zipObject(roleNames, results);
      })
  }                
// to grant a role to user, 
  grantRole = function (userId, roleName, cb) {
    var User = app.models.user;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    Role.find({ name: roleName }, function (err, role) {
      if (err || !role) {
        //trying to create a role
        Role.create({
          name: roleName
        }, function (err, role) {
          grant(role, userId, cb);
        });
      } else {
        grant(role, userId, cb);
      }
    });


    function grant(role, userId, callback) {
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function (err, principal) {
        return callback(err);
      });
    }
  };

};
