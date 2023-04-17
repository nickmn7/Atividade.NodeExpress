const express = require("express");
const usuarios = require('./routes/usuarios');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

app.use('/usuarios', usuarios);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'express.log'), { flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

app.listen(3000);