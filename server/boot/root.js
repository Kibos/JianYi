module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());  //  This code says that for any GET request to the root URI ("/"), the application will return the results of loopback.status().
  // server.use(router);
};
