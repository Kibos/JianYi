var mongoose = require('mongoose');
var loopback = require('loopback');
var _ = require('lodash');

var obj;

module.exports = JyUser;
function JyUser(app, model) {
  if (!obj) {
    initModel(app, model);
  }
  return obj;
}

function initModel(app, model) {

// 生成schema
var schemaDefinition = {};

var schema = new mongoose.Schema(schemaDefinition, { collection:'JyUser', timestamps: true});

// 组装返回的对象
obj = {
  schema: schema,
};

var JyUser = model;
// 获取所在的企业
JyUser.getOrgsWithJyUserId = function(filter, cb) {

  if (filter) {
    app.org.find( {"JyUsers.id":filter }, function (err, instance) {
      console.log(instance);
      cb(err, instance);
    });
  }

};
JyUser.remoteMethod(
  'getOrgsWithJyUserId', {
    accepts: { arg: 'filter', type: 'any' },
    returns: { arg: 'org', type: ['orgObj'],root: true },
    http: {  path: '/getOrgsWithJyUserId', verb: 'get' }
  }
);


//申请成为某企业的用户
// org.addOrgJyUser
// 修改这个方法把role设成false，到时候 管理员审核通过（查询到false JyUser） 重新设置用户为employee就成为了一个企业的用户

}
