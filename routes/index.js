const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { auth } = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const errorHandler = require('../middlewares/error-handler');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(8),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }).unknown(true),
}), createUser);
router.use(auth);
router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('The requested information was not found');
  next(err);
});
router.use(errors());
router.use(errorHandler);

module.exports = router;
