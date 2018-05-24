const express = require('express')
const app = express()
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/todo'
const ObjectID = require('mongodb').ObjectID

let db

MongoClient.connect(url, function (err, client) { //mongo db connection
    db = client.db('todo')
    console.log('connected to todo mongo db')
})

app.get('/', function (req, res) {
    let collection = db.collection('todos')
    collection.find({
        "completed": "false",
        "deleted": "false",
    }).toArray(function (err, docs) {
        res.send(docs)
    })
})

app.post('/add', function (req, res) {
    let collection = db.collection('todos')
    let taskData = req.body
    if (
        (taskData.hasOwnProperty('taskName')) && (taskData.taskName)
        && (taskData.hasOwnProperty('description'))
        && (taskData.hasOwnProperty('completed')) && (taskData.completed === "false")
        && (taskData.hasOwnProperty('deleted')) && (taskData.deleted === "false")
    ) {
        collection.insertOne(taskData, function (err) {
            if (err) {
                res.send('error')
            } else {
                res.send('task added!')
            }
        })
    } else {
        res.send('task data error')
    }
})

app.put('/completed', function (req, res) {
    let collection = db.collection('todos')
    let _id = req.body._id
    collection.updateOne({'_id':ObjectID(_id)}, {
        $set: {
            "completed": "true"
        }
    }, function (err) { //there can be a second param of result here
        if (err) {
            res.send('error')
        } else {
            res.send('task completed!')
        }
    })
})

app.delete('/delete', function (req, res) {
    let collection = db.collection('todos')
    let _id = req.body._id
    collection.updateOne({'_id':ObjectID(_id)}, {
        $set: {
            "deleted": "true"
        }
    }, function (err) {
        if (err) {
            res.send('error')
        } else {
            res.send('task deleted!')
        }
    })
})

app.listen(3000, function(){
    console.log('otterAPI is running');
})

