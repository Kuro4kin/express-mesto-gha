const router = require('express').Router();
const users = require('../controllers/users');

const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = users;

router.get('/users', getUsers);
router.get('/user/:userId', getUserById);
router.post('/user', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;