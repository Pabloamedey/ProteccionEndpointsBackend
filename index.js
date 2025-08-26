const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

const productRouter = require('./routes/products.routes');
const usersRouter = require('./routes/users.routes');
const salesRouter = require('./routes/sales.routes');
const authRouter = require('./routes/auth.routes');

app.use('/productos', productRouter);
app.use('/usuarios', usersRouter);
app.use('/ventas', salesRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
