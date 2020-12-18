const express = require('express');
const router = express.Router();
const { createList, updateList, deleteList, reorderList } = require('../controller/list.controller');

router.post('/list', createList);
router.put('/list', updateList);
router.delete('/list', deleteList);
router.put('/reorder-list', reorderList);

module.exports = router;
