const db = require('../models');
const Board = db.board;
const {generateExampleCards, getRandomEmoji} = require('../helpers');
const shortid = require('shortid');

exports.createBoard = (req, res) => {
  const {boardTitle} = req.body;
  const newBoard = new Board();
  newBoard.title = boardTitle;
  newBoard.lists = [];
  newBoard.save((err, Board) => {
    if (err) {
      return res.status(400).send({
        message: 'Failed to add board. (' + err + ')',
      });
    } else {
      return res.send({
        message: 'Board added successfully.',
      });
    }
  });
}

exports.deleteBoard = (req, res) => {
  const { boardId } = req.body;
  Board.destroy({
    where: { _id: boardId }
  })
    .then(result => {
      return res.send({
        message: 'Success',
      });
    })
    .catch(err => {
      return res.send({
        message: 'Fail',
      });
    });
}

exports.reorderBoard = (req, res) => {
  const {listId, sourceId, sourceIndex, destinationIndex} = req.body;
  let destList = [];
  console.log('++++++++++++++', req.body);

  Board.find(
    { _id: sourceId },
    { lists: 1 }
  ).then((result) => {
    console.log('result', result[0]);
    let tmpList = result[0].lists[sourceIndex];
    result[0].lists[sourceIndex] = result[0].lists[destinationIndex];
    result[0].lists[destinationIndex] = tmpList;

    Board.update({ _id: result[0]._id }, { $set: { lists: result[0].lists } })
      .then(() => {
        return res.send({ result });
      })
      .catch((err) => {
        console.error(err);
        return res.send({
          message: 'Fail'
        });
      });
  });

  /*Board.findOneAndUpdate(
      { _id: sourceId },
      { $pull: {lists: {_id: listId}} }
    ).then((result) => {
      const list = result.lists[sourceIndex];
      destList = result.lists[destinationIndex];
      console.log('sourceList------------->', list);
      console.log('destList------------->', destList);

      Board.updateOne(
        {_id: sourceId}
      ), {
        $push: {
          lists: {$each: [list], $position: destinationIndex}
        }
      };
      return res.send({ result });
    })
    .catch(err => {
      console.error(err);
      return res.send({
        message: 'Fail'
      });
    });*/
}

exports.example = (req, res) => {
  const exampleCards = generateExampleCards();
  const boardId = shortid.generate();
  console.log(boardId);
  const newBoard = new Board();
  const boardTitle = `Example Board ${getRandomEmoji()}`
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

  newBoard.save((err, obj) => {
    if (err) {
      return res.status(400).send({
        message: 'Failed to add board. (' + err + ')',
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
