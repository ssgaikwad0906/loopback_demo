const crypto = require('crypto');

//Encrypting text
let encrypt = function(unencryptedPassword) {
    let cipher = crypto.createCipheriv(process.env.ALGORITHM, Buffer.from(process.env.KEY), process.env.IV);
    let encrypted = cipher.update(unencryptedPassword);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 }

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}


