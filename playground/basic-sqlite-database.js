var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect' : 'sqlite',
  'storage' : __dirname + 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1,250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

sequelize.sync(
   {'force': true   } //automatically wipes the database each time
).then(() => {
  console.log('Everything is synced');
  Todo.create({
    description: 'Go to Australia!'
  })
  .then((todo) =>{
    return Todo.create({
      description: "Something else"
    });
  })
  .then(() => {
    return Todo.findAll( {
      where: {
        description: {
          $like: '%Australia%'
        }
      }
    })
  })
  .then((todos) => {
    if (todos) {
      todos.forEach((todo) => {
        console.log(todo.toJSON());
      });
    }
  })

  .catch((err) => {
    console.log(`Error: ${err}`);
  });
})
