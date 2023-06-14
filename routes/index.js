const httpConstants = require('http2').constants;
const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'The requested information was not found' });
});

module.exports = router;
