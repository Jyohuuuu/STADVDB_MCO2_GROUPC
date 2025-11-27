#!/bin/bash
set -e

PGDATA="/var/lib/postgresql/data"

sleep 2

if [ ! -s "$PGDATA/PG_VERSION" ]; then
    rm -rf "$PGDATA"/*

    su postgres -c "pg_basebackup -h postgres_oltp -U replicator -D $PGDATA -Fp -Xs -P -R --slot=hotbackup_slot"

    chmod 700 "$PGDATA"
fi

exec su postgres -c "postgres -c config_file=/etc/postgresql/postgresql.conf"
