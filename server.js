const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db');
db();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Api running')
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App started on ${PORT}`);
})