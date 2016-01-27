// var person = {
//   name: 'William',
//   age: 24
// };
//
// var updatePerson = (obj) => {
//   obj.age = 27;
// };
//
// updatePerson(person);
// console.log(person);

// Array Example

var grades = [15,80];

var addGrades = (gradesArr) => {
  // grades.push(newGrades);
  gradesArr.push(55);
  debugger; // use node debug filename to use this; cont to conintue repl to inspect
};

addGrades(grades);
console.log(grades);
