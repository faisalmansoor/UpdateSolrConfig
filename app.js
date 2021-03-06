var express = require('express');
var fs = require('fs');
var multer = require('multer');
var util = require('util');
var unzip = require('unzip');
var shell = require('shelljs');
var config = require('./config')

var app = express();

app.use(multer({ dest: '/tmp/'}));

app.get('/', function (req, res) {
    res.write('Solr Deployment tool. Version=' + config.version);
    res.write('\n')
    printUsage(req, res);
    res.end();
});

app.post('/solrdeploy', function (req, res) {
    try {
        res.write('Deploying new Solr configuration!\n');

        var coreName = req.param('coreName');
        if (coreName === undefined) {
            res.write('coreName is required.\n');
            printUsage(req, res);
            res.end();
        }

        if (!req.hasOwnProperty('files') || Object.keys(req.files).length === 0) {
            res.write("Config folder zipped with name 'config' is required.\n");
            printUsage(req, res);
            res.end();
        }

        res.write('stopping solr service.\n');
        var result = shell.exec('/etc/init.d/solr stop');
        res.write(JSON.stringify(result) + '\n');
        res.write('stopped solr service.\n\n');

        var configPath = config.solrRoot + coreName + '/conf';
        res.write('deleting existing config files from:' + configPath + '\n');
        result = shell.exec('rm -r ' + configPath);
        res.write(JSON.stringify(result) + '\n' );
        res.write('deleted existing config files. \n\n');

        fs.createReadStream(req.files.config.path).pipe(unzip.Extract({ path: configPath }));

        res.write('starting solr service.\n');
        result = shell.exec("/etc/init.d/solr start");
        res.write(JSON.stringify(result) + '\n');
        res.write('started solr service.\n\n');

        res.write('Solr config update!\n');
        res.end();
    }
    catch(e) {
        res.write('Unexpected error occurred: ' + e.message);
        res.end();
    }
});

function printUsage(req, res) {
    var usage = util.format(
        '\nUSAGE: D:/devTools/Git/bin/curl.exe -i -F "config=@config.zip" http://%s/solrdeploy?coreName=collection1\n',
        req.headers.host);

    res.write(usage);
};

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('UpdateSolrConfig listening at http://%s:%s', host, port);
});
