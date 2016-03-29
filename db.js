var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialiect: 'postgres'
  });
} else {
 sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': `${__dirname}/data/dev-todo-api.sqlite`
  });
};
var db = {};

db.todo = sequelize.import(`${__dirname}/model/todo.js`);
db.user = sequelize.import(`${__dirname}/model/user.js`);

//associations
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
