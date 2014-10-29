#!/bin/sh

if [ ! -d /opt/node/ ]; then
    echo Downloading node
    wget http://nodejs.org/dist/v0.10.33/node-v0.10.33-linux-x64.tar.gz
    tar -xf node-v0.10.33-linux-x64.tar.gz
    mv node-v0.10.33-linux-x64 /opt/node/

    export PATH=$PATH:/opt/node/bin
fi

echo
echo Installing daemon
chmod +x ./UpdateSolrConfig
rm /etc/init.d/UpdateSolrConfig 2> /etc/null
cp -f ./UpdateSolrConfig /etc/init.d/

echo
echo Starting node server
/etc/init.d/UpdateSolrConfig restart
