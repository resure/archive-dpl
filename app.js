var sys = require('sys');
var exec = require('child_process').exec;
var express = require('express');
var Firebase = require('firebase');
var app = express();
app.use(express.bodyParser());

var port = process.env.PORT || 3131;
var firebaseRef = process.env.FIREBASE_URL;
var fire = new Firebase(firebaseRef);

var prepare_data = function (req) {
    var payload;

    if (req.body && req.body.payload) {
        payload = req.body.payload;
    } else {
        payload = '';
    }

    return {
        method: req.method,
        url: req.url,
        query: req.query,
        payload: payload
    }
};

var deploy = function (commit, callback) {
    var cmd = exec("ssh ibr@asfx.net 'bash cap_deploy.sh -c " + commit + "'", function (error, stdout, stderr) {
        console.log(stderr);
        if (error === null) {
            fire.child('current').set(commit);
        } else {
            console.log('exec error: ' + error);
        }
        if (callback !== undefined)
            callback(error);
    });

    return cmd;
};

// app.get('/*', function (req, res) {
//     var data = prepare_data(req);
//     res.send(data);
// });

app.use('/', express.static(__dirname + '/frontend/dist'));

app.post('/*', function (req, res) {
    var data = prepare_data(req);
    var payload = JSON.parse(data.payload);
    if (payload.result == 0) {
        console.log("DEPLOY " + payload.commit.substring(0, 8));
        deploy(payload.commit);
    }
    console.log(data);
    fire.child('versions/' + payload.commit).set(data);
    res.send(data);
});

fire.child('status').on('value', function (snapshot) {
    var val = JSON.parse(snapshot.val());
    switch(val.action) {
        case 'idle':
            console.log('Status: idle');
            break;
        case 'deploy':
            console.log('Status: deploy');
            fire.child('status').set(JSON.stringify({action: 'deploying', commit: val.commit}));
            deploy(val.commit, function (e) {
                if (e === null)
                    fire.child('status').set(JSON.stringify({action: 'idle'}));
                else
                    fire.child('status').set(JSON.stringify({action: 'failed', commit: val.commit, error: e}));
            });
            break;
        case 'failed':
            console.log('Status: failed');
            break;
        case 'deploying':
            break;
    }
});

app.listen(port);
console.log('Listening on port ' + port);

