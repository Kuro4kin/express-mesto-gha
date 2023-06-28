const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('../controllers/users');

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = users;

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(8).max(30),
    about: Joi.string().min(8).max(30),
  }),
}), updateUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), updateUserAvatar);

module.exports = router;
