const express = require('express');
const app = express();
const port = process.env.port || 3000;
const db = require('./models/sequalize');

app.use(express.json());

db.authenticate()
  .then(() => console.log('Exito al conectar a BD.'))
  .catch(() => console.log('Error al conectar a BD'));

app.use('/api/', require('./routes/login'));
app.use('/api/concepto', require('./routes/concepto'));
app.use('/api/concepto-lista', require('./routes/conceptoLista'));
app.use('/api/fecha', require('./routes/fecha'));
app.use('/api/usuario', require('./routes/usuario'));
app.use('/api/caja', require('./routes/caja'));
app.use('/api/cliente', require('./routes/cliente'));
app.use('/api/cheque', require('./routes/cheque'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});