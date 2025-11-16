import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_sql(file_name):
    sql_path = os.path.join(BASE_DIR, "sql", file_name)
    print("Loading SQL from:", sql_path)  #DEBUG
    with open(sql_path, "r") as f:
        return f.read()
