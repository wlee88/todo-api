var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var _ = require("underscore");
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.send("TODO api Root");
});

//GET /todos
app.get('/todos', (req,res) => {
  res.json(todos);
});

//GET /todo/:id
app.get('/todos/:id', (req,res) => {

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo =  _.findWhere(todos, { id: todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  }
  else {
    res.status(404).send(`No Matches found for id: ${todoId}`);
  }
});

// POST /todos/
app.post('/todos', (req,res) => {
  var todo = req.body;
  if (!(_.isBoolean(todo.completed)
  || _.isString(todo.description))
  || todo.description.trim().length === 0
  ) {
    return res.status(400).send();
  }

  todo.id = todoNextId++;
  todos.push(todo);
  res.json(todo);
})

app.listen(PORT, () => {
  console.log(`express is listening on port ${PORT}`);
})
