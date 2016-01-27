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
  var queryParams = req.query;
  var filteredTodos = todos;

  if (queryParams.hasOwnProperty('completed')) {
    if (queryParams.completed === 'true') {
      filteredTodos = _.where(filteredTodos, {
        completed: true
      });
    } else {
      filteredTodos = _.where(filteredTodos, {
        completed: false
      });
    }
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, (todo) => {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
    });
  }
  // if has property and completed is equal to true
  // ._where(filteredTodos, completed === true)
  // else if (has property and completed is false)

  res.json(filteredTodos);
});
//GET /todo/:id
app.get('/todos/:id', (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send(`No Matches found for id: ${todoId}`);
  }
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
      res.json(todo.toJSON());
    })
    .catch((error) => {
      res.status(400).json(error)
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });

  if (!matchedTodo) {
    res.status(404).json({
      "error": "no todo found with id"
    });
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }

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
