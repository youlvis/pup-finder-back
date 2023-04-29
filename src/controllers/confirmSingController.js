const confirmSignUp = require('../services/confirmSingUp');

async function confirmSignUpController(req, res, next) {
    const { email, confirmationCode } = req.body;
    try {
        const result = await confirmSignUp.confirmSignUp(email, confirmationCode);
        return res.status(200).json({ message: 'User confirmed', data: result });
    } catch (error) {
        logger.error(error);
        return res.status(400).json({ message: 'Confirmation failed', error });
    }
}

module.exports = { confirmSignUpController };
