const { CognitoIdentityProviderClient, SignUpCommand, } = require("@aws-sdk/client-cognito-identity-provider");
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

async function signUp(email, password) {
    const signUpParams = {
        ClientId: poolData.ClientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email,
            },
        ],
        ValidationData: [
            {
                Name: "email",
                Value: email,
            },
        ],
        SecretHash: generateHash(secret, email, poolData.ClientId),
    };

    const command = new SignUpCommand(signUpParams);

    try {
        const result = await client.send(command);
        logger.info("Registration successful:", result);
        return result;
    } catch (err) {
        logger.error("Registration failed:", err);
        throw err;
    }
}

module.exports = { signUp };
