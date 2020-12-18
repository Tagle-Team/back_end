const db = require('../models');
const Board = db.board;
const shortid = require('shortid');

exports.createCard = (req, res) => {
  const cardId = shortid.generate();
  const {cardTitle, listId, boardId} = req.body;
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$push: {'lists.$.cards': {_id: cardId, title: cardTitle}}})
    .then(({result}) => res.send({result, cardId}))
    .catch((error) => {
      console.error(error);
    });
}

exports.updateCard = (req, res) => {
  const {cardTitle, cardIndex, listId, boardId} = req.body;
  const title = `lists.$.cards.${cardIndex}.title`;
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$set: {[title]: cardTitle}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

exports.deleteCard = (req, res) => {
  const {cardId, listId, boardId} = req.body;
  Board
    .updateOne({_id: boardId, 'lists._id': listId}, {$pull: {'lists.$.cards': {_id: cardId}}})
    .then(({result}) => res.send({result}))
    .catch((error) => {
      console.error(error);
    });
}

