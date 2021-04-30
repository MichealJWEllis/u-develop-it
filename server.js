const mysql = require('mysql2')
const express = require('express')
const inputCheck = require('./utils/inputCheck')
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

// Get all canidates
app.get('/api/canidates', (req, res) => {
  const sql = `SELECT canidates.*, parties.name AS party_name FROM canidates LEFT JOIN parties ON canidates.party_id = parties.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

// Get a single candidate
app.get('/api/canidates/:id', (req, res) => {
  const sql = `SELECT canidates.*, parties.name AS party_name FROM canidates LEFT JOIN parties ON canidates.party_id = parties.id WHERE canidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a canidate 
app.delete('/api/canidates/:id', (req, res) => {
  const sql = `DELETE FROM canidates WHERE id = ?`
  const params = [req.params.id]

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: req.message })
    } else if (!result.affectedRows) {
      res.json({
        message: 'Canidate not found'
      })
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      })
    }
  })
})

// Update a canidate's party
app.put('/api/canidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id')
  if (errors) {
    res.status(400).json({ error: errors })
    return
  }
  const sql = `UPDATE canidates SET party_id = ?
              WHERE id = ?`
  const params = [req.body.party_id, req.params.id]
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message })
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Canidate not found'
      })
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      })
    }
  })
})

// Create a canidate
app.post('/api/canidates', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
  if (errors) {
    res.status(400).json({ error: errors })
    return
  }
  const sql = `INSERT INTO canidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`
  const params = [body.first_name, body.last_name, body.industry_connected]

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: body
    })
  })
})

// Get parties table
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * from parties`
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

// Get parties table by id
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`
  const params = [req.params.id]
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: row
    })
  })
})

// Delete table by id
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`
  const params = [req.params.id]
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message })
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      })
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      })
    }
  })
})

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
app.use((req, res) => {
  res.status(404).end()
})


// Port listener
app.listen(PORT, () => {
  console.log(`Server up on port: ${PORT}`)
})