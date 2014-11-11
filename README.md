UpdateSolrConfig
================

Node server to update SOLR config folder over http

To install just download and run UpdateSolrConfig download script as follows:

```
cd /opt/
wget https://raw.githubusercontent.com/faisalmansoor/UpdateSolrConfig/master/download.sh
./download.sh
```
This script will download the master branch from this repo into `/opt/UpdateSolrConfig` and run `install.sh` file. 

`install.sh` will 

* Download node if not available in `/opt/node` and add it to path
* Run `npm install` to install node dependencies
* Install `UpdateSolrConfigCtl` file in `init.d` wich will autostart `UpdateSolrConfig` node server upon restart
* Start `UpdateSolrConfig` node server on port `3333`

Now you should be able to access `UpdateSolrConfig` node server remotely at `http://hostanae:3333/`, which should show the  usage message.

Now you should be ready to push solr configuration folder using the following curl command.

`USAGE: curl.exe -i -F "config=@config.zip" http://hostname:3333/solrdeploy?coreName=collection1`

`SolrDeploy` POST request will:

* Stop the solr server
* Unzip files from `config.zip` into `/solr/collection1/conf` folder.
* Start the solr server

Most of the log messages are send to client over http response, so you don't have to log into the server to see if something goes wrong. Server internal log is stored in `/opt/UpdateSolrConfig/log` folder which is a log place to check if the server fails to start etc.

Some paths are hardcoded in the script, so you might have to change them if you don't have solr in ths same folder.

Enjoy.










