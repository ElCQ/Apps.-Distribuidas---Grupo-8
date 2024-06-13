import express from 'express';
import bodyParser from 'body-parser';
import routerAPI from "./routers/router.js";
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';
import config from './config/config.js';

const app = express();
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//routes
app.use('/api/',routerAPI);
//not implemented 
app.all('*', (req, res) => {
    const {method, url} = req;
    logger.warn(`Ruta ${method} ${url} no implementada`);
    res.status(404).json({error:-2, mensaje: "Ruta no implementada"});
})
//errorHandler
app.use(errorHandler);
//server configuration
app.listen(config.PORT, () => logger.info(`Successfully connected to port ${config.PORT}`));
app.on("error", err => logger.error(`${err}`));