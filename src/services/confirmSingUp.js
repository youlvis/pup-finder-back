const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
const logger = require('../utils/logger');
const { generateHash } = require('../utils/getSecretHash')

// Configurar la información de tu pool de Cognito
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

const client = new CognitoIdentityProviderClient(clientOptions);

async function confirmSignUp(email, confirmationCode) {

    const confirmSignUpParams = {
        ClientId: poolData.ClientId,
        ConfirmationCode: confirmationCode,
        Username: email,
        SecretHash: generateHash(secret, email, poolData.ClientId)
    };

    const command = new ConfirmSignUpCommand(confirmSignUpParams);

    try {
        const result = await client.send(command);
        logger.info("User confirmed:", result);
        return result;
    } catch (err) {
        logger.error("Confirmation failed:", err);
        return err;
    }
}

module.exports = {
    confirmSignUp
}
