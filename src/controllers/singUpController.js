const singUpServices = require('../services/singUp');
const handleHttp = require('../utils/error.handle');

async function signUpUser(req, res) {
    try {
        const { email, password } = req.body;
        // Validar que los datos ingresados sean válidos
        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor, ingrese un nombre de usuario, correo electrónico y contraseña válidos.' });
        }
        // Registrar al usuario usando el servicio de registro
        const result = await singUpServices.signUp(email, password);

        res.send(result);
    } catch (error) {
        handleHttp(res, error)
    }
}

module.exports = { signUpUser };
