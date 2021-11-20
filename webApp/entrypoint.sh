#!/bin/bash

#sleep for 10 seconds to wait for db to be ready for connections
sleep 10
npx prisma migrate dev
npm run dev