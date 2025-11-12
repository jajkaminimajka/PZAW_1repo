const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let countries = [
  { name: 'Polska', capital: 'Warszawa' },
  { name: 'Niemcy', capital: 'Berlin' },
  { name: 'Francja', capital: 'Paryż' }
];



app.get('/', (req, res) => {
  res.render('index', { countries });
});

app.get('/api', (req, res) => {
  res.json(countries);
});

app.post('/add', (req, res) => {
  const { name, capital } = req.body;

  if (name && capital) {
    countries.push({ name, capital });
  }

  res.redirect('/');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
