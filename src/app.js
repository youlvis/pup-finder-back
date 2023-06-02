require('dotenv').config();
const cors = require("cors");
const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');

//app
const app = express();

//route
const petRoute = require('./routes/petRoutes');
const authRoute = require('./routes/authRoutes');

//setting
app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');
app.use(cors({
    origin: '*'
}));

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('¡OK!');
});

app.use('/pet', petRoute);
app.use('/user', authRoute);


//server
app.listen(PORT, () => {
    logger.info(`Server on port ${PORT}`);
});
