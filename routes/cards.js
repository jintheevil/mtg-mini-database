var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, body, validationResult} = require("express-validator");

//notEmpty validators
const cardNameValidator = body('cardName')
    .notEmpty()
    .withMessage('Card name is required');

const cardTypeValidator = body('cardType')
    .notEmpty()
    .withMessage('Card type is required');

const setIDValidator = body('set_id')
    .notEmpty()
    .withMessage('Set ID is required');

const rarityValidator = body('rarity')
    .notEmpty()
    .withMessage('Card rarity is required');

const imgURLValidator = body('imgURL')
    .notEmpty()
    .withMessage('Image URL is required');

//custom validator for creatureType
const creatureTypeValidator = body('creatureType').custom((value, { req }) => {
    if (req.body.cardType.toLowerCase().includes('creature') && !value) {
        throw new Error('Creature type is required when cardType is creature');
    } else if (!req.body.cardType.toLowerCase().includes('creature') && value) {
        throw new Error('Creature type must be empty when cardType is not creature');
    }
    return true;
});

const validators = [cardNameValidator, cardTypeValidator, setIDValidator, rarityValidator, imgURLValidator, creatureTypeValidator];

// Cards APIs
// GET All Cards
router.get('/', function(req, res) {
    connection
        .raw(
            'select * from cards'
        )
        .then((result) => {
            //log results
            console.log(result);
            res.status(200).json(
                {
                    message: "Card list successfully retrieved.",
                    cardList: result[0]
                }
            )
        })
        .catch((err) => {
            //log the error
            console.log(err)
            res.status(500).json(
                {
                    "errCode" : 500,
                    "message" : err.message
                }
            )
        })
})

//GET Card by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    connection
        .raw(
            'select * from cards where id = ?;', [id]
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

//POST create new card entry
router.post('/',
    //check if any parameters are empty
    ...validators,
    (req, res) => {
        const { cardName, cardType, creatureType, set_id, rarity, imgURL } = req.body;
        //error handling
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
                'insert into cards ( cardName, cardType, creatureType, set_id, rarity, imgURL) values (?, ?, ?, ?, ?, ?)',
                [ cardName, cardType, creatureType, set_id, rarity, imgURL]
            ).then((result) => {
            //log the result
            console.log(result);
            connection
                .raw(
                    'select * from cards where id = ?', result[0].insertId
                ).then((created) => {
                res.status(201).json(
                    {
                        'message' : 'Card has been successfully added to the database.',
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

//PUT update card info
router.put('/:id', (req, res) => {
    const { cardName, cardType, creatureType, set_id, rarity, imgURL } = req.body;
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
                    "message" : "Card with that ID is not found."
                }
            )
        }
        // Build the SET clause dynamically
        const updateFields = [];
        const updateValues = [];

        if (cardName !== undefined) {
            if (!cardName) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Card name cannot be empty' });
                return;
            }
            updateFields.push('cardName = ?');
            updateValues.push(cardName);
        }

        if (cardType !== undefined) {
            if (!cardType) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Card type cannot be empty' });
                return;
            }
            updateFields.push('cardType = ?');
            updateValues.push(cardType);
        }

        if (cardType && cardType.toLowerCase().includes('creature')) {
            if (creatureType !== undefined && !creatureType.trim()) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Creature type cannot be empty when card type is Creature' });
                return;
            }
            if (creatureType !== undefined) {
                updateFields.push('creatureType = ?');
                updateValues.push(creatureType);
            }
        } else {
            if (creatureType !== undefined) {
                if (creatureType.trim()) {
                    res.status(400).json({
                        "errorCode" : 400,
                        'message' : 'Creature type must be empty when card type is not creature' });
                    return;
                }
                updateFields.push('creatureType = ?');
                updateValues.push(creatureType);
            }
        }

        if (set_id !== undefined) {
            if (!set_id) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Set ID cannot be empty' });
                return;
            }
            updateFields.push('set_id = ?');
            updateValues.push(set_id);
        }

        if (rarity !== undefined) {
            if (!rarity) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Card rarity cannot be empty' });
                return;
            }
            updateFields.push('rarity = ?');
            updateValues.push(rarity);
        }

        if (imgURL !== undefined) {
            if (!imgURL) {
                res.status(400).json({
                    "errorCode" : 400,
                    'message' : 'Image URL cannot be empty' });
                return;
            }
            updateFields.push('imgURL = ?');
            updateValues.push(imgURL);
        }

        if (updateFields.length === 0) {
            res.status(400).json({
                "errorCode" : 400,
                'message' : 'No fields to update' });
            return;
        }

        const setClause = updateFields.join(', ');
        const query = `UPDATE cards SET ${setClause} WHERE id = ?`;
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
            'select * from cards where id = ?', [id]
        ).then((result) => {
        if (!result[0].length) {
            return res.status(400).json(
                {
                    "errorCode" : 400,
                    "message" : "Card with that ID is not found."
                }
            )
        }

        connection
            .raw(
                'DELETE FROM cards WHERE id = ?', [id]
            ).then((result) => {
            res.status(200).json(
                {
                    message: "Card has been permanently deleted from the database."
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
