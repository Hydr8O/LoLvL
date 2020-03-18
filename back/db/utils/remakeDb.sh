#!/bin/bash

export PGPASSWORD='1'

dropdb -U test -h 127.0.0.1 loldb
createdb -U test -h 127.0.0.1 loldb

psql -U test -h 127.0.0.1 -f ../Schemes/all.sql loldb

