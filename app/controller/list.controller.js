const db = require('../models');
const Board = db.board;
const {generateExampleCards} = require('../helpers');
const shortid = require('shortid');

/* 목록 생성 컨트롤러 */
exports.createList = (req, res) => {
  const listId = shortid.generate();
  const { listTitle, boardId } = req.body;

  /* mongoose model class에 updateOne, $push 옵션을 이용해 DB 도큐먼트 내 데이터 추가 (도큐먼트 수정) */
  Board
    .updateOne({_id: boardId}, {$push: {lists: {_id: listId, title: listTitle, cards: []}}})
    .then(({result}) => {
      res.send({result, listId});
    })
    .catch((error) => {
      console.error(error);
    });
}

/* 목록 수정 컨트롤러 */
exports.updateList = (req, res) => {
  const {listTitle, listId, boardId} = req.body;

  /* mongoose model class에 $set 옵션을 이용해 도큐먼트 데이터 수정 */
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$set: {'lists.$.title': listTitle}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

/* 목록 삭제 컨트롤러 */
exports.deleteList = (req, res) => {
  const {listId, boardId} = req.body;

  /* mongoose model class에 updateOne $pull을 이용하여 도큐먼트 내 데이터 삭제 */
  Board
    .updateOne({_id: boardId}, {$pull: {lists: {_id: listId}}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

/* 목록 내 카드 위치 이동 컨트롤러 */
exports.reorderList = (req, res) => {
  const {cardId, sourceId, destinationId, sourceIndex, destinationIndex, boardId} = req.body;

  console.log('-------->', cardId, sourceId, destinationId, sourceIndex, destinationIndex, boardId);

  /* 카드 위치 이동을 위해 도큐먼트 데이터 전체 조회 */
  Board
    .findOne(
      {_id: boardId},
      {_id: 1, lists: 1},
    )
    .then((obj) => {
      let sourceCard = {};
      console.log('obj--------->', obj);

      /* 수정하기 전에 위치한 데이터 찾은 후 깊은 복사 및 삭제 (Object.assign, splice) */
      for (let i = 0; i < obj.lists.length; i++) {
        if (obj.lists[i]._id === sourceId) {
          Object.assign(sourceCard, obj.lists[i].cards[sourceIndex]);
          obj.lists[i].cards.splice(sourceIndex, 1);
        }
      }

      /* 수정하고 난 다음에 위치에 복사한 데이터 밀어넣기 (splice) */
      for (let i = 0; i < obj.lists.length; i++) {
        if (obj.lists[i]._id === destinationId)
          obj.lists[i].cards.splice(destinationIndex, 0, sourceCard);
      }

      /* 수정하고 나온 결과 데이터를 도큐먼트에 업데이트 */
      Board.update({ _id: obj._id }, { $set: { lists: obj.lists } })
        .then(() => {
          return res.send({obj});
        })
        .catch((err) => {
          console.log(err);
          return res.send({
            message: 'Fail'
          });
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

