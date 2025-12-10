const { sequelize, Item } = require('./models');

(async () => {
  await sequelize.sync({ force: true });
  await Item.bulkCreate([
    { title: 'BMW', description: 'M3', quantity: 1 },
    { title: 'Lexus', description: 'IS300', quantity: 3 }
  ]);
  console.log('Dane testowe dodane');
  process.exit();
})();
