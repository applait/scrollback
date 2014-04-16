var log = require("../../lib/logger.js");
var fs = require("fs");
var jade = require("jade");
var core;
var roomNames = {};


module.exports = function(coreObject) {
    core=coreObject;
    fs.readFile(__dirname + "/loginrequired.html", "utf8", function(err, data){
        if(err) throw err;
        core.on("http/init", function(payload, callback) {
            payload.loginrequired = {
                config: data
            };
            callback(null, payload);
        }, "setters");
    });
   core.on("text", function(message, callback) {
        log("Heard \"text\" Event");
        if (message.session){
            var gateway = message.session.substring(0, message.session.indexOf(":"));
            if(gateway != "web") return callback();
        }
        if(message.type == "text" && message.from.indexOf("guest-")==0) {
            core.emit("getRooms",{id:message.to},function(err, data) {
                data = data.results;
                if(err) return callback(err);
                if(!data) callback();
                if(data.length == 0) return callback();
                if(data[0].params && data[0].params.loginrequired)
                    callback(new Error("AUTH_REQ_TO_POST"));
                else callback();
            });
        }
        else callback();
    }, "authorization");
}