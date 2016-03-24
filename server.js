var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var _ = require("underscore");
var db = require("./db.js");
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("TODO api Root");
});

//GET /todos
// app.get('/todos', (req,res) => {
//   res.json(todos);
// });

//GET /todos?completed=true&q=something

app.get('/todos', (req, res) => {
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: `%${query.q}%`
    }
  };

  db.todo.findAll({where: where})
    .then((todos) => {
      res.json(todos);
    }, (error) => {
      res.status(500).send();
    });

});
//GET /todo/:id
app.get('/todos/:id', (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  db.todo.findById(todoId)
  .then((todo) => {
    if (!!todo) {
      res.json(todo);
    } else {
      res.status(404).send();
    }
  },(err) => {
    res.status(500).send(err)
  });

  // if (matchedTodo) {
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send(`No Matches found for id: ${todoId}`);
  // }
});

// POST /todos/
app.post('/todos', (req, res) => {
  var todo = _.pick(req.body, 'description', 'completed');
  //
  // if (!(_.isBoolean(todo.completed) || _.isString(todo.description)) || todo.description.trim().length === 0) {
  //   return res.status(400).send();
  // }
  db.todo
    .create(todo)
    .then(()=> {
      res.json(todo);
    }, (error) => {
      res.status(400).json(error)
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  var todoId = parseInt(req.params.id, 10);

  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted === 0 ){
      res.status(404).send({
        error: "no todo with id"
      });
    } else {
      res.status(204).send();
    }
  },
    () => {
    res.status(500).send();
  });
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  //
  // if (!matchedTodo) {
  //   res.status(404).json({
  //     "error": "no todo found with id"
  //   });
  // } else {
  //   todos = _.without(todos, matchedTodo);
  //   res.json(matchedTodo);
  // }

});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  var body = _.pick(req.body, "description", "completed");
  var validAttributes = {};
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });

  if (!matchedTodo) {
    return res.status(404).send();
  };

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send("Completed was incorrect");
  };

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send("Description was incorrect");
  }

  // Things went right;
  matchedTodo = _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
})

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`express is listening on port ${PORT}`);
  });
});
