const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('../controllers/users');
const URL_REGEX = require('../constants/regex');

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = users;

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(8).max(30),
    about: Joi.string().required().min(8).max(30),
  }),
}), updateUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(URL_REGEX),
  }),
}), updateUserAvatar);

module.exports = router;
