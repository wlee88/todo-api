var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = require('./todos.js');

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
  var matchedTodo;
  todos.forEach((todo, index) => {
    if (todo.id === todoId){
      matchedTodo = todo;
    };
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  }
  else {
    res.status(404).send(`No Matches found for id: ${todoId}`);
  }

});

app.listen(PORT, () => {
  console.log(`express is listening on port ${PORT}`);
})
