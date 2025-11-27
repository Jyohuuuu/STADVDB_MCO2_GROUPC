#!/bin/sh

echo "Waiting for OLTP database to be ready..."
until pg_isready -h postgres_oltp -p 5432 -U postgres -d university_oltp; do
  sleep 2
done

echo "Waiting for OLAP database to be ready..." 
until pg_isready -h postgres_olap -p 5432 -U postgres -d university_olap; do
  sleep 2
done

echo "Waiting for replication to be established..."
sleep 4

echo "Inserting sample data into OLTP..."
psql -h postgres_oltp -p 5432 -U postgres -d university_oltp -f /insert-data.sql

echo "Data insertion completed!"
echo "All data should now be replicated to OLAP automatically."

sleep 3

psql -h postgres_olap -p 5432 -U postgres -d university_olap -f /populate-olap.sql

echo "OLAP data population completed!"
