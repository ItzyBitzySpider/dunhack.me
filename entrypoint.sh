#!/bin/bash

#sleep for 30 seconds to wait for db to be ready for connections
sleep 30
npx prisma db push --accept-data-loss
npm run dev
