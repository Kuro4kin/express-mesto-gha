const router = require('express').Router();
const cards = require('../controllers/cards');

const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  unlikeCard,
} = cards;

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', unlikeCard);

module.exports = router;
