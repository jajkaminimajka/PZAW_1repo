const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { sequelize } = require('./models');

const indexRouter = require('./routes/index');
const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/items', itemsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Błąd serwera');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server działa na http://localhost:${PORT}`);
  });
});
