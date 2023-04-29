const newPassword = require('../services/newPasswordServices');
const handleHttp = require('../utils/error.handle');

async function newPassUser(req, res) {
    try {
        const { email, password, tokeSession } = req.body;
        // Validar que los datos ingresados sean válidos
        if (!email || !password) {
            logger.error("error")
            return res.status(400).json({ error: 'Por favor, ingrese un correo electrónico y contraseña válidos.' });
        }
        // Autenticar al usuario usando el servicio de autenticación
        const response = await newPassword.newPassword(email, password, tokeSession);
        // Enviar los tokens de acceso y actualización al cliente
        res.send(response);
    } catch (error) {
        handleHttp(res, error)
    }
}


module.exports = { newPassUser };
