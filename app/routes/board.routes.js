const express = require('express');
const router = express.Router();
const { example, createBoard, deleteBoard, reorderBoard, getBoard } = require('../controller/board.controller');

router.post('/example', example);
router.post('/board', createBoard);
router.delete('/board', deleteBoard);
router.put('/reorder-board', reorderBoard);
router.get('/board', getBoard);

module.exports = router;
