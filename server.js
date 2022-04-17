import express from 'express';
import cors from 'cors';
const morgan = require('morgan');
import mongoose from 'mongoose';
require('dotenv').config();
import { readdirSync } from 'fs';

// create express app
const app = express();

// set up database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbConn = mongoose.connection;

dbConn.on('error', () => console.log("Database connection error."));
dbConn.on('connected', () => console.log("Database connected."));

// apply middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// autoload all routes
readdirSync('./routes').map((route) =>
  app.use('/api', require(`./routes/${route}`))
);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`app running on port ${port}`));
