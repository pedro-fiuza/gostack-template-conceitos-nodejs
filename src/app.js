const express = require("express");
const cors = require("cors");

 const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateExistsId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ message: 'Incorrectly id!'});
  }

  const repositorieIndex = repositories.findIndex(x => x.id === id);

  if(repositorieIndex < 0) {
    return response.status(400).json({ message: 'Repositorie not found!'});
  }

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateExistsId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(x => x.id === id);

  const { likes } = repositories[repositorieIndex];

  repositories[repositorieIndex] = { id, title, url, techs, likes };

  const repositorie = repositories[repositorieIndex];

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(x => x.id === id);

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(x => x.id === id);

  const { title, url, techs, likes } = repositories[repositorieIndex];

  repositories[repositorieIndex] = { id, title, url, techs, likes: likes + 1 };

  const repositorie = repositories[repositorieIndex];

  return response.json(repositorie);
});

module.exports = app;
