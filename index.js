const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');
const path = require('path');

global.__basedir = __dirname;

mongoose.set('strictQuery', true);
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

// deployment config
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/reactogram/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "reactogram", "build", "index.html"));
  });
}

app.listen(4000,()=>{
    console.log("Started !!");
})