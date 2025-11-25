FROM postgres:16

COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY init-oltp.sql /docker-entrypoint-initdb.d/01_init.sql
COPY setup-publication.sql /docker-entrypoint-initdb.d/02_publication.sql

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
