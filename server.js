const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://EmmaHe:test123@test.ugnnm.mongodb.net/T_TDO?retryWrites=true&w=majority');

const taskSchema = {
    name: String,
    description: String,
    date: String,
    type: String
}

const Tasks = mongoose.model('Tasks', taskSchema);

app.get('/', (req, res) => {
    Tasks.find({}, function(tasks) {

    })
})

app.listen(4000, function() {
    console.log('server is running')
})