var express = require('express');
var app = express();

app.use(function (req, res, next) {
    var respond = {
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body
    };
    console.log(respond);
    next();
});

app.get('/*', function(req, res){
    var respond = {
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body
    };
    res.send(respond);
});

var port = process.env.PORT || 3131;
app.listen(port);
console.log('Listening on port ' + port);
