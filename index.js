const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "database.db");

let db = null;

const dbRunner = async () => {
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
  
      app.listen(3000, () => {
        console.log("Database has been connected and running at 3000");
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
dbRunner();

// register a user api
app.post("/register/", async (request, response) => {
  const { username, password } = request.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const usernameQuery = `SELECT * FROM user WHERE username = '${username}';`;

  const userExist = await db.get(usernameQuery);

  if (userExist === undefined) {
    if (password.length < 6) {
      response.status(400);
      response.send("Password is too short");
    } else {
      addUserQuery = `INSERT INTO user (username,password)
        VALUES ('${username}','${hashPassword}');`;
      const addUser = await db.run(addUserQuery);
      response.status(200);
      response.send("User created successfully");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});


//login api
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const checkUser = await db.get(checkUserQuery);

  if (checkUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isCorrectPassword = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (isCorrectPassword) {
      response.status(200);
      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//get all Blog list
app.get("/posts/", async (request, response) => {
  // const { username } = request.headers;
  const postQuery = `SELECT * FROM posts;`;
  const posts = await db.all(postQuery);
  response.send(posts);
});

//get blog by id
app.get("/posts/:id", async(request,response) => {
  const { id } = request.params;
  const checkId = `SELECT * FROM posts WHERE id = ${id};`;
  const idExist = await db.get(checkId);
  if (idExist === undefined) {
    response.status(400);
    response.send("Id not found");
  }else{
    response.status(200);
    response.send(idExist);
  }
})

// Creating a new blog
app.post("/posts/", async (request, response) => {
    const { author, blog } = request.body;
    const postQuery = `INSERT INTO posts(author,blog) VALUES ('${author}','${blog}');`;
    const addPost = await db.run(postQuery);
    response.send("Created a Blog");
});


//update a post
app.put("/posts/:id", async (request, response) => {
  const { id } = request.params;
  const { author, blog } = request.body;
  const checkId = `SELECT * FROM posts WHERE id = ${id};`;
  const idExist = await db.get(checkId);
  if (idExist === undefined) {
    response.status(400);
    response.send("Id not found");
  } else {
    const updateQuery = `UPDATE posts SET author = '${author}', blog = '${blog}' WHERE id = ${id};`;
    await db.run(updateQuery);
    response.send("Blog updated");
  }
});

//delete a post
app.delete("/posts/:id", async (request, response) => {
  const { id } = request.params;
  const checkId = `SELECT * FROM posts WHERE id = ${id};`;
  const idExist = await db.get(checkId);
  if (idExist === undefined) {
    response.status(400);
    response.send("Id not found");
  } else {
    deleteQuery = `DELETE from posts WHERE id = ${id};`;
    await db.run(deleteQuery);
    response.send("Post Removed");
  }
});
