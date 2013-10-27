var express = require('express');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "main"});
var app = express();

app.use(function (req, res, next) {
    logger.info({ req: bunyan.stdSerializers.req(req) }, 'start');
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
