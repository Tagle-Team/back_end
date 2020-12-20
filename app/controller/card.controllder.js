const db = require('../models');
const Board = db.board;
const shortid = require('shortid');

/* 카드 생성 컨트롤러 */
exports.createCard = (req, res) => {
  const cardId = shortid.generate();
  const {cardTitle, listId, boardId} = req.body;

  /* 카드 생성은 리스트의 추가와 같으므로 mongodb $push 옵션 사용 */
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$push: {'lists.$.cards': {_id: cardId, title: cardTitle}}})
    .then(({result}) => res.send({result, cardId}))
    .catch((error) => {
      console.error(error);
    });
}

/* 카드 수정 컨트롤러 */
exports.updateCard = (req, res) => {
  const {cardTitle, cardIndex, listId, boardId} = req.body;
  const title = `lists.$.cards.${cardIndex}.title`;

  /* mongoose model class를 이용한 수정($set) */
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$set: {[title]: cardTitle}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

/* 카드 삭제 컨트롤러 */
exports.deleteCard = (req, res) => {
  const {cardId, listId, boardId} = req.body;

  /* 삭제할 카드 데이터는 리스트 구조에 위치하기 때문에 $pull 옵션 사용 */
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$pull: {'lists.$.cards': {_id: cardId}}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

