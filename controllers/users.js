const User = require('../models/user');
const {
  statusCodeOK,
  statusCodeCreate,
  statusCodeBadRequest,
  statusCodeNotFound,
  statusCodeServerError,
} = require('../constants/statusCodeConstatns');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(statusCodeOK).send(users))
  .catch(() => res
    .status(statusCodeServerError)
    .send({ message: 'Server error' }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId).then((user) => {
    if (!user) {
      return res
        .status(statusCodeNotFound)
        .send({ message: 'The requested information was not found' });
    }
    return res.status(statusCodeOK).send(user);
  });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(statusCodeCreate).send(newUser))
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

const updateUserInfo = (req, res) => {
  const id = req.user._id;
  const newUserInfo = req.body;
  return User.findByIdAndUpdate(id, newUserInfo, { new: true, runValidators: true })
    .then((updateUser) => res.status(statusCodeOK).send(updateUser))
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

const updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const newUserAvatar = req.body;
  return User.findByIdAndUpdate(id, newUserAvatar, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res
          .status(statusCodeNotFound)
          .send({ message: 'The requested information was not found' });
      }
      return res.status(statusCodeOK).send(updateUser);
    })

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
