import express from 'express' //importamos express

const app = express();

app.get('*', (req, res) => {
  res.send({ hello: 'express' });
});

app.listen(3000, (err) => {
  if (err) console.error();
  else console.log('Server running on port: 3000');
});
