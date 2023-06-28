const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  statusCodeOK,
  statusCodeCreate,
} = require('../constants/statusCodeConstatns');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(statusCodeOK).send(cards))
    .catch(() => {
      const err = new ServerError('Server Error');
      next(err);
    });
};

const createCard = (req, res, next) => {
  req.body.owner = req.user._id;
  const newCardData = req.body;
  Card.create(newCardData)
    .then((newCard) => res.status(statusCodeCreate).send(newCard))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
    });
};

const removeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const err = new NotFoundError('The requested information was not found');
        next(err);
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        const err = new ForbiddenError('Access is restricted');
        next(err);
        return;
      }
      Card.findByIdAndDelete(cardId)
        .then(() => res.status(statusCodeOK).send({ message: 'done' }))
        .catch((e) => {
          if (e.name === 'CastError') {
            const err = new BadRequestError('Incorrect data was transmitted');
            next(err);
          }
          const err = new ServerError('Server Error');
          next(err);
        });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => {
      if (!updateCard) {
        const err = new NotFoundError('The requested information was not found');
        next(err);
        return;
      } res.status(statusCodeOK).send(updateCard);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
    });
};

const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updateCard) => {
      if (!updateCard) {
        const err = new NotFoundError('The requested information was not found');
        next(err);
        return;
      } res.status(statusCodeOK).send(updateCard);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
};
