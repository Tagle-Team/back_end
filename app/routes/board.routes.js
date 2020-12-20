const express = require('express');
const router = express.Router();
const { example, createBoard, deleteBoard, reorderBoard, getBoard } = require('../controller/board.controller');

/* express-router 오브젝트에 초기화 데이터 생성하는 example 컨트롤러 추가 */
router.post('/example', example);
/* express-router 오브젝트에 보드 생성하는 컨트롤러 추가 */
router.post('/board', createBoard);
/* express-router 오브젝트에 보드 삭제하는 컨트롤러 추가 */
router.delete('/board', deleteBoard);
/* express-router 오브젝트에 리스트 위치 수정하는 컨트롤러 추가 */
router.put('/reorder-board', reorderBoard);
/* express-router 오브젝트에 보드 전체 정보 읽어오는 컨트롤러 추가 */
router.get('/board', getBoard);

/* routing object 리턴 */
module.exports = router;
