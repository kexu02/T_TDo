const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://EmmaHe:test123@test.ugnnm.mongodb.net/T_TDO?retryWrites=true&w=majority');

app.get('/', (req, res) => {
    res.render('cal');
})

app.listen(4000, function() {
    console.log('server is running')
})