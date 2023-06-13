/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const httpConstants = require('http').constants;
const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch(() => res
    .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
    .send({ message: 'Server error' }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId).then((user) => {
    if (!user) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'The requested information was not found' });
    }
    return res.status(httpConstants.HTTP_STATUS_OK).send(user);
  });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Incorrect data was transmitted' });
      }
      return res
        .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
        .send({ message: 'Server error' });
    });
};

const updateUserInfo = (req, res) => {
  const id = req.user._id;
  const newUserInfo = req.body;
  return User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'The requested information was not found' });
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(updateUser);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Incorrect data was transmitted' });
      }
      return res
        .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
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
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'The requested information was not found' });
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(updateUser);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Incorrect data was transmitted' });
      }
      return res
        .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
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
