const responseStatus = {
    "success" : 200,
    "badRequest": 404
}

const usersLoginReq = {
    userName: "string",
    password: "string"
}

const usersRegistrationReq = {
    firstName: "string",
    mobile: "string",
    email: "string",
    userName: "string",
    password: "string",
}

module.exports = {responseStatus, usersLoginReq, usersRegistrationReq}