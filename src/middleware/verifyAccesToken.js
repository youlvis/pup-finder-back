const { CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider");
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const request = require('request-promise-native');

const UserPoolId = process.env.UserPoolId;
const region = process.env.region;
const clientOptions = {
    region: region,
    credentials: {
        accessKeyId: process.env.accessKey,
        secretAccessKey: process.env.secret
    }
};
const client = new CognitoIdentityProviderClient(clientOptions);

// Función para obtener las claves públicas
const getJwks = () => {
    return new Promise((resolve, reject) => {
        request({
            uri: `https://cognito-idp.${region}.amazonaws.com/${UserPoolId}/.well-known/jwks.json`,
            json: true,
        }).then(response => {
            resolve(response.keys);
        }).catch(error => {
            reject(error);
        });
    });
}

const authenticateUser = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];

        // Obtener las claves públicas en paralelo
        const [jwks, decodedToken] = await Promise.all([
            getJwks(),
            jwt.decode(accessToken, { complete: true })
        ]);

        const { kid } = decodedToken.header;
        const jwk = jwks.find((jwk) => jwk.kid === kid);
        const pem = jwkToPem(jwk);

        const user = await new Promise((resolve, reject) => {
            jwt.verify(accessToken, pem, { algorithms: ['RS256'] }, (err, decodedToken) => {
                if (err) return reject(err);
                resolve(decodedToken);
            });
        });

        if (user.iss !== `https://cognito-idp.${region}.amazonaws.com/${UserPoolId}`)
            throw new Error('Token de acceso no válido.');

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Token inválido' });
    }
};

module.exports = {
    authenticateUser
};
