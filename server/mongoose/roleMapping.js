var mongoose = require('mongoose');
var loopback = require('loopback');
var _ = require('lodash');

var obj;

module.exports = roleMapping;
function roleMapping(app, model) {
  if (!obj) {
    initModel(app, model);
  }
  return obj;
}

function initModel(app, model) {

// 生成schema
var schemaDefinition = {
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'role'}
};

var schema = new mongoose.Schema(schemaDefinition, { collection:'RoleMapping', timestamps: true});
schema.statics.findByPrincipalId = function(Id, callback) {
    return this.model('roleMapping').find({principalId: Id}, callback);
};
// 组装返回的对象
obj = {
  schema: schema,
};

var roleMapping = model;


}
