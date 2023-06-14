const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { statusCodeNotFound } = require('../constants/statusCodeConstatns');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (req, res) => {
  res.status(statusCodeNotFound).send({ message: 'The requested information was not found' });
});

module.exports = router;
