const express = require('express');
const router = express.Router();
const { createCard, updateCard, deleteCard } = require('../controller/card.controllder');

router.post('/card', createCard);
router.put('/card', updateCard);
router.delete('/card', deleteCard);

module.exports = router;
