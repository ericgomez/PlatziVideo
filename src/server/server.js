/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from 'express'; //importamos express
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';
import React from 'react';
import { renderToString } from 'react-dom/server'; //Funcion para renderear los componentes como string
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config'; //router
import { StaticRouter } from 'react-router-dom';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';

dotenv.config();

const { ENV, PORT } = process.env;
const app = express();

if (ENV === 'development') {
  console.log(ENV);
  // requiring all the dependencies
  // eslint-disable-next-line global-require
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  //creating a webpack compiler with our configurations
  const compiler = webpack(webpackConfig); //executing webpack with its configurations
  const serverConfig = { port: process.env.PORT, hot: true }; //declaring the port and enabling hot reload in dev server

  //adding the middlewares into the server
  app.use(webpackDevMiddleware(compiler, serverConfig)); //Middleware to compile all the files and put it on the server
  app.use(webpackHotMiddleware(compiler)); //Middleware to enable hot reload

} else {
  app.use(express.static(`${__dirname}/public`));
  // This...
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState) => {
  return (`<!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="assets/app.css" type="text/css"/> 
      <title>Platzi Video</title>
    </head>
    <body>
      <div id="app">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="assets/app.js" type="text/javascript"></script>
    </body>
  </html>`);
};

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();

  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes)}
      </StaticRouter>
    </Provider>,
  ); //con esta funcion preparamos el provider para el redux y el router,
  //dentro del router colocamos la funcion renderRoutes y le pasamos el archivo de las rutas
  res.send(setResponse(html, preloadedState));
};

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) console.error();
  else console.log('Server running on port: 3000');
});
