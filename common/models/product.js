module.exports = function(Product) {
  //-----------------------------------------------------------
  //价格区间查询商品 1
  Product.productOrderList = function(argObj,cb) {
    Product.find({argObj}, function(err,instances){
      // {where:{price:{gte:mixPrice,lte:maxPrice}},order: 'price DESC'}
      if(err) { cb(err); }
      cb(null,instances);
    });
  };
  Product.remoteMethod('productOrderList', {
    accepts: [{arg: 'argObj',type: 'object',  http: { source: 'body' }}],
    returns: {arg: 'instances', type: 'array',root:true},
    http: {path:'/productOrderList', verb: 'get'}
  });
  //-----------------------------------------------------------
  //用户旗下的商品  1
  Product.productByUserID = function(id,cb) {
  	Product.find({where:{owner_id:id}}, function(err,instances){
  		if(err) { cb(err); }
  		cb(null,instances);
  	});
  };
  Product.remoteMethod('productByUserID', {
  	accepts: [{arg: 'id',type: 'string',required: true}],
  	returns: {arg: 'Product', type: 'array',root:true},
  	http: {path:'/productByUserID', verb: 'get'}
  });


  //-----------------------------------------------------------
  //价格区间查询商品 1
  Product.productByPrice = function(mixPrice,maxPrice,cb) {
  	Product.find({where:{price:{gte:mixPrice,lte:maxPrice}},order: 'price DESC'}, function(err,instances){
  		if(err) { cb(err); }
  		cb(null,instances);
  	});
  };
  Product.remoteMethod('productByPrice', {
  	accepts: [{arg: 'mixPrice',type: 'number',required: true},{arg: 'maxPrice', type: 'number',required: true}],
  	returns: {arg: 'instances', type: 'array',root:true},
  	http: {path:'/productByPrice', verb: 'get'}
  });
  //-----------------------------------------------------------
  //日期区间查询商品
  Product.productByDate = function(mixDate,maxDate,cb) {
  	Product.find({where:{createdAt:{gte:mixDate,lte:maxDate}}}, function(err,instances){
  		if(err) { cb(err); }
  		cb(null,instances);
  	});
  };
  Product.remoteMethod('productByDate', {
  	accepts: [{arg: 'mixDate',type: 'date',required: true},{arg: 'maxDate', type: 'date',required: true}],
  	returns: {arg: 'Product', type: 'array',root:true},
  	http: {path:'/productByDate', verb: 'get'}
  });
  //-----------------------------------------------------------
  //通过商品名称查询商品 1
  Product.productByName = function(proname,cb) {
  	Product.find({where: {name:proname}},function(err,instances){
  		if(err) { cb(err); }
  		cb(null,instances);
  	});
  };
  Product.remoteMethod('productByName', {
  	accepts: [{arg: 'proname',type: 'string',required: true}],
  	returns: {arg: 'instances', type: 'array',root:true},
  	http: {path:'/productByName', verb: 'get'}
  });


  //-----------------------------------------------------------
  //通过商品名称模糊查询商品 1
  Product.fuzzySearchByName = function(proName,cb) {
  	Product.find({where:{ name: {like:proName}}},function(err,instances){
  		if(err) { return cb(err); }
  		cb(null,instances);
  	});
  };
  Product.remoteMethod('fuzzySearchByName', {
  	accepts: [{arg: 'proName',type: 'string',required: true}],
  	returns: {arg: 'product', type: 'array',root:true},
  	http: {path:'/fuzzySearchByName', verb: 'get'}
  });

};
