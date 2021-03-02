/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from 'express'; //importamos express
import dotenv from 'dotenv';
import webpack from 'webpack';

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

}

app.get('*', (req, res) => {
  res.send({ hello: 'express' });
});

app.listen(PORT, (err) => {
  if (err) console.error();
  else console.log('Server running on port: 3000');
});
