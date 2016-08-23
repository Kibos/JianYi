var mongoose = require('mongoose');
var loopback = require('loopback');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');
var _ = require('lodash');

var obj;

module.exports = JyOrg;
function JyOrg(app, model) {
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
  users: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'JyUser'} }]
};

var schema = new mongoose.Schema(schemaDefinition, { collection:'JyOrg', timestamps: true});

// 生成接口需要的声明对象 merge方法！
var JyOrgObj = _.merge({}, schemaDefinition, {});
var apiObject = 'JyOrgObj';
var ds = app.datasources.transient;
ds.define(apiObject, JyOrgObj);

// 组装返回的对象
obj = {
  schemaDefinition: schemaDefinition,
  schema: schema,
  apiObject: apiObject
};

var JyOrgloopMode = model;


// 开始创建接口
// 建宜的操作大多数还是集中在别的模型(org, user...)上的，既然是对org操作那么是不是应该把方法写在对应的模型里面
// 所以建宜的模型就简单了，大概就是设计增加自身的用户，和管理自身的用户权限，比如说删除商品那么只需要调用商品的删除接口
// 那么用户管理的设置应该放在哪里呢，鉴于用户模型是继承自内建模型的，暂时还是将管理方法写在这里，也是和org保持一致
function log(params) {
  console.log(params);
}




}
