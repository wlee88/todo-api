var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000

app.get('/', (req,res) => {
  res.send("TODO api Root");
})

app.listen(PORT, () => {
  console.log(`express is listening on port ${PORT}`);
})
