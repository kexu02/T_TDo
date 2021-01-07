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

const Task = mongoose.model('Tasks', taskSchema);

app.get('/', (req, res) => {
    Task.find({}, function(err, Tasks) {
        res.render('cal', {
            taskList: Tasks
        })
    })
})

app.listen(4000, function() {
    console.log('server is running')
})