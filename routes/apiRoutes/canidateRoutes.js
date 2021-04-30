const express = require('express')
const router = express.Router()
const db = require('../../db/connection')
const inputCheck = require('../../utils/inputCheck')

// Get all canidates
router.get('/canidates', (req, res) => {
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
router.get('/canidates/:id', (req, res) => {
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
router.delete('/canidates/:id', (req, res) => {
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
router.put('/canidate/:id', (req, res) => {
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
router.post('/canidates', ({ body }, res) => {
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

module.exports = router