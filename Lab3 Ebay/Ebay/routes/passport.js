/**

 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var mongo = require('./mongo');
var mq_client = require('../rpc/client');
var bcrypt = require('./bCrypt.js');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayAppV2/services";
//var MongoClient = require('mongodb').MongoClient;

var loginDatabase = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {

        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.collection('users', connection);

            var msg_payload = {
                EmailId: username,
                Password:password
            }



            process.nextTick(function(){

                var option = {
                    ignoredNamespaces : true
                };
                var url = baseURL+"/home?wsdl";
                var args = {email:username};
                soap.createClient(url,option, function(err, client) {
                    client.login(args, function(err, user) {
                        if(err) {
                            return done(err);
                        }

                        var rs = JSON.parse(user.loginReturn);
                        if(!user) {
                            return done(null, false);
                        }


                        if(!bcrypt.compareSync(password, rs[0].password)) {
                            done(null, false);
                        }

                        done(null, rs);
                    })
                })


               /* mq_client.make_request('signin_queue',msg_payload, function(err,user){

                    if(err) {
                        return done(err);
                    }

                    if(!user) {
                        return done(null, false);
                    }


                    if(!bcrypt.compareSync(password, user.Password)) {
                        done(null, false);
                    }

                    console.log("Inside Passport: "+user.EmailId);
                    done(null, user);

                });
*/

                
            });
        });
    }));

}


