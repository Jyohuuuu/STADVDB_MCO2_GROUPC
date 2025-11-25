FROM postgres:16

COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY init-olap.sql /docker-entrypoint-initdb.d/01_init.sql
COPY setup-subscription.sql /docker-entrypoint-initdb.d/02_subscription.sql

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
