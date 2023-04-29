const handleHttp = (res, error) => {
    const status = error.status || 400;
    res.status(status);
    res.json({ error: error });
};

module.exports = handleHttp;
