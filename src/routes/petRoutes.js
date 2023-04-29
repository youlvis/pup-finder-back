const express = require('express');
const multer = require('multer');
const PetController = require('../controllers/petController');
const { authenticateUser } = require('../middleware/verifyAccesToken');


const router = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: function (req, file, cb) {
            // Agregar una extensión de archivo al nombre del archivo
            cb(null, file.originalname + '-' + Date.now() + '.jpg');
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/getPetLost', authenticateUser, upload.single('image'), PetController.getPetLost);

module.exports = router;
