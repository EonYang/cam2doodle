import apiRouter from './api';
import data from "./data/getDataObj.js";

const port = process.env.PORT || 8000;
const express = require('express');
const app = express();
var server = require('http').createServer(app).listen(port, () => {
  console.log('server is listening at port: ' + port);
});

app.use(express.static('public'));
app.use('/api', apiRouter);
