const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

const users = [];

app.use(cors());
app.use(express.json());

// const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user; // todos conseguem utilizar o user a partir dessa atribuição
  return next();
}

function checksExistsUserTodos(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todoFound = user.todos.find((todo) => todo.id === id);

  if (!todoFound) {
    return response.status(404).json({ error: "Todo not found!" });
  }
  request.todo = todoFound;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExist = users.some((user) => user.username === username);

  if (userAlreadyExist) {
    return response.status(400).json({ error: "User already exists!" });
  }
  const user = {
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: [],
  };
  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsUserTodos,
  (request, response) => {
    const { title, deadline } = request.body;
    const { todo } = request;
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsUserTodos,
  (request, response) => {
    const { todo } = request;
    todo.done = true;
    return response.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsUserTodos,
  (request, response) => {
    // Complete aqui
    const { user, todo } = request;

    // splice
    user.todos.splice(todo, 1);

    return response.status(204).json();
  }
);

module.exports = app;
