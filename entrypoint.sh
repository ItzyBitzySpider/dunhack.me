#!/bin/bash
sleep 60 #accomodate postgres DB startup without triggering shutdown
npm run build
npm run start
