import { useState, useEffect } from "react";
import {
	Header,
	Welcome,
	StudentSelector,
	EnrollmentView,
	Sidebar,
} from "./components";

function App() {
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showEnrollment, setShowEnrollment] = useState(false);
	const [catalog, setCatalog] = useState([]);
	const [catalogLoading, setCatalogLoading] = useState(false);
	const [catalogError, setCatalogError] = useState("");
	const [openDepartments, setOpenDepartments] = useState(new Set());
	const [expandedCourses, setExpandedCourses] = useState(new Set());
	const [expandedSections, setExpandedSections] = useState(new Set());
	const [enrollmentLoading, setEnrollmentLoading] = useState(new Set());
	const [enrollmentFeedback, setEnrollmentFeedback] = useState({});
	const [activeTab, setActiveTab] = useState("catalog");
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [enrolledLoading, setEnrolledLoading] = useState(false);
	const [enrolledError, setEnrolledError] = useState("");
	const [schedule, setSchedule] = useState([]);
	const [scheduleLoading, setScheduleLoading] = useState(false);
	const [scheduleError, setScheduleError] = useState("");
	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch(`${API_URL}/api/students`);
			const data = await response.json();

			if (data.success) {
				setStudents(data.data);
			} else {
				setError("Failed to fetch students");
			}
		} catch (err) {
			setError("Error connecting to server. Make sure backend is running.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchCatalog = async () => {
		setCatalogLoading(true);
		setCatalogError("");
		try {
			const response = await fetch(`${API_URL}/api/catalog`);
			const data = await response.json();

			if (data.success) {
				setCatalog(data.data);
			} else {
				setCatalogError("Failed to fetch catalog");
			}
		} catch (err) {
			setCatalogError(
				"Error connecting to server. Make sure backend is running."
			);
			console.error(err);
		} finally {
			setCatalogLoading(false);
		}
	};

	const fetchEnrolledCourses = async (studentId) => {
		if (!studentId) return;

		setEnrolledLoading(true);
		setEnrolledError("");
		try {
			const response = await fetch(
				`${API_URL}/api/enrolled_courses/${studentId}`
			);
			const data = await response.json();

			if (data.success) {
				setEnrolledCourses(data.data);
			} else {
				setEnrolledError("Failed to fetch enrolled courses");
			}
		} catch (err) {
			setEnrolledError(
				"Error connecting to server. Make sure backend is running."
			);
			console.error(err);
		} finally {
			setEnrolledLoading(false);
		}
	};

	const fetchSchedule = async (studentId) => {
		if (!studentId) return;

		setScheduleLoading(true);
		setScheduleError("");
		try {
			const response = await fetch(
				`${API_URL}/api/student_schedule?student_id=${studentId}`
			);
			const data = await response.json();

			if (data.success) {
				setSchedule(data.data);
			} else {
				setScheduleError("Failed to fetch schedule");
			}
		} catch (err) {
			setScheduleError(
				"Error connecting to server. Make sure backend is running."
			);
			console.error(err);
		} finally {
			setScheduleLoading(false);
		}
	};

	const handleStudentChange = (e) => {
		setSelectedStudent(e.target.value);
		setShowEnrollment(false); // will add of comments in the docs
	};

	const handleEnrollmentClick = () => {
		setShowEnrollment(true);
		fetchCatalog();
		fetchEnrolledCourses(selectedStudent);
		fetchSchedule(selectedStudent);
	};

	const handleBackToStudents = () => {
		setShowEnrollment(false);
	};

	const handleTabChange = (newTab) => {
		setActiveTab(newTab);
		if (newTab === "enrolled" && selectedStudent) {
			fetchEnrolledCourses(selectedStudent);
		} else if (newTab === "schedule" && selectedStudent) {
			fetchSchedule(selectedStudent);
		}
	};

	const toggleDepartment = (deptId) => {
		setOpenDepartments((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(deptId)) {
				newSet.delete(deptId);
			} else {
				newSet.add(deptId);
			}
			return newSet;
		});
	};

	const toggleCourse = (courseId) => {
		setExpandedCourses((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(courseId)) {
				newSet.delete(courseId);
			} else {
				newSet.add(courseId);
			}
			return newSet;
		});
	};

	const toggleSection = (sectionId) => {
		setExpandedSections((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(sectionId)) {
				newSet.delete(sectionId);
			} else {
				newSet.add(sectionId);
			}
			return newSet;
		});
	};

	const handleEnroll = async (sectionId) => {
		if (!selectedStudent) {
			setEnrollmentFeedback((prev) => ({
				...prev,
				[sectionId]: {
					type: "error",
					message: "Please select a student first",
				},
			}));
			return;
		}

		setEnrollmentLoading((prev) => new Set([...prev, sectionId]));
		setEnrollmentFeedback((prev) => ({ ...prev, [sectionId]: null }));

		try {
			const response = await fetch(`${API_URL}/api/enroll`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					student_id: selectedStudent,
					section_id: sectionId,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setEnrollmentFeedback((prev) => ({
					...prev,
					[sectionId]: { type: "success", message: "Enrollment successful!" },
				}));
				if (activeTab === "enrolled") {
					fetchEnrolledCourses(selectedStudent);
				} else if (activeTab === "schedule") {
					fetchSchedule(selectedStudent);
				}
				fetchSchedule(selectedStudent);
			} else {
				setEnrollmentFeedback((prev) => ({
					...prev,
					[sectionId]: {
						type: "error",
						message: data.error || "Enrollment failed",
					},
				}));
			}
		} catch (err) {
			setEnrollmentFeedback((prev) => ({
				...prev,
				[sectionId]: { type: "error", message: "Error connecting to server" },
			}));
			console.error("Enrollment error:", err);
		} finally {
			setEnrollmentLoading((prev) => {
				const newSet = new Set(prev);
				newSet.delete(sectionId);
				return newSet;
			});

			setTimeout(() => {
				setEnrollmentFeedback((prev) => ({ ...prev, [sectionId]: null }));
			}, 3000);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			<Header showEnrollment={showEnrollment} />

			{showEnrollment ? (
				<div className="flex">
					<Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
					<div className="flex-1">
						<main className="px-8 py-12">
							<EnrollmentView
								students={students}
								selectedStudent={selectedStudent}
								catalog={catalog}
								catalogLoading={catalogLoading}
								catalogError={catalogError}
								onBackToStudents={handleBackToStudents}
								onFetchCatalog={fetchCatalog}
								openDepartments={openDepartments}
								onDepartmentToggle={toggleDepartment}
								expandedCourses={expandedCourses}
								onCourseToggle={toggleCourse}
								expandedSections={expandedSections}
								onSectionToggle={toggleSection}
								onEnroll={handleEnroll}
								enrollmentLoading={enrollmentLoading}
								enrollmentFeedback={enrollmentFeedback}
								activeTab={activeTab}
								enrolledCourses={enrolledCourses}
								enrolledLoading={enrolledLoading}
								enrolledError={enrolledError}
								onFetchEnrolled={() => fetchEnrolledCourses(selectedStudent)}
								schedule={schedule}
								scheduleLoading={scheduleLoading}
								scheduleError={scheduleError}
								onFetchSchedule={() => fetchSchedule(selectedStudent)}
							/>
						</main>
					</div>
				</div>
			) : (
				<div className="max-w-7xl mx-auto">
					<main className="px-8 py-12">
						<Welcome />

						<StudentSelector
							students={students}
							selectedStudent={selectedStudent}
							loading={loading}
							error={error}
							onStudentChange={handleStudentChange}
							onEnrollmentClick={handleEnrollmentClick}
							onRetry={fetchStudents}
						/>
					</main>
				</div>
			)}
		</div>
	);
}

export default App;
