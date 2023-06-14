const httpConstants = require('http2').constants;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards));
};

const createCard = (req, res) => {
  req.body.owner = req.user._id;
  const newCardData = req.body;
  Card.create(newCardData)
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Incorrect data was transmitted' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' });
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then(() => {
      res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'done' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'The requested information was not found' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => res.status(httpConstants.HTTP_STATUS_OK).send(updateCard))
    .catch(() => res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' }));
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => res.status(httpConstants.HTTP_STATUS_OK).send(updateCard))
    .catch(() => res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' }));
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
};
