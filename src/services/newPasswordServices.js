const { CognitoIdentityProviderClient, RespondToAuthChallengeCommand } = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require('crypto');

const poolData = {
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId
};

const secret = process.env.secret_client;

const clientOptions = {
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKey,
        secretAccessKey: process.env.secret
    }
};

const clientCognito = new CognitoIdentityProviderClient(clientOptions);

// Iniciar sesión de usuario en Cognito
async function newPassword(email, newPassword, sessionToken) {
    const authParams = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: poolData.ClientId,
        ChallengeResponses: {
            NEW_PASSWORD: newPassword,
            USERNAME: email,
            SECRET_HASH: generateHash(secret, email, poolData.ClientId)
        },
        Session: sessionToken
    };
    const command = new RespondToAuthChallengeCommand(authParams);
    try {
        const result = await clientCognito.send(command);
        logger.info(result);
        return result
    } catch (err) {
        logger.error(err, err.stack);
        throw err
    }
}

function generateHash(secret, username, clientId) {
    const message = username + clientId;
    const hash = crypto.createHmac('sha256', secret).update(message).digest('base64');
    return hash;
}

module.exports = { newPassword };
