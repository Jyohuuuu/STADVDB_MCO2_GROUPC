CREATE SUBSCRIPTION olap_sub
    CONNECTION 'host=postgres_oltp port=5432 user=postgres password=password dbname=university_oltp'
    PUBLICATION oltp_pub
    WITH (copy_data = true);
