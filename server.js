const mysql = require('mysql2')
const express = require('express')
const PORT = process.env.PORT || 3001;
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Connect to database 
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // MySQL password,
    password: '102396Mustang$',
    database: 'election'
  },
  console.log('Connected to the election database.')
)


// Default response for any other request (NOT found) 
app.use((req,res) =>{
  res.status(404).end()
})


// Port listener
app.listen(PORT, ()=>{
  console.log(`Server up on port: ${PORT}`)
})