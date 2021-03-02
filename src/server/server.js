import express from 'express'; //importamos express
import dotenv from 'dotenv';

dotenv.config();

const { ENV, PORT } = process.env;
const app = express();

if (ENV === 'development') {
  console.log(ENV);
}

app.get('*', (req, res) => {
  res.send({ hello: 'express' });
});

app.listen(PORT, (err) => {
  if (err) console.error();
  else console.log('Server running on port: 3000');
});
