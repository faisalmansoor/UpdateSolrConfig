#!/bin/sh

if [ ! -d /opt/node/ ]; then
    echo Downloading node
    wget http://nodejs.org/dist/v0.10.33/node-v0.10.33-linux-x64.tar.gz
    tar -xf node-v0.10.33-linux-x64.tar.gz
    mv node-v0.10.33-linux-x64 /opt/node/

    echo "export PATH=$PATH:/opt/node/bin" >> /etc/profile
    rm node-v0.10.33-linux-x64.tar.gz
fi

echo working directory
pwd

echo
echo Installing daemon
chmod a+x ./UpdateSolrConfigCtl
rm /etc/init.d/UpdateSolrConfigCtl 2> /etc/null
cp -f ./UpdateSolrConfigCtl /etc/init.d/

echo
echo Installing npm modules
npm install

echo
echo Starting node server
/etc/init.d/UpdateSolrConfigCtl restart
