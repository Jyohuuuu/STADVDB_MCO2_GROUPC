# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os
import traceback
from load_sql import load_sql
app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

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
        with conn.cursor() as cur:
            cur.execute("SET search_path TO university, public;")
        return conn
    except Exception as e:
        print("ERROR:app:Failed to connect to the database")
        traceback.print_exc()
        raise e
    
@app.route("/api/students")
def get_students():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        #DEBUG : List all tables in the 'university' schema
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'university';
        """)
        tables = cur.fetchall()
        print("Tables in university schema:", tables)

        # DEBUG: Check if there are sections
        cur.execute("SELECT COUNT(*) FROM section;")
        section_count = cur.fetchone()[0]
        print(f"DEBUG: Found {section_count} sections in the database")

        # DEBUG: Check if there are courses
        cur.execute("SELECT COUNT(*) FROM course;")
        course_count = cur.fetchone()[0]
        print(f"DEBUG: Found {course_count} courses in the database")

        # DEBUG: Check if there are departments
        cur.execute("SELECT COUNT(*) FROM department;")
        dept_count = cur.fetchone()[0]
        print(f"DEBUG: Found {dept_count} departments in the database")

        # DEBUG: Check if there are instructors
        cur.execute("SELECT COUNT(*) FROM instructor;")
        instructor_count = cur.fetchone()[0]
        print(f"DEBUG: Found {instructor_count} instructors in the database")

        query = load_sql("get_students.sql")
        cur.execute(query)

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

@app.route("/api/catalog")
def get_catalog():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = load_sql("get_catalog.sql")
        print("DEBUG: Executing catalog query:")
        print(query)
        cur.execute(query)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        print(f"DEBUG: Query returned {len(rows)} rows")

        catalog = format_catalog(rows, columns)

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": catalog})

    except Exception as e:
        print("Error fetching catalog:")
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

def format_catalog(rows, columns):
    """Convert flat SQL join rows into nested Department, Courses, Sections."""
    print("DEBUG: format_catalog called with:")
    print(f"  - Rows count: {len(rows)}")
    print(f"  - Columns: {columns}")
    if rows:
        print(f"  - First row: {rows[0]}")
    
    idx = {col: i for i, col in enumerate(columns)}
    catalog = {}

    for r in rows:
        dept_id = r[idx["dept_id"]]

        if dept_id not in catalog:
            catalog[dept_id] = {
                "dept_id": dept_id,
                "dept_code": r[idx["dept_code"]],
                "dept_name": r[idx["dept_name"]],
                "courses": {}
            }

        course_id = r[idx["course_id"]]
        if course_id and course_id not in catalog[dept_id]["courses"]:
            catalog[dept_id]["courses"][course_id] = {
                "course_id": course_id,
                "course_code": r[idx["course_code"]],
                "course_title": r[idx["course_title"]],
                "credits": r[idx["credits"]],
                "sections": []
            }

        section_id = r[idx["section_id"]]
        if section_id:
            catalog[dept_id]["courses"][course_id]["sections"].append({
                "section_id": section_id,
                "section_code": r[idx["section_code"]],
                "capacity": r[idx["capacity"]],
                "instructor_id": r[idx["instructor_id"]],
                "instructor_name": r[idx["instructor_name"]]
            })

    # Convert dicts into lists
    result = [
        {
            **dept,
            "courses": list(dept["courses"].values())
        }
        for dept in catalog.values()
    ]
    
    print("DEBUG: format_catalog returning:")
    print(f"  - Department count: {len(result)}")
    for dept in result:
        print(f"  - Dept {dept['dept_code']}: {len(dept['courses'])} courses")
        for course in dept['courses']:
            print(f"    - Course {course['course_code']}: {len(course['sections'])} sections")
            for section in course['sections']:
                print(f"      - Section {section['section_code']}: {section.get('instructor_name', 'No instructor')}")
    
    return result

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
