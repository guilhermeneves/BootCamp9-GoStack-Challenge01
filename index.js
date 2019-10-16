const express = require('express');

const server = express();

server.use(express.json()); // Plugin para Express entender JSON

const projects = [];
var receivedRequests = 0;

function checkProjectExists(req, res, next){
  const { id } = req.params;
  projectIndex = projects.findIndex(x => x.id == id)
  projectExist = projectIndex != -1;

  if(!projectExist){
    return res.status('400').json({error:'id requested does not exists.'});
  }

  req.index = projectIndex;

  return next();
}

function checkProjectNotExists(req, res, next){
  const { id } = req.body;
  projectIndex = projects.findIndex(x => x.id == id);
  projectExist = projectIndex != -1;

  if(projectExist){
    return res.status('400').json({error:'id requested is already in use.'});
  }

  return next();
}

server.use('/projects',(req, res, next) => {
  receivedRequests += 1;

  console.log(`Total Received Requests: ${receivedRequests}`);

  next();
});

server.post('/projects', checkProjectNotExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({id: id,
  title: title,
  tasks: []});

  return res.send();
});

server.get('/projects', (req, res) => {
  //Removing id from the result
  const projectsWithoutId = projects.map(({id,...rest}) => ({...rest}));
  
  return res.json(projectsWithoutId);
});

server.put('/projects/:id', checkProjectExists, (req, res) =>{
  const { title } = req.body;

  projects[req.index].title = title;

  return res.send();
});

server.delete('/projects/:id', checkProjectExists, (req, res) =>{
  projects.splice(req.index,1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.send();
})

server.listen(3000);