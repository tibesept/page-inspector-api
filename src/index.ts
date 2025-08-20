import express from 'express';
import { pinoHttp } from 'pino-http';

import router from './routes';
import logger from './logger';
import { config } from './config';
import errorHandler from './middlewares/errorHandler';

const app = express();
const pino = pinoHttp({ logger })

// MIDDLEWARES
app.use(express.json());
app.use(pino);

// ROUTER
app.use('/api', router);

// ERROR HANDLER
app.use(errorHandler);

// RUN
app.listen(config.port, () => {
    logger.info(`Listening port: ${config.port}`);
});

