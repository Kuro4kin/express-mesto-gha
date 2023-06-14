const Card = require('../models/card');
const {
  statusCodeOK,
  statusCodeCreate,
  statusCodeBadRequest,
  statusCodeNotFound,
  statusCodeServerError,
} = require('../constants/statusCodeConstatns');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(statusCodeOK).send(cards))
    .catch(() => res.status(statusCodeServerError).send({ message: 'Server error' }));
};

const createCard = (req, res) => {
  req.body.owner = req.user._id;
  const newCardData = req.body;
  Card.create(newCardData)
    .then((newCard) => res.status(statusCodeCreate).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(statusCodeBadRequest)
          .send({ message: 'Incorrect data was transmitted' });
      }
      return res
        .status(statusCodeServerError)
        .send({ message: 'Server error' });
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(statusCodeNotFound)
          .send({ message: 'The requested information was not found' });
      } return res.status(statusCodeOK).send({ message: 'done' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(statusCodeBadRequest)
          .send({ message: 'Incorrect data was transmitted' });
      }
      return res
        .status(statusCodeServerError)
        .send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => {
      if (!updateCard) {
        return res
          .status(statusCodeNotFound)
          .send({ message: 'The requested information was not found' });
      } return res.status(statusCodeOK).send(updateCard);
    })
    .catch(() => res.status(statusCodeServerError).send({ message: 'Server error' }));
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => {
      if (!updateCard) {
        return res
          .status(statusCodeNotFound)
          .send({ message: 'The requested information was not found' });
      } return res.status(statusCodeOK).send(updateCard);
    })
    .catch(() => res.status(statusCodeServerError).send({ message: 'Server error' }));
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
};
