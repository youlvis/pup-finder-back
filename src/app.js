require('dotenv').config();
const cors = require("cors");
const express = require('express');
const morgan = require('morgan');

//app
const app = express();

//route
const petRoute = require('./routes/petRoutes');

//setting
app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');
app.use(cors({
    origin: '*'
}));

//routes
app.use('/pet', petRoute);

//middlewares
app.use(morgan('dev'));
app.use(express.json());


//server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
