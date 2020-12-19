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

  console.log('-------->', cardId, sourceId, destinationId, sourceIndex, destinationIndex, boardId);

  Board
    .findOne(
      {_id: boardId},
      {_id: 1, lists: 1},
    )
    .then((obj) => {
      let sourceCard = {};
      console.log('obj--------->', obj);

      for (let i = 0; i < obj.lists.length; i++) {
        if (obj.lists[i]._id === sourceId) {
          Object.assign(sourceCard, obj.lists[i].cards[sourceIndex]);
          obj.lists[i].cards.splice(sourceIndex, 1);
        }
      }

      for (let i = 0; i < obj.lists.length; i++) {
        if (obj.lists[i]._id === destinationId)
          obj.lists[i].cards.splice(destinationIndex, 0, sourceCard);
      }

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

      /*const card = obj.lists[0].cards[sourceIndex];
      console.log('card---------->', card);
      Board.updateOne(
        {_id: boardId, 'lists._id': destinationId},
        {
          $push: {
            'lists.$.cards': {$each: [card], $position: destinationIndex}
          }
        }
      ).then(() => {
        console.log('update complete');
      });
      res.send({obj});*/
    })
    .catch((error) => {
      console.error(error);
    });
}

