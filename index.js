const express = require('express');

const server = express();

server.use(express.json()); // Plugin para Express entender JSON
//localhost:3000/teste
// Query params = ?teste=1
// Route params = /users/1
// Request body = {"name": "Guilherme"} ** payload
// CRUD - Create, Read, Update, Delete
const users = ['Diego','Claudio','Pedro'];

function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status('400').json({ error: 'name field is required'});
  }
  return next();
}

function checkUserInArray(req, res, next){

  const user = users[req.params.index];

  if(!user){
    return res.status('400').json({ error: 'Index does not exists!'});
  }

  req.user = user; // Manda a informação no req para os outros MiddleWare que o usam

  return next();
}

server.use('/users', (req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  
  //return next();
  next();

  console.timeEnd('Request'); // Só é executado após o outro middleware ser executado
});

server.get('/users',(req,res) =>{
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  //return res.send('Hello World');
  //const nome = req.query.nome; //Utilizando query params
  //const nome = req.params.id;
  //const { index } = req.params;
  //return res.json({ message: `Buscando usuário ${nome}` });
  //return res.json(users[index]);
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  
  users.splice(index, 1);
  return res.send(); // retorna 200 OK
  //return res.json(users);
});

server.listen(3000);