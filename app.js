var SOLR_ROOT = '/opt/solr/solr/';

var express = require('express');
var fs = require('fs');
var multer = require('multer');
var util = require('util');
var unzip = require('unzip');
var shell = require('shelljs');

var app = express();

app.use(multer({ dest: '/tmp/'}));

app.get('/', function (req, res) {
    var package = JSON.parse('package.json');
    res.write('Solr Deployment tool. Version=' + package.version);
    res.write('\n')
    printUsage(res);
    res.end();
});

function printUsage(res) {
    var usage = util.format(
        'USAGE: curl -i -F name=config -F config=@solrconfig.zip d "coreName=DocWebSearch" http://%s/solrdeploy\n',
        req.headers.host);

    res.write(usage);
};

app.post('/solrdeploy', function (req, res) {	
    res.write('Deploying new Solr configuration!\n');

    var coreName = req.param('coreName');
    if(coreName.length == 0) {
        res.write('coreName is required.\n');
        printUsage(res);
        res.end();
    }

    if(Object.keys(req.files).length == 0) {
        res.write("Config folder zipped with name 'config' is required.\n");
        printUsage(res);
        res.end();
    }

    try {
        console.log(req.files);
        console.log('Working Dir: ' + shell.pwd());

        res.write('stopping solr service.\n');
        shell.exec('/etc/init.d/solr stop');
        res.write('solr service stopping.\n');

        var configPath = SOLR_ROOT + coreName + '/conf';
        res.write('deleting existing config files from:' + configPath + '\n');
        shell.exec('rm -r ' + configPath);
        res.write('deleted existing config files. \n');

        fs.createReadStream(req.files.config.path).pipe(unzip.Extract({ path: configPath }));

        res.write('starting solr service.\n');
        shell.exec("/etc/init.d/solr start");
        res.write('solr service started.\n');

        res.write('Solr config update!\n');
        res.end();
    }
    catch(e) {
        res.write('Unexpected error occurred: ' + e.message)
    }
});

var server = app.listen(3333, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('UpdateSolrConfig listening at http://%s:%s', host, port)
});
