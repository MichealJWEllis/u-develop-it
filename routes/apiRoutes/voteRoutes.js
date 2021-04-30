const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get the total votes for all the canidates
router.get('/votes', (req, res) => {
    const sql = `SELECT canidates.*, parties.name AS party_name, 
                    COUNT(canidate_id) 
                    AS count FROM votes 
                    LEFT JOIN canidates ON votes.canidate_id = canidates.id 
                    LEFT JOIN parties ON canidates.party_id = parties.id 
                    GROUP BY canidate_id 
                    ORDER BY count DESC`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


router.post('/vote', ({ body }, res) => {
    // Data validation
    const errors = inputCheck(body, 'voter_id', 'canidate_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO votes (voter_id, canidate_id) VALUES (?,?)`;
    const params = [body.voter_id, body.canidate_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

module.exports = router