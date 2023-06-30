const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const User = require('../models/user');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('../constants/statusCodeConstatns');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send(users);
    })
    .catch((e) => {
      next(e);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((e) => {
      next(e);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new NotFoundError('The requested information was not found');
        next(err);
        return;
      } res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      } else {
        next(e);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser))
        .catch((e) => {
          if (e.code === 11000) {
            const err = new ConflictError('User with this email has already been created')
            next(err);
            return;
          }
          next(e);
        });
    });
};

const updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const newUserInfo = req.body;
  return User.findByIdAndUpdate(id, newUserInfo, { new: true, runValidators: true })
    .then((updateUser) => {
      if (!updateUser) {
        const err = new NotFoundError('The requested information was not found');
        return next(err);
      }
      return res.status(HTTP_STATUS_OK).send(updateUser);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
        return;
      }
      next(e);
    });
};

const updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const newUserAvatar = req.body;
  return User.findByIdAndUpdate(id, newUserAvatar, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        const err = new NotFoundError('The requested information was not found');
        next(err);
        return;
      }
      return res.status(HTTP_STATUS_OK).send(updateUser);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
        return;
      }
      next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new UnauthorizedError('Invalid user email address or password specified');
        next(err);
        return;
      }
      const token = jwt.sign({ _id: user._id }, 'verysecretword', { expiresIn: '7d' });
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new UnauthorizedError('Invalid user email address or password specified');
            next(err);
            return;
          }
          res
            .status(HTTP_STATUS_OK)
            .cookie('jwt', token, { maxAge: 3600000 * 7 * 24, httpOnly: true })
            .send({ message: 'Authorization completed' });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
