#!/bin/bash
# sleep 60 #accomodate postgres DB startup without triggering shutdown
until psql -c 'SELECT * FROM Account'
do
    echo 'Waiting...'
    sleep 2
done
npm run build
npm run start
