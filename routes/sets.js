var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, body, validationResult} = require("express-validator");

//notEmpty validators
const setNameValidator = body('setName')
    .notEmpty()
    .withMessage('Set codename is required');

const fullNameValidator = body('fullName')
    .notEmpty()
    .withMessage('Set full name is required');

const releaseDateValidator = body('releaseDate')
    .notEmpty()
    .withMessage('Release date is required');

const validators = [setNameValidator, fullNameValidator, releaseDateValidator]

// Sets APIs
// GET All Sets
router.get('/', (req, res) => {
    connection
        .raw(
            'select * from sets'
        ).then((result) => {
            //log the result
            console.log(result);
            res.status(200).json(
                {
                    message: 'Set list successfully retrieved.',
                    setList: result[0]
                }
            )
    }).catch((err) => {
        //log the error
        console.log(err)
        res.status(500).json(
            {
                errorCode : 500,
                message: err.message
            }
        )
    })
})

//GET Set by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    connection
        .raw(
            'select * from sets where id = ?', [id]
        ).then((result) => {
            console.log(result);
            res.status(200).json(
                result[0][0] || null
            )
    }).catch((err) => {
        //log the error
        console.log(err);
        res.status(500).json(
            {
                'errorCode' : 500,
                'message' : err.message
            }
        )
    })
})

//POST create new set entry
router.post('/',
    ...validators,
    (req, res) => {
    const { setName, fullName, releaseDate } = req.body;
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json(
            {
                'errorCode' : 400,
                'errors' : errors.array()
            }
        )
    }

    connection
        .raw(
            'insert into sets ( setName, fullName, releaseDate ) values (?, ?, ?)',
            [ setName, fullName, releaseDate ]
        ).then((result) => {
        //log the result
        console.log(result);
        connection
            .raw(
                'select * from sets where id = ?', result[0].insertId
            ).then((created) => {
            res.status(201).json(
                {
                    'message' : 'Set has been successfully added to the database.',
                    'card' : created[0][0]
                }
            )
        })
    }).catch((err) => {
        //log the error
        console.log(err);
        res.status(500).json(
            {
                'errorCode' : 500,
                'message' : err.message
            }
        )
    })
})

//PUT update set info
router.put('/:id', (req, res) => {
    const { setName, fullName, releaseDate } = req.body;
    const { id } = req.params;
    //check if id is valid
    connection
        .raw(
            'select * from sets where id = ?', [id]
        ).then((result) => {
            if (!result[0].length) {
                return res.status(400).json(
                    {
                        "errorCode" : 400,
                        "message" : "Set with that ID is not found."
                    }
                )
            }
        // Build the SET clause dynamically
        const updateFields = [];
        const updateValues = [];
        if (setName !== undefined) {
            if (!setName) {
                res.status(400).json({
                    'errorCode' : 400,
                    'message' : 'Card name cannot be empty' });
                return;
            }
            updateFields.push('setName = ?');
            updateValues.push(setName);
        }

        if (fullName !== undefined) {
            if (!fullName) {
                res.status(400).json({
                    'errorCode' : 400,
                    'message' : 'Card type cannot be empty' });
                return;
            }
            updateFields.push('fullName = ?');
            updateValues.push(fullName);
        }

        if (releaseDate !== undefined) {
            if (!fullName) {
                res.status(400).json({
                    'errorCode' : 400,
                    'message' : 'Card type cannot be empty' });
                return;
            }
            updateFields.push('releaseDate = ?');
            updateValues.push(releaseDate);
        }

        if (updateFields.length === 0) {
            res.status(400).json({
                'errorCode' : 400,
                'message' : 'No fields to update' });
            return;
        }

        const setClause = updateFields.join(', ');
        const query = `UPDATE sets SET ${setClause} WHERE id = ?`;
        updateValues.push(req.params.id);

        connection
            .raw(
                query, updateValues
            ).then((result) => {
            console.log(result);
            res.status(200).json(
                {
                    'message' : 'Card updated successfully!'
                }
            )
        }).catch((err) => {
            console.log(err);
            res.status(500).json(
                {
                    'errorCode' : 500,
                    'message' : err.message
                }
            )
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).json(
            {
                'errorCode' : 500,
                'message' : err.message
            }
        )
    })
})

//DELETE card by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            "errorCode" : 400,
            'message' : 'ID is required.' });
        return;
    }

    connection
        .raw(
            'select * from sets where id = ?', [id]
        ).then((result) => {
        if (!result[0].length) {
            return res.status(400).json(
                {
                    "errorCode" : 400,
                    "message" : "Set with that ID is not found."
                }
            )
        }

        connection
            .raw(
                'DELETE FROM sets WHERE id = ?', [id]
            ).then((result) => {
            res.status(200).json(
                {
                    message: "Set has been permanently deleted from the database."
                }
            )
        }).catch((err) => {
            console.log(err);
            res.status(500).json(
                {
                    'errorCode' : 500,
                    'message' : err.message
                }
            )
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).json(
            {
                'errorCode' : 500,
                'message' : err.message
            }
        )
    })
})

module.exports = router;