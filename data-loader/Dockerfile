FROM postgres:16

RUN apt-get update && apt-get install -y postgresql-client

COPY insert-data.sql /insert-data.sql
COPY populate-olap.sql /populate-olap.sql
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]