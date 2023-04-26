const handleHttp = (res, error = 'Ocurrió un error en el servidor') => {
    res.status(400);
    res.send({ error });
}

module.exports = handleHttp;
