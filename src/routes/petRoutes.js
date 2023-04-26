const express = require('express');
const multer = require('multer');

const PetController = require('../controllers/petController');


const router = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: function (req, file, cb) {
            // Agregar una extensión de archivo al nombre del archivo
            cb(null, file.originalname + '-' + Date.now() + '.jpg');
        }
    })
});

router.post('/getPetLost', upload.single('image'), PetController.getPetLost);

module.exports = router;
