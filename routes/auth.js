import express from 'express';

const router = express.Router();

router.get('/register', (req, res) => {
  res.send('you hit the register endpoint.');
});

module.exports = router;