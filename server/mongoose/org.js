var mongoose = require('mongoose');
var loopback = require('loopback');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');
var _ = require('lodash');

var obj;

module.exports = org;
function org(app, model) {
  if (!obj) {
    initModel(app, model);
  }
  return obj;
}

function initModel(app, model) {

// 生成schema
var schemaDefinition = {
  type:{ type: String },
  name:{ type: String },
  address:{ type: String },
  verfyied: { type: Boolean, default: false },
  users: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'user'} }]
};

var schema = new mongoose.Schema(schemaDefinition, { collection:'org', timestamps: true});



// 生成接口需要的声明对象 merge方法！
var orgObj = _.merge({}, schemaDefinition, {});
var apiObject = 'orgObj';
var ds = app.datasources.transient;
ds.define(apiObject, orgObj);

// 组装返回的对象
obj = {
  schemaDefinition: schemaDefinition,
  schema: schema,
  apiObject: apiObject
};

var OrgloopMode = model;


// 开始创建接口

function log(params) {
  console.log(params);
}

var positionType = {
  generalUser: "generalUser",
  orgCreat: "orgCreat",
  orgGeneralUser: "orgGeneralUser",
  orgNewsManageUser: "orgNewsManageUser",
  orgProductsManageUser: "orgProductsManageUser",
  orgPersonManageUser: "orgPersonManageUser"
}


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

 function getUserOrgsWithUserId(userId, callback) {
    app.org.find({"users.id":userId }, callback);
};  

function userIsInOrg(Id, orgId, fun) {

   getUserOrgsWithUserId(Id, function (err, orgs) {
    if(err) fun(err);
    async.some(orgs, function(item,callback){
        callback(item._id.toString() === orgId);
    }, function(result) {
        if (result) {
            fun(null, true);
        }else {
            fun(null, false);
        }
    });

   });
}


// Org是 loopback的模型，用来暴露出接口
/**
 * 创建企业
 * data :
 *   {
     "type": "Business",or"government",
     "name": "jiangong",
     "address": "beijing",
     "verfyied": true,
     "users": [
       { "id":"57a00fd422f0ce581b8e9baf" }
     ]
   }
 * @param  {[type]}   data [description]
 * @param  {Function} cb   [description]
 * @return {[type]}   orgobject     [description]
 */
OrgloopMode.createOrg = function(data, cb) {

  // data里面的名字在new 的时候也要一样否则存不进去
  (new app.org(data))
  .save(function (err, instance) {
      if (err) {
        cb(err);
      }
      creaMappingWithUserIdAndPosition(data.users.id, positionType.orgCreat, function (err, result) {
        if(err) cb(err);
        cb(null, result);
      })
  });
};

OrgloopMode.remoteMethod(
  'createOrg', {
    accepts: { arg: 'org', type: 'orgObj', http: { source:'body' } },
    returns: { arg: 'org', type: 'orgObj', root: true },
    http: {  path: '/createOrg', verb: 'post' }
  }
);

// 删除企业{"orgId":"57a0685a5ada84143d19bd98","userId":""}
// {"email":"13165508732@qq.com","password":"password"}
OrgloopMode.deleteOrg = function(data, cb) {
  console.log(data)
  userIsInOrg(data.userId, data.orgId, function (err,result) {
    if(err) cb(err);
    if(result){
      console.log(1)
      app.org.remove({_id:data.orgId}, function (err) {
          if (err) {
            cb(err);
          }
          cb(null,true);
      })
    }
  })
};

OrgloopMode.remoteMethod(
  'deleteOrg', {
    accepts: { arg: 'org', type: 'object', http: { source:'body' } },
    returns: { arg: 'org', type: 'object', root: true },
    http: {  path: '/deleteOrg', verb: 'post' }
  }
);

/**
 * 增加企业用户
 * acl 为personMangeruser createOrguser
 * data userid orgid 职位信息(职位需要限制)
 * {"orgId":"57a066ae35ecc2d414c3081e","userId":"57a00f9f22f0ce581b8e9bad","position":"orgProductsManageUser"}
 */
OrgloopMode.addOrgUser = function (data, cb) {
    app.org.findByIdAndUpdate(
    data.orgId,
    {$push: { "users": { id:data.userId }} },
    {safe: true, upsert: true, new : true},
    function(err, instance) {
      if (err) {
        cb(err);
      }
      creaMappingWithUserIdAndPosition(data.userId, data.position, function (err, result) {
        if(err) cb(err);
        if(result) {
          cb(null, instance);
        }
      })
    }
  );
}

OrgloopMode.remoteMethod(
  'addOrgUser', {
    accepts: { arg: 'org', type: 'object', http: { source:'body' } },
    returns: { arg: 'org', type: 'orgObj', root: true },
    http: {  path: '/addOrgUser', verb: 'post' }
  }
);

// 删除企业用户{"orgId":"","deleteUserId":"","position":""}
OrgloopMode.deleteOrgUser = function (data, cb) {

    app.org.findByIdAndUpdate(
      data.orgId,
      {$pull: { "users": { id:data.deleteUserId } } },
      {safe: true, upsert: true, new : true},
      function(err, model) {
        if (err) {
          cb(err);
        }
        cb(null, model);
      }
    );
    //todo 删除用户的mapping，设置用户删除的权限，譬如只有上级删除下级。

}

OrgloopMode.remoteMethod(
  'deleteOrgUser', {
    accepts: { arg: 'org', type: 'object', http: { source:'body' } },
    returns: { arg: 'org', type: 'orgObj', root: true },
    http: {  path: '/deleteOrgUser', verb: 'post' }
  }
);


// 增加企业用户的权限{"userId":"57a00fd422f0ce581b8e9baf","position":"orgNewsManageUser"}，传过来的数据确保是本企业的人员？
OrgloopMode.addUserPermissions = function (data, cb) {

  creaMappingWithUserIdAndPosition(data.userId, data.position, function (err, result) {
    if(err) cb(err);
    if(result){
      cb(null,result);
    }
  })

}

OrgloopMode.remoteMethod(
  'addUserPermissions', {
    accepts: { arg: 'org', type: 'object', http: { source:'body' } },
    returns: { arg: 'org', type: 'orgObj', root: true },
    http: {  path: '/addUserPermissions', verb: 'post' }
  }
);


// 减少企业用户的权限{"userId":"","position":""}，其实就是删除角色map传过来的数据确保是本企业的人员？
OrgloopMode.reduceUserPermissions = function (data, cb) {
  app.roleMapping
    .find({principalId:data.userId})
    .populate('roleId')
    .exec(function (err, maps) {
      if (err) {
        return cb(err);
      }
      async.filter(maps, function(item,callback){
          var item = _.mapKeys(item.roleId, function(value, key) {
              return key + value;
            });
          callback( null,item["_doc[object Object]"].name === data.position );
      }, function(err,Kmap) {

          log(Kmap)

          async.each(Kmap,function(item, callback) {
            app.roleMapping.remove({_id:item._id}, function (err) {
              if(err) cb(err);
            })
          }, function(err) {
            if(err) cb(err);
            cb(null,"ok")
              log('1.2 err: ' + err);
          });
      });
    });
}

OrgloopMode.remoteMethod(
  'reduceUserPermissions', {
    accepts: { arg: 'org', type: 'object', http: { source:'body' } },
    returns: { arg: 'org', type: 'orgObj', root: true },
    http: {  path: '/reduceUserPermissions', verb: 'post' }
  }
);

//获取未审核过的企业
OrgloopMode.getALLNotVerfyiedOrg = function (cb) {
  app.org.find({verfyied:false}, function (err, result) {
    if(err) cb(err);
    cb(null, result);
  })
}
OrgloopMode.remoteMethod(
  'getALLNotVerfyiedOrg', {
    returns: { arg: 'org', type: 'object', root: true },
    http: {  path: '/getALLNotVerfyiedOrg', verb: 'get' }
  }
);
//获取审核过的企业
OrgloopMode.getALLVerfyiedOrg = function (cb) {
  app.org.find({verfyied:true}, function (err, result) {
    if(err) cb(err);
    cb(null, result);
  })
}
OrgloopMode.remoteMethod(
  'getALLVerfyiedOrg', {
    returns: { arg:'orgs', type: 'array' ,root: true},
    http: {  path: '/getALLVerfyiedOrg', verb: 'get' }
  }
);


//通过企业id认证
OrgloopMode.confirmOrgVerfyiedWithId = function (orgId, cb) {
  app.org.findByIdAndUpdate(
    orgId,
     { "verfyied": true },
    {safe: true, upsert: true, new : true},
    function(err, model) {
      if (err) {
        cb(err);
      }
      cb(null, model);
    }
  );
}
OrgloopMode.remoteMethod(
  'confirmOrgVerfyiedWithId', {
    accepts: { arg: 'orgId', type: 'string' },
    returns: { arg: 'org', type: 'object', root: true },
    http: {  path: '/confirmOrgVerfyiedWithId', verb: 'get' }
  }
);

// 获取企业用户 通过企业id
// 参数是org id ，并且将会显示里面所有用户的详细信息
OrgloopMode.getOrgUsersById = function(id, cb) {
  app.org
    .findOne({_id:id})
    .populate('users.id')
    .exec(function (err, instance) {
      if (err) {
        return cb(err);
      }
      async.map(instance.users,function (item,kcb) {
        getRolename(item.id._id.toString(), function (err, RoleName) {
          var de = {};
          de.name = RoleName;
          de.user = item.id;
          kcb(null, de);
        })
      },function (err,results) {
        cb(null, results);
      })
    });
  };

function getRolename(userId, cb) {
app.roleMapping
  .find({principalId:userId})
  .populate('roleId')
  .exec(function (err, maps) {
    if (err) {
      return cb(err);
    }
    var item = _.mapKeys(maps[0].roleId, function(value, key) {
        return key + value;
      });
    cb( null,item["_doc[object Object]"].name );
    // cb(null,maps);
  });
}
// /:id get 的时候url 展示是 xxx.baidu.com/chen
// 否则将是 xxx.baidu.com?id=chen
OrgloopMode.remoteMethod(
'getOrgUsersById', {
  accepts: { arg: 'id', type: 'string' },
  returns: { arg: 'org', type: ['object'], root: true },
  http: {  path: '/getOrgUsersById', verb: 'get' },
}
);

// {"k":"email","v":"13165508732@163.com"}
//获取审核过的企业
OrgloopMode.findUserByEmail = function (data,cb) {
  app.user.find( { email : data.email } , function (err, result) {
    if(err) cb(err);
    cb(null, result[0]);
  })
}
OrgloopMode.remoteMethod(
  'findUserByEmail', {
    accepts: { arg: 'data', type: 'object', http: { source:'body' } },
    returns: { arg:'user', type: 'object' ,root: true},
    http: {  path: '/findUserByEmail', verb: 'post' }
  }
);


}
