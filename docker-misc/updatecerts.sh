#!/bin/bash

email=$(jq -r '.email' config.json)
domain=$(jq -r '.domain' config.json)
certpath=$(jq -r '.certpath' config.json)
certbot -m $email -d $domain -n
cp /etc/letsencrypt/$domain/*.pem $certpath
openssl dhparam -dsaparam -out $certpath/dhparam.pem 4096

