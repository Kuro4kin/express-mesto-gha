const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../constants/statusCodeConstatns');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch((e) => {
      next(e);
    });
};

const createCard = (req, res, next) => {
  req.body.owner = req.user._id;
  const newCardData = req.body;
  Card.create(newCardData)
    .then((newCard) => res.status(HTTP_STATUS_CREATED).send(newCard))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      next(e);
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
        .then(() => res.status(HTTP_STATUS_OK).send({ message: 'done' }))
        .catch((e) => {
          next(e);
        });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
        return;
      }
      next(e);
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
      } res.status(HTTP_STATUS_OK).send(updateCard);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      next(e);
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
      } res.status(HTTP_STATUS_OK).send(updateCard);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      next(e);
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
};
