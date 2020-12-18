const db = require('../models');
const Board = db.board;
const {generateExampleCards, getRandomEmoji} = require('../helpers');
const shortid = require('shortid');

exports.createBoard = (req, res) => {
  const newBoard = new Board();
  newBoard.title = req.body;
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

  Board.findOneAndUpdate({
    _id: sourceId
  }, {
    $pull: {lists: {_id: listId}}
  })
    .then(result => {
      const list = result.lists[sourceIndex];
      Board.updateOne(
        {_id: sourceId}
      ), {
        $push: {
          lists: {$each: [list], $position: destinationIndex}
        }
      }
      return res.send({ result });
    })
    .catch(err => {
      console.error(err);
      return res.send({
        message: 'Fail'
      });
    });
}

exports.example = (req, res) => {
  const exampleCards = generateExampleCards();
  const newBoard = new Board();
  newBoard.title = `Example Board ${getRandomEmoji()}`;
  newBoard.lists = [
    {
      title: 'Todo',
      cards: exampleCards[0]
    },
    {
      title: 'In Progress',
      cards: exampleCards[1]
    },
    {
      title: 'Done',
      cards: exampleCards[2]
    }
  ];

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