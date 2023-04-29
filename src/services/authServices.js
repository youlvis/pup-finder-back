const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");
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

// Iniciar sesión de usuario en Cognito
async function login(email, password) {
    // Configurar los parámetros para la autenticación
    const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: poolData.ClientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: generateHash(secret, email, poolData.ClientId)
        },
    };

    // Enviar la solicitud de autenticación a Cognito
    const command = new InitiateAuthCommand(authParams);
    try {
        const result = await client.send(command);
        // Si la autenticación fue exitosa, retornar los tokens de acceso y actualización
        logger.info("Autenticacion exitosa")
        return result;
    } catch (err) {
        // Si la autenticación falló, retornar un error con el mensaje de error
        logger.error("Error al autenticarse: ", err)
        return err;
    }
}

module.exports = { login };
