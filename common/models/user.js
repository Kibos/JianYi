var AV = require('leancloud-storage');
var config = require('../../server/config.json');
var path = require('path');
var APP_ID = 'DINSYC4JEYthPaAmI0aXOiRW-gzGzoHsz';
 var APP_KEY = 'DSVRLT2YNoAOgzdwYzFhAcLD';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = function(user) {
  var User = user;



 //一个用户直接创建一个用户
  User.createUserWithUserData = function (data, callback) {
    User.create(data, function (err, inst) {
      if (err) {
        callback(err);
      }
      callback(err, inst);
    });
  };
  // ,root: true 参数直接返回结构体
  User.remoteMethod(
    'createUserWithUserData', {
      accepts: {
        arg: 'user',
        type: 'user',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'user',
        type: 'string',
        root: true
      },
      http: {
        'verb': 'post',
        'path': '/createAuserWithUserData'
      },
    }
  );


  // 很明显kuser数据通过remoteMethod回调传过来的  verify方法是user实例方法
  User.afterRemote(
    'createUserWithUserData',
    function (ctx, kuser, next) {
      console.log('> kuser.afterRemote triggered');
      console.log(kuser.email);
      var options = {
        type: 'email',
        to: kuser.email,
        from: '13165508732@163.com',
        subject: 'Thanks for registering.',
        template: path.resolve(__dirname, '../../server/views/verify.ejs'),
        redirect: '/verified',
        user: kuser
      };
      kuser.verify(options,
        function (err, response) {
          if (err) return next(err);
          console.log('> verification email sent:', response);
          next();
        }
      );
    }
  );


  // 请求发送验证码到用户，请求数据为手机号。{"phoneNum":"13165508732"}
  User.requestSmsCode = function (request, callback) {
    AV.Cloud.requestSmsCode({
      mobilePhoneNumber: request.phoneNum,
      name: '维擎科技有限公司',
      op: '新的验证码',
      ttl: 10
    }).then(function () {
      //发送成功
      callback(null, 'sendOk');

    }, function (err) {
      //发送失败
      callback(err);
    });

  };
  User.remoteMethod(
    'requestSmsCode', {
      accepts: {
        arg: 'phoneNum',
        type: 'phoneNum',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'string',
        root: true
      },
      http: {
        'verb': 'post',
        'path': '/requestSmsCode'
      }
    }
  );

  /**
   * 验证用户的验证码正确，需要验证码和手机号{"smsCode":714178,"phoneNum":"13165508732"}
   */
  User.verifySmsCode = function (data, callback) {
    AV.Cloud.verifySmsCode(data.smsCode, data.phoneNum).then(function () {
      //  验证成功
      callback(null, 'verifySmsCode is ok');

    }, function (err) {
      //验证失败
      callback(err);
    });

  };
  // ,root: true 参数直接返回结构体
  User.remoteMethod(
    'verifySmsCode', {
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'string',
        root: true
      },
      http: {
        'verb': 'post',
        'path': '/verifySmsCode'
      }
    }
  );

  //验证的时候要确定这个手机号码是对应的用户的,需要验证码，手机号，用户id，新密码
  //{"smsCode":428023,"phoneNum":"13165508732","password":"123456","id":"579a25992dbd647310ffa576"}
  User.rsetPasswordWithSmsCode = function (data, callback) {

    User.find({
      where: {
        'id': data.id
      }
    }, function (err, userArr) {

      if (err) {
        callback(err);
      }

      if (userArr[0].phoneNum.toString() === data.phoneNum) {
        AV.Cloud.verifySmsCode(data.smsCode, data.phoneNum).then(function () {
          //  验证成功
          userArr[0].updateAttributes({
            password: User.hashPassword(data.password)
          },
            function (err, instance) {
              if (err) {
                callback(err);
              }
              callback(null, 'ok');
            });
        },
          function (err) {
            //验证失败
            callback(err);
          });
      }
    });

  };
  User.remoteMethod(
    'rsetPasswordWithSmsCode', {
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'string',
        root: true
      },
      http: {
        'verb': 'post',
        'path': '/rsetPasswordWithSmsCode'
      }
    }
  );

  //send verification email after registration
  User.afterRemote('create', function (context, user, next) {
    console.log('> user.afterRemote triggered');
    console.log(user.email);
    var options = {
      type: 'email',
      to: user.email,
      from: '13165508732@163.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, function (err, response) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
        'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function (info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
      info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function (err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });


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
