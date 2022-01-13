let validateRequest = function(actualInputs, validInputs) {
    var validatedRes = new Object();
    validatedRes.missingRequests = new Array();
    validatedRes.invalidRequests = new Array();
    validatedRes.valid = true;
    Object.entries(validInputs).forEach(([key, value]) => {
        //  check datatype of each input
        if(typeof actualInputs[key] != value && actualInputs[key] != undefined) {
            validatedRes.invalidRequests.push(key);
            validatedRes.valid = false;
        }

        //  check if input is missing
        if(actualInputs[key] == undefined) {
            validatedRes.missingRequests.push(key);
            validatedRes.valid = false;
        }
    })

    return validatedRes;
}

module.exports = {
    validateRequest: validateRequest
}


