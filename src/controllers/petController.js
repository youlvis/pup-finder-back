const fs = require('fs').promises;
const petService = require('../services/petServices');
const handleHttp = require('../utils/error.handle');


const PetController = {
    getPetLost: async (req, res) => {
        const pathImage = req.file.path;
        try {
            const result = await petService.getPetByImg(pathImage);
            res.send(result)
        } catch (error) {
            handleHttp(res, error)
        } finally {
            if (pathImage) {
                await fs.unlink(pathImage);
            }
        }
    },
    recentlyReported: async (req, res) => {
        try {
            const result = await petService.searchPets(req.body);
            res.send(result)
        } catch (error) {
            logger.error(error);
            handleHttp(res, error);
        }
    },
};

module.exports = PetController;