const db = require('../models');
const Board = db.board;
const {generateExampleCards, getRandomEmoji} = require('../helpers');
const shortid = require('shortid');

exports.createList = (req, res) => {
  const listId = shortid.generate();
  const { listTitle, boardId } = req.body;
  Board
    .updateOne({_id: boardId}, {$push: {lists: {_id: listId, title: listTitle, cards: []}}})
    .then(({result}) => {
      res.send({result, listId});
    })
    .catch((error) => {
      console.error(error);
    });
}

exports.updateList = (req, res) => {
  const {listTitle, listId, boardId} = req.body;
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$set: {'lists.$.title': listTitle}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

exports.deleteList = (req, res) => {
  const {listId, boardId} = req.body;
  Board
    .updateOne({_id: boardId}, {$pull: {lists: {_id: listId}}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

exports.reorderList = (req, res) => {
  const {cardId, sourceId, destinationId, sourceIndex, destinationIndex, boardId} = req.body;

  Board
    .findOneAndUpdate(
      {_id: boardId, 'lists._id': sourceId},
      {$pull: {'lists.$.cards': {_id: cardId}}},
      // {projection: {'lists.$.cards': true}}
    )
    .then((obj) => {
      const card = obj.lists[0].cards[sourceIndex];
      Board.updateOne(
        {_id: boardId, 'lists._id': destinationId},
        {
          $push: {
            'lists.$.cards': {$each: [card], $position: destinationIndex}
          }
        }
      );
      res.send({obj});
    })
    .catch((error) => {
      console.error(error);
    });
}

