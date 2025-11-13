# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os
import traceback

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# DB configuration from environment
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "university")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

def get_db_connection():
    """Return a psycopg2 connection with search_path set to 'university'"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        # Set search path to university schema for this connection
        with conn.cursor() as cur:
            cur.execute("SET search_path TO university, public;")
        return conn
    except Exception as e:
        print("ERROR:app:Failed to connect to the database")
        import traceback
        traceback.print_exc()  # full stack trace
        raise e
    
@app.route("/api/students")
def get_students():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Print all tables in the university schema
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'university';
        """)
        tables = cur.fetchall()
        print("Tables in university schema:", tables)

        # Now fetch students
        cur.execute("""
            SELECT student_id, student_number, first_name, last_name, email 
            FROM student;  -- no need for university.student if search_path is set
        """)
        rows = cur.fetchall()
        students = [
            dict(zip([desc[0] for desc in cur.description], row)) for row in rows
        ]

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": students})

    except Exception as e:
        import traceback
        print("Error fetching students:")
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
