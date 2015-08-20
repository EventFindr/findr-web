var path = require("path");

var connect = require("connect");
var serve = require("serve-static");

connect().use(serve(path.join(__dirname, "dist"))).listen(8000);
