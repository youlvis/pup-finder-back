const { RekognitionClient, DetectCustomLabelsCommand, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const fs = require('fs');
const logger = require('../utils/logger');

const petLabels = ['Dog', 'Cat', 'Pet'];

// Configuración de las credenciales de AWS
const credentials = {
    accessKeyId: process.env.accessKey,
    secretAccessKey: process.env.secret
};
const region = process.env.region;

// Creación de los clientes de DynamoDB y Rekognition
const dynamoClient = new DynamoDBClient({ region, credentials });
const rekognitionClient = new RekognitionClient({ region, credentials });


const getPetByImg = async (pathImage) => {
    try {
        const isPet = await detectPet(pathImage, petLabels);
        if (isPet) {
            logger.error('La imagen contiene una mascota.');
            // const resRekognition = await detectCustomLabels(pathImage)
            const resDynamo = await searchPets(["loki001", "berlin001"]);
            return resDynamo;
        } else {
            logger.error('La imagen no contiene una mascota');
            const error = new Error();
            error.type = 'ImageNotContainPetError';
            error.status = 404;
            throw error;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

async function detectPet(imagePath, petLabels) {
    try {
        const image = await fs.promises.readFile(imagePath);
        const params = {
            Image: {
                Bytes: image,
            },
            MaxLabels: 10,
            MinConfidence: 80
        };

        const command = new DetectLabelsCommand(params);
        const result = await rekognitionClient.send(command);
        const labels = result.Labels.map(label => label.Name);
        return labels.some(label => petLabels.includes(label));
    } catch (err) {
        logger.error("Error al detectar etiquetas en la imagen:", err);
        throw err;
    }

}

// Función para buscar los labels en rekognition
async function detectCustomLabels(imagePath) {
    try {
        const image = await fs.promises.readFile(imagePath);
        const params = {
            Image: {
                Bytes: image,
            },
            MaxLabels: 10,
            MinConfidence: 10,
            ProjectVersionArn: process.env.proyectVersion
        };

        const command = new DetectCustomLabelsCommand(params);
        const response = await rekognitionClient.send(command);
        const labels = response.CustomLabels.map(label => label.Name);
        return labels;
    } catch (err) {
        logger.error("Error al detectar etiquetas personalizadas en la imagen:", err);
        throw err
    }
}

async function searchPets(petId) {
    try {
        const petPromises = petId.map(async (petIdItem) => {
            const params = {
                TableName: process.env.nameTable,
                KeyConditionExpression: 'PetID = :hkey',
                ExpressionAttributeValues: marshall({
                    ':hkey': petIdItem
                })
            };
            const command = new QueryCommand(params);
            const results = await dynamoClient.send(command);
            return {
                petId: petIdItem,
                results: results.Items.map((item) => unmarshall(item))
            };
        });
        const pets = await Promise.all(petPromises);
        const petData = pets.flatMap((pet) => (
            pet.results[0]
        ));
        return petData;
    } catch (err) {
        logger.error('Error al buscar en DynamoDB:', err);
        throw err;
    }
}

module.exports = {
    getPetByImg,
}

