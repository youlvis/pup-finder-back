const authServices = require('../services/authServices');
const handleHttp = require('../utils/error.handle');

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        // Validar que los datos ingresados sean válidos
        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor, ingrese un correo electrónico y contraseña válidos.' });
        }
        // Autenticar al usuario usando el servicio de autenticación
        const tokens = await authServices.login(email, password);

        res.send(tokens);
    } catch (error) {
        handleHttp(res, error)
    }
}


module.exports = { loginUser };
