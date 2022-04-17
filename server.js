import express from 'express';
import cors from 'cors';
const morgan = require('morgan');
require('dotenv').config();

// create express app
const app = express();

// apply middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
  res.send('You have hit app endpoint');
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`app running on port ${port}`));