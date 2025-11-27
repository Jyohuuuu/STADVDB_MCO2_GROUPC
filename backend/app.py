from flask import Flask, jsonify, request
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
DB_NAME = os.getenv("DB_NAME", "university_oltp")
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
            cur.execute("SET search_path TO university_oltp, public;")
        return conn
    except Exception as e:
        print("ERROR: Failed to connect to the database")
        traceback.print_exc()
        raise e
    
@app.route("/api/students")
def get_students():
    try:
        conn = get_db_connection()
        cur = conn.cursor()


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
        cur.execute(query)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]

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
                "instructor_name": r[idx["instructor_name"]],
                "remaining_slots": r[idx["remaining_slots"]]
            })

    result = [
        {
            **dept,
            "courses": list(dept["courses"].values())
        }
        for dept in catalog.values()
    ]
    
    return result

@app.route("/api/enroll", methods=["POST"])
def enroll_student():
    data = request.get_json()
    student_id = data.get("student_id")
    section_id = data.get("section_id")

    if not student_id or not section_id:
        return jsonify({"success": False, "error": "student_id and section_id are required"}), 400

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT remaining_slots
            FROM section
            WHERE section_id = %s
            FOR UPDATE
        """, (section_id,))
        row = cur.fetchone()
        if not row:
            conn.rollback()
            return jsonify({"success": False, "error": "Section not found"}), 404

        remaining_slots = row[0]
        if remaining_slots <= 0:
            conn.rollback()
            return jsonify({"success": False, "error": "Section is full"}), 409

        cur.execute("""
            SELECT 1
            FROM enrollment
            WHERE student_id = %s AND section_id = %s
            LIMIT 1
        """, (student_id, section_id))
        if cur.fetchone():
            conn.rollback()
            return jsonify({"success": False, "error": "Student already enrolled"}), 409

        cur.execute("""
            SELECT day_of_week, start_time, end_time
            FROM university_oltp.section_schedule
            WHERE section_id = %s
        """, (section_id,))
        new_section_schedule = cur.fetchall()

        cur.execute("""
            SELECT ss.day_of_week, ss.start_time, ss.end_time
            FROM enrollment e
            JOIN section_schedule ss ON e.section_id = ss.section_id
            WHERE e.student_id = %s
        """, (student_id,))
        current_schedules = cur.fetchall() 

        for new_day, new_start, new_end in new_section_schedule:
            for cur_day, cur_start, cur_end in current_schedules:
                if new_day == cur_day:
                    if not (new_end <= cur_start or new_start >= cur_end):
                        conn.rollback()
                        return jsonify({"success": False, "error": "Schedule conflict detected"}), 409

        cur.execute("""
            UPDATE section
            SET remaining_slots = remaining_slots - 1
            WHERE section_id = %s AND remaining_slots > 0
            RETURNING remaining_slots
        """, (section_id,))
        updated = cur.fetchone()
        if not updated:
            conn.rollback()
            return jsonify({"success": False, "error": "Section is full (concurrent)"}), 409

        cur.execute("""
            INSERT INTO enrollment (student_id, section_id)
            VALUES (%s, %s)
        """, (student_id, section_id))

        conn.commit()
        return jsonify({"success": True, "message": "Enrollment successful"})

    except psycopg2.IntegrityError:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": "Student already enrolled or integrity error"}), 409

    except Exception as e:
        if conn:
            conn.rollback()
        print("ERROR during enrollment:")
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    
@app.route("/api/enrolled_courses/<int:student_id>", methods=["GET"])
def get_enrolled_courses(student_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = load_sql("get_enrolled_courses.sql")
        cur.execute(query, (student_id,))
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]

        enrolled_courses = [
            dict(zip(columns, row)) for row in rows
        ]

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": enrolled_courses})

    except Exception as e:
        print("Error fetching enrolled courses:")
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route("/api/student_schedule", methods=["GET"])
def get_student_schedule():
    student_id = request.args.get("student_id")
    if not student_id:
        return jsonify({"success": False, "error": "student_id is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = load_sql("get_student_schedule.sql")
        cur.execute(query, (student_id,))
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]

        schedule = {}
        for r in rows:
            r_dict = dict(zip(columns, r))
            section_key = r_dict["section_id"]

            if section_key not in schedule:
                schedule[section_key] = {
                    "section_id": r_dict["section_id"],
                    "section_code": r_dict["section_code"],
                    "course_id": r_dict["course_id"],
                    "course_code": r_dict["course_code"],
                    "course_title": r_dict["course_title"],
                    "instructor_name": r_dict["instructor_name"],
                    "meetings": []
                }

            schedule[section_key]["meetings"].append({
                "day_of_week": r_dict["day_of_week"],
                "start_time": str(r_dict["start_time"]),
                "end_time": str(r_dict["end_time"])
            })

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": list(schedule.values())})

    except Exception as e:
        print("ERROR fetching student schedule:")
        import traceback
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500
    
@app.route("/api/reports/section_utilization")
def section_utilization():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = load_sql("section_utilization.sql")
        cur.execute(query)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in rows]
        cur.close()
        conn.close()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/reports/student_load_distribution")
def student_load_distribution():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = load_sql("student_load_distribution.sql")
        cur.execute(query)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        students = [dict(zip(columns, row)) for row in rows]

        total_credits_list = [s['total_credits'] for s in students]
        avg_credits = sum(total_credits_list) / len(total_credits_list) if total_credits_list else 0
        full_time_threshold = 12
        under_loaded_count = len([c for c in total_credits_list if c < full_time_threshold])
        
        distribution = {}
        for credits in total_credits_list:
            distribution[credits] = distribution.get(credits, 0) + 1

        distribution_percent = {k: round(v/len(students)*100,2) for k,v in distribution.items()}

        cur.close()
        conn.close()
        return jsonify({
            "success": True,
            "data": students,
            "metrics": {
                "average_credits": avg_credits,
                "under_loaded_count": under_loaded_count,
                "distribution_percent": distribution_percent
            }
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/reports/instructor_workload")
def instructor_workload():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = load_sql("instructor_workload.sql")
        cur.execute(query)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in rows]
        cur.close()
        conn.close()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route("/api/cancel_enrollment", methods=["POST"])
def cancel_enrollment():
    data = request.get_json()
    student_id = data.get("student_id")
    section_id = data.get("section_id")

    if not student_id or not section_id:
        return jsonify({"success": False, "error": "student_id and section_id are required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT 1 FROM enrollment WHERE student_id = %s AND section_id = %s", 
                    (student_id, section_id))
        if cur.fetchone() is None:
            cur.close()
            conn.close()
            return jsonify({"success": False, "error": "Student is not enrolled in this section"}), 404

        cur.execute("DELETE FROM enrollment WHERE student_id = %s AND section_id = %s",
                    (student_id, section_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Enrollment cancelled successfully"})

    except Exception as e:
        print("ERROR during cancel enrollment:")
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
