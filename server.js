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
// Query all table info
// db.query(`SELECT * FROM canidates`, (err, rows) => {
//   console.log(rows)
// })

// Query a Single canidate
// db.query(`SELECT * FROM canidates WHERE id = 1`, (err, row) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log(row)
// })

// Delete a candidate
// db.query(`DELETE FROM canidates WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// Create a canidate
// const sql = `INSERT INTO canidates (id, first_name, last_name, industry_connected)
//               VALUES(?,?,?,?)`
// const parms = [1, 'Ronald', 'Firbank', 1]

// db.query(sql, parms, (err, result) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log(result)
// });


// Default response for any other request (NOT found) 
app.use((req,res) =>{
  res.status(404).end()
})


// Port listener
app.listen(PORT, ()=>{
  console.log(`Server up on port: ${PORT}`)
})