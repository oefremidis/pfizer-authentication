const express = require('express')
const bcrypt = require('bcrypt')

const app = express()

app.use(express.json())

// normally goes to a database 
// just for demostration here
const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    // encrypt the password
    // you can use salt generation method here
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // create the user
    // and store 
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)

    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)

  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000, () => console.log(`Server started on 3000`))