#!/bin/sh

echo Removing UpdateSolrConfig if it exists
rm -f UpdateSolrConfig.zip 2> /dev/null
rm -fr UpdateSolrConfig 2> /dev/null

echo
echo Downloading new package
wget -O UpdateSolrConfig.zip https://github.com/faisalmansoor/UpdateSolrConfig/archive/master.zip

echo
echo Unzipping
unzip -j UpdateSolrConfig.zip -d UpdateSolrConfig
rm -f UpdateSolrConfig.zip