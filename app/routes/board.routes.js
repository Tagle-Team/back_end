const express = require('express');
const router = express.Router();
const { example, createBoard, deleteBoard, reorderBoard } = require('../controller/board.controller');

router.post('/example', example);
router.post('/board', createBoard);
router.delete('/board', deleteBoard);
router.put('/reorder-board', reorderBoard);

module.exports = router;
