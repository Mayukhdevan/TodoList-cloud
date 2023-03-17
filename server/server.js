const express = require('express')
const cors = require('cors')
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dbPath = path.join(__dirname, 'todo.db')
const app = express()

app.use(express.json())
app.use(cors())

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database })
    app.listen(8000, () => {
      console.log('Server Running at http://localhost:8000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Middleware function to authenticate token
const authenticateToken = (req, res, next) => {
  let jwtToken
  const authHeader = req.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    // Token not provided
    res.status(401)
    res.send({ err_msg: 'Invalid JWT Token' })
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        // Incorrect token
        res.status(401)
        res.send({ err_msg: 'Invalid JWT Token' })
      } else {
        req.username = payload.username // Pass data to the next handler with req obj
        next() // Call the next handler or middleware
      }
    })
  }
}

//User Register API
app.post('/register', async (req, res) => {
  const { username, password, name, gender } = req.body
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    // User doesn't exits
    if (password.length < 6) {
      // If pw length less than 6 char
      res.status(400)
      res.send({ err_msg: 'Password is too short' })
    } else {
      // If Everything goes well
      const createUserQuery = `
          INSERT INTO 
            user (username, password, name, gender) 
          VALUES 
            (
              '${username}', 
              '${hashedPassword}',
              '${name}', 
              '${gender}'
            )`
      await db.run(createUserQuery)
      res.send({ err_msg: 'User created successfully' })
    }
  } else {
    //If user already exists
    res.status(400)
    res.send({ err_msg: 'User already exists' })
  }
})

//User Login API
app.post('/login/', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery) // Check user in db
  if (dbUser === undefined) {
    // If user doesn't have an A/C
    res.status(400)
    res.send({ err_msg: 'Invalid user' })
  } else {
    // If user has an A/C
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      // Correct pw
      const payload = {
        username: username,
      }
      // jwt.sign method takes payload and a string as secret token. Also an optional callback as 3rd arg.
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      res.send({ jwtToken })
    } else {
      // Incorrect pw
      res.status(400)
      res.send({ err_msg: 'Invalid password' })
    }
  }
})

// GET todo
app.get('/', authenticateToken, async (req, res) => {
  const username = req.username

  const getTodoQuery = `
    SELECT * FROM
      user_todo
    WHERE
      username = "${username}";
  `
  const todoArray = await db.all(getTodoQuery)
  res.send(todoArray)
})

// ADD TODO
app.post('/add/', authenticateToken, async (req, res) => {
  const username = req.username
  const { todoId, todo, taskDone } = req.body

  const addTodoQuery = `
    INSERT INTO
      user_todo(username, todo_id, todo, task_done)
      VALUES (
        "${username}",
        "${todoId}",
        "${todo}",
        ${taskDone}
      );
  `
  await db.run(addTodoQuery)
  res.send({ message: 'Added todo successfully' })
})

// DELETE TODO
app.delete('/todo/:todoId', authenticateToken, async (req, res) => {
  const username = req.username
  const { todoId } = req.params

  const deleteTodoQuery = `
    DELETE FROM
      user_todo
    WHERE
      todo_id = "${todoId}"
      AND
      username = "${username}";
  `
  const deleteTodo = await db.run(deleteTodoQuery)
  if (deleteTodo.changes === 0) {
    res.status(401)
    res.send({ err_msg: 'Invalid Request' })
  }
})

// UPDATE TODO
app.put('/todo/:todoId', authenticateToken, async (req, res) => {
  const username = req.username
  const { todoId } = req.params
  const { taskDone } = req.body

  const updateTodoQuery = `
    UPDATE user_todo
    SET
      task_done = ${taskDone}
    WHERE
      todo_id = "${todoId}"
      AND
      username = "${username}";
  `
  const dbResponse = await db.run(updateTodoQuery)

  if (dbResponse.changes === 0) {
    res.status(400)
    res.send({ message: 'Todo not found!' })
  }
  res.send({ message: 'Todo updated succesfully!' })
})

module.exports = app
