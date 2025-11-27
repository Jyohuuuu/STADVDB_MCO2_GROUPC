FROM postgres:16

COPY postgresql.conf /etc/postgresql/postgresql.conf

COPY init-oltp.sql /docker-entrypoint-initdb.d/01_init.sql
COPY setup-publication.sql /docker-entrypoint-initdb.d/02_publication.sql
COPY pg_hba.conf /etc/postgresql/pg_hba.conf    

RUN mkdir -p /var/lib/postgresql/wal_archive

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]