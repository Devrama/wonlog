import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import errorHandler from 'errorhandler';

// Create Express server
const app = express();

// Express configuration
// app.set('port', process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

export default app;
