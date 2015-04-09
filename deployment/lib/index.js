'use strict';
var shell = require('shelljs');
var config = require("./config.js");
var fs = require("fs");

var _CMD = {
    "docker": {
        "exec": function (args) {
            if (args && args.length > 1) {
                if (_CMD.docker[args[1]]) {
                    args.shift();
                    _CMD.docker[args[0]](args);
                }
                else
                    return console.log("Unkown Operation [" + args[1] + "]");
            }
            else
                return console.log("Command [docker] needs an operation")
        }
        ,
        "buildImage": function (args) {
            if (args && args.length > 1) {
                if (args[1][0] === "/")
                    args[1] = args[1].substr(1);
                if (args[1][args[1].length - 1] === "/")
                    args[1] = args[1].substr(0, args[1].length - 1);
                var dockerFile = config.imagesFolder + args[1] + "/Dockerfile";
                var soajsConfFile = config.imagesFolder + args[1] + "/soajs.conf.js";
                fs.stat(dockerFile, function (err, stats) {
                    if (err) throw err;
                    fs.stat(soajsConfFile, function (err, stats) {
                        var deleteProfiles = false;
                        var build = function () {
                            var label = config.repositoryPrefix + "_" + args[1].replace(/\//g, "_");
                            var execString = 'docker build -t ' + label + ' .';
                            console.log("About to run: " + execString);
                            shell.pushd(config.imagesFolder + args[1] + "/");
                            shell.exec(execString, function (code, output) {
                                if (deleteProfiles)
                                    shell.rm('-rf', soajsConf.profiles, config.imagesFolder + args[1] + "/FILES/profiles");
                                shell.popd();
                            });
                        };
                        if (!err) {
                            delete require.cache[require.resolve(soajsConfFile)];
                            var soajsConf = require(soajsConfFile);
                            if (soajsConf.profiles) {
                                var profilesFolder = config.imagesFolder + soajsConf.profiles;
                                fs.stat(profilesFolder, function (err, stats) {
                                    if (err) throw err;
                                    shell.cp('-R', config.imagesFolder + soajsConf.profiles, config.imagesFolder + args[1] + "/FILES/profiles");
                                    deleteProfiles = true;
                                    return build();
                                });
                            }
                            else
                                return build();
                        }
                        else
                            return build();
                    });
                });
            }
            else
                return console.log("Operation [buildImage] needs arguments");
        }
    }
};

function main(args) {
    if (_CMD[args[2]]) {
        args.shift();
        args.shift();
        _CMD[args[0]].exec(args);
    }
    else {
        return console.log("Unkown command [" + process.argv[2] + "]")
    }
}

if (process.argv.length < 3)
    return console.log("You did not specify any command");

main(process.argv);