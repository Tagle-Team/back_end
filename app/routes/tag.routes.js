const express = require('express');
const router = express.Router();
const { example, createTag, deleteTag, reorderTag } = require('../controller/tag.controller');

router.post('/example', example);
router.post('/tag', createTag);
router.delete('/tag', deleteTag);
router.put('/tag', reorderTag);

module.exports = router;
