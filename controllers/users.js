const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ServerError = require('../errors/server-error');

const User = require('../models/user');
const { statusCodeOK, statusCodeCreate } = require('../constants/statusCodeConstatns');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(statusCodeOK).send(users);
    })
    .catch(() => {
      const err = new ServerError('Server Error');
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(statusCodeOK).send(user);
    })
    .catch(() => {
      const err = new ServerError('Server Error');
      next(err);
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
      } res.status(statusCodeOK).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
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
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new ConflictError('User with this email has already been created');
        next(err);
        return;
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email,
            password: hash,
            name,
            about,
            avatar,
          })
            .then((newUser) => res.status(statusCodeCreate).send(newUser))
            .catch((e) => {
              if (e.name === 'ValidationError') {
                const err = new BadRequestError('Incorrect data was transmitted');
                next(err);
              }
              const err = new ServerError('Server Error');
              next(err);
            });
        });
    });
};

const updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const newUserInfo = req.body;
  return User.findByIdAndUpdate(id, newUserInfo, { new: true, runValidators: true })
    .then((updateUser) => res.status(statusCodeOK).send(updateUser))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
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
      }
      return res.status(statusCodeOK).send(updateUser);
    })

    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadRequestError('Incorrect data was transmitted');
        next(err);
      }
      const err = new ServerError('Server Error');
      next(err);
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
            .status(statusCodeOK)
            .cookie('jwt', token, { maxAge: 3600000 * 7 * 24, httpOnly: true })
            .end();
        });
    });
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
