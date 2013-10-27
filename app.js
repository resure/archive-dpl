var express = require('express');
var Firebase = require('firebase');
var app = express();
app.use(express.bodyParser());

var port = process.env.PORT || 3131;
var firebaseRef = process.env.FIREBASE_URL;
var fire = new Firebase(firebaseRef);

var prepare_data = function (req) {
    return {
        method: req.method,
        url: req.url,
        query: req.query,
        body: JSON.parse(req.body),
    }
};

app.get('/*', function (req, res) {
    var data = prepare_data(req);
    console.log(data);
    if (req.url != '/favicon.ico')
        fire.child('requests/get').push(data);
    res.send(data);
});

app.post('/*', function (req, res) {
    var data = prepare_data(req);
    console.log(data);
    fire.child('requests/post').push(data);
    res.send(data);
});

app.listen(port);
console.log('Listening on port ' + port);
