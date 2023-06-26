const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');

global.__basedir = __dirname;

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected',()=>{
    console.log("DB connected");
})

mongoose.connection.on('error',()=>{
    console.log("DB error");
})

require('./models/user-model');
require('./models/post-model');

app.use(cors());
app.use(express.json());

app.use(require('./routes/user-routes'));
app.use(require('./routes/post-routes'));
app.use(require('./routes/file-routes'));

app.listen(4000,()=>{
    console.log("Started !!");
})