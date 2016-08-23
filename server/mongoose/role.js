var mongoose = require('mongoose');
var loopback = require('loopback');
var _ = require('lodash');

var obj;

module.exports = role;
function role(app, model) {
  if (!obj) {
    initModel(app, model);
  }
  return obj;
}

function initModel(app, model) {

// 生成schema
var schemaDefinition = {};

var schema = new mongoose.Schema(schemaDefinition, { collection:'Role', timestamps: true});

schema.statics.findByName = function(Name, callback) {
    return this.model('role').find({name: Name}, callback);
};
// 组装返回的对象
obj = {
  schema: schema,
};

var role = model;


}
