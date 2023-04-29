const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'error'
        })
    ]
});

module.exports = logger;
