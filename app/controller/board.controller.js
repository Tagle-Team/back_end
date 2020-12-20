const db = require('../models');
const Board = db.board;
const {generateExampleCards} = require('../helpers');
const shortid = require('shortid');

/* 보드 데이터 생성 컨트롤러 */
exports.createBoard = (req, res) => {
  const {boardTitle} = req.body;

  /* model class를 이용하여 오브젝트 생성 */
  const board = new Board();
  board.title = boardTitle;
  board.lists = [];

  /* mongoose model object를 통한 save 호출 (MongoDB 저장) */
  board.save((err, Board) => {
    if (err) {

      /* 실패 시 에러 메시지 전송 */
      return res.status(400).send({
        message: 'Failed. (' + err + ')',
      });
    } else {

      /* 성공 시 성공 메시지 전송 */
      return res.send({
        message: 'Success.',
      });
    }
  });
}

/* 보드 데이터 삭제 컨트롤러 */
exports.deleteBoard = (req, res) => {
  const { boardId } = req.body;

  /* Delete: mongoose model class를 통해 destroy 메서드 호출 */
  Board.destroy({
    where: { _id: boardId } // _id가 req.body.boardId와 같은 것에 대해서 삭제
  })
    .then(result => {
      /* 성공 시 성공 메시지 전송 */
      return res.send({
        message: 'Success',
      });
    })
    .catch(err => {
      /* 실패 시 실패 메시지 전송 */
      return res.send({
        message: 'Failed',
      });
    });
}

/* 위치 이동 컨트롤러 (SourceIndex, DestinationIndex) */
exports.reorderBoard = (req, res) => {
  const {listId, sourceId, sourceIndex, destinationIndex} = req.body;
  let destList = [];

  /* 수정하기에 앞서 sourceId parameter를 이용해 데이터를 가져온다. */
  Board.find(
    { _id: sourceId },
    { lists: 1 }
  ).then((result) => {

    /* 위치를 바꾸기 위해 temp를 사용. */
    let tmpList = result[0].lists[sourceIndex];
    result[0].lists[sourceIndex] = result[0].lists[destinationIndex];
    result[0].lists[destinationIndex] = tmpList;

    /* 바꾼 데이터를 가지고 mongoose model update 진행 */
    Board.update({ _id: result[0]._id }, { $set: { lists: result[0].lists } })
      .then(() => {

        /* 성공 시 성공한 결과 데이터 전송 */
        return res.send({ result });
      })
      .catch((err) => {
        console.error(err);
        return res.send({
          message: 'Fail'
        });
      });
  });
}

/* 초기화 데이터 생성 (테스트용) */
exports.example = (req, res) => {
  /* 테스트용 데이터 생성 */
  const exampleCards = generateExampleCards();
  const boardId = shortid.generate();
  console.log(boardId);
  const newBoard = new Board();
  const boardTitle = 'Tag Board'
  newBoard._id = boardId;
  newBoard.title = boardTitle;
  newBoard.lists = [
    {
      _id: shortid.generate(),
      title: 'Dev',
      cards: exampleCards[0]
    },
    {
      _id: shortid.generate(),
      title: 'Shopping',
      cards: exampleCards[1]
    },
    {
      _id: shortid.generate(),
      title: 'Bookmark',
      cards: exampleCards[2]
    }
  ];

  /* 초기화용 데이터 DB 저장 */
  newBoard.save((err, obj) => {
    if (err) {
      return res.status(400).send({
        message: 'Failed. (' + err + ')',
      });
    } else {
      const newExampleBoard = obj;
      res.send({
        boardId,
        boardTitle,
        lists: newExampleBoard.lists,
        cards: exampleCards.flat(Infinity)
      });
    }
  });
}

/* 전체 데이터 조회 컨트롤러 */
exports.getBoard = (req, res) => {
  Board.find(
    { title: 'Tag Board' },
    { _id: 1, lists: 1, title: 1 }
  ).then((result) => {
    let flatCards = [];
    for (let i = 0; i < result[0].lists.length; i++) {
      let listObj = result[0].lists[i];
      for (let j = 0; j < listObj.cards.length; j++) {
        let cardObj = listObj.cards[j];
        flatCards = flatCards.concat(cardObj);
      }
    }

    return res.send({
      boardId: result[0]._id,
      boardTitle: result[0].title,
      lists: result[0].lists,
      cards: flatCards.flat(Infinity)
    });
  }).catch((err) => {
    console.error(err);
    return res.send({
      message: 'Fail'
    });
  });
}
