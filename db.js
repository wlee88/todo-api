var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': `${__dirname}/data/dev-todo-api.sqlite`
});
var db = {};

db.todo = sequelize.import(`${__dirname}/model/todo.js`);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
