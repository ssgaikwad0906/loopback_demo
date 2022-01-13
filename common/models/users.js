'use strict';
const requestValidator = require('../helpers/requestValidator');
const encryptionAlgo = require('../helpers/encryptionAlgo');
const constants = require('../constants');
// const 
module.exports = function(Users) {
    Users.observe('before save', function(ctx, next) {
        if(ctx.isNewInstance && ctx.instance !== undefined) {
            ctx.instance.createdDate = new Date();
        } else if(!ctx.isNewInstance && ctx.currentInstance !== undefined) {
            ctx.instance.modifiedDate = new Date();
        }
        next();
    })

    Users.beforeRemote('login', function(ctx, instance, next) {
        if(ctx.args.data.password != undefined) {
            let encryptedPassowrd = encryptionAlgo.encrypt(ctx.args.data.password);
            ctx.args.data.password = encryptedPassowrd.encryptedData
        }
        next();
    })

    Users.beforeRemote('registration', function(ctx, instance, next) {
        if(ctx.args.data.password != undefined) {
            let encryptedPassowrd = encryptionAlgo.encrypt(ctx.args.data.password);
            ctx.args.data.password = encryptedPassowrd.encryptedData
        }
        next();
    })
    
    Users.login = function(inputData, callback) {
        let validated = requestValidator.validateRequest(inputData, constants.usersLoginReq);
        if(!validated.valid) {
            let responseObj = {status: constants.responseStatus.badRequest, message: "Invalid inputs", data: validated};
            return callback(null, responseObj);
        }
        Users.find(
            {
                where: {username: inputData.username, password: inputData.password}
            },
            function(err, userObj) {
                if(!err && userObj != undefined) {
                    let responseObj = {status: constants.responseStatus.success, message: "Login successfull", data: userObj};
                    return callback(null, responseObj);
                } else {
                    if(err) {
                        return callback(err, null);
                    } else {
                        let responseObj = {status: constants.responseStatus.badRequest, message: "invalid username or password"};
                        return callback(null, responseObj);
                    }
                }
            }
        )
    }

    Users.registration = function(inputData, callback) {
        let validated = requestValidator.validateRequest(inputData, constants.usersRegistrationReq);
        if(!validated.valid) {
            let responseObj = {status: constants.responseStatus.badRequest, message: "Invalid inputs", data: validated};
            return callback(null, responseObj);
        }
        Users.findOne(
            {where: {username: inputData.username, email: inputData.email}},
            function(err, userObj) {
                if(err) {
                    return callback(err, null);
                }
                if(userObj == undefined) {

                    registerNewUser(inputData, function(err, newUser) {
                        if(err) {
                            let responseObj = {status: constants.responseStatus.badRequest, message: "Error while registering user", data: err};
                            return callback(null, responseObj);
                        } else {
                            let responseObj = {status: constants.responseStatus.success, message: "New user registered successfully", data: newUser};
                            return callback(null, responseObj);
                        }
                    })
                    
                } else {
                    let responseObj = {status: constants.responseStatus.success, message: "User already registered", data: userObj};
                    return callback(null, responseObj);
                }
            }
        )
    }

    function registerNewUser(newUser, callback) {
        Users.create(newUser, function(err, createdUser) {
            if(err && createdUser == undefined) {
                return callback(err, null);
            } else {
                return callback(null, createdUser);
            }
        })
    }

    //  custom callback listing
    Users.remoteMethod('login',
        {
            http: {verb: 'post', path: '/login'},
            description: 'User login api',
            accepts: [{arg: 'data', type: 'object', http: {source: 'body'}}],
            returns: {arg: 'res', type: 'string', root: true, http: {source: 'res'}}
        }
    )

    Users.remoteMethod('registration',
        {
            http: {verb: 'post', path: '/registration'},
            description: 'User registration api',
            accepts: [{arg: 'data', type: 'object', http: {source: 'body'}}],
            returns: {arg: 'res', type: 'string', root: true, http: {source: 'res'}}
        }
    )
};
