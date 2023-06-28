const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cards = require('../controllers/cards');


const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
} = cards;

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(8).max(30),
    link: Joi.string()
      .required()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', unlikeCard);

module.exports = router;
