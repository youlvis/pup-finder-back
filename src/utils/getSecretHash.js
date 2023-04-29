const crypto = require('crypto');

function generateHash(secret, username, clientId) {
    const message = username + clientId;
    const hash = crypto.createHmac('sha256', secret).update(message).digest('base64');
    return hash;
}

module.exports = {
    generateHash
}