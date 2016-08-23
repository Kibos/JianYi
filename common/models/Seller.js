module.exports = function(Seller) {

    // Seller.

    // User.getApp(function(err, app) {
    //     app.models.product
    // }

//find not v user
    Seller.findNotVerifySeller = function (cb) {
        Seller.find( { where:{ JyVerify:false } }, function (err,params) {
            if(err) cb(err);
            cb(null, params);
        })
    };
    Seller.remoteMethod(
        'findNotVerifySeller', {
            returns: { arg: 'Sellers', type: ['Seller'], root: true },
            http: {  path: '/findNotVerifySeller', verb: 'get' }
        }
    );

//find v user
    Seller.findVerifySeller = function (cb) {
        Seller.find( { where:{ JyVerify:true } }, function (err,params) {
            if(err) cb(err);
            cb(null, params);
        })
    };
    Seller.remoteMethod(
        'findVerifySeller', {
            returns: { arg: 'Sellers', type: ['Seller'], root: true },
            http: {  path: '/findVerifySeller', verb: 'get' }
        }
    );

//v a not v uer 
    Seller.VerifySeller = function(kid, cb) {
        Seller.find( { where:{ id:kid } }, function (err, seller) {
            if(err) cb(err);
            seller[0].updateAttributes({JyVerify: true }, function(err,res){
                    if(err) cb(err);
                    cb(null,res);
            })
        })
    };

    Seller.remoteMethod(
        'VerifySeller', {
            accepts: { arg: 'id', type: 'string' },
            returns: { arg: 'flag', type: 'object', root: true },
            http: {  path: '/VerifySeller', verb: 'get' }
        }
    );

};
