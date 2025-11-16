import { useState, useEffect } from "react";

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

	const handleStudentChange = (e) => {
		setSelectedStudent(e.target.value);
		setShowEnrollment(false); // Reset enrollment view when student changes
	};

	const handleEnrollmentClick = () => {
		setShowEnrollment(true);
		fetchCatalog(); // Fetch catalog when entering enrollment view
	};

	const handleBackToStudents = () => {
		setShowEnrollment(false);
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			<div className="max-w-7xl mx-auto">
				<header className="backdrop-blur-sm bg-white/80 px-8 py-6 shadow-sm border-b border-white/20 text-left">
					<h1 className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent text-5xl font-black tracking-tight font-inter hover:animate-pulse cursor-default">
						EduQuery
					</h1>
				</header>

				<main className="px-8 py-12">
					{!showEnrollment ? (
						<>
							<div className="text-center mb-16">
								<h2 className="text-4xl font-bold text-slate-800 mb-6 font-jakarta leading-tight">
									Welcome to{" "}
									<span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text animate-pulse">
										EduQuery
									</span>
								</h2>
								<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-inter">
									Your comprehensive university information system designed for
									the modern academic experience ✨
								</p>
							</div>

							{/* Student Selector Section */}
							<div className="max-w-2xl mx-auto mb-16">
								<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
									<div className="text-center mb-6">
										<h3 className="text-2xl font-bold text-slate-800 mb-2 font-jakarta">
											Select a Student
										</h3>
										<p className="text-slate-600 font-inter">
											Choose a student to view their information
										</p>
									</div>

									{error && (
										<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
											<p className="text-red-700 text-sm font-medium">
												{error}
											</p>
											<button
												onClick={fetchStudents}
												className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
											>
												Try again
											</button>
										</div>
									)}

									<div className="space-y-4">
										<select
											value={selectedStudent}
											onChange={handleStudentChange}
											disabled={loading}
											className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-inter text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
										>
											<option value="">
												{loading
													? "Loading students..."
													: "Select a student..."}
											</option>
											{students.map((student) => (
												<option
													key={student.student_id}
													value={student.student_id}
												>
													{student.student_number} - {student.first_name}{" "}
													{student.last_name}
												</option>
											))}
										</select>

										{selectedStudent && (
											<div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
												{(() => {
													const student = students.find(
														(s) => s.student_id === parseInt(selectedStudent)
													);
													return student ? (
														<div className="space-y-4">
															<h4 className="font-bold text-emerald-800 font-jakarta">
																Selected Student:
															</h4>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
																<div>
																	<span className="font-medium text-emerald-700">
																		ID:
																	</span>{" "}
																	<span className="text-emerald-900">
																		{student.student_id}
																	</span>
																</div>
																<div>
																	<span className="font-medium text-emerald-700">
																		Number:
																	</span>{" "}
																	<span className="text-emerald-900">
																		{student.student_number}
																	</span>
																</div>
																<div>
																	<span className="font-medium text-emerald-700">
																		Name:
																	</span>{" "}
																	<span className="text-emerald-900">
																		{student.first_name} {student.last_name}
																	</span>
																</div>
																<div>
																	<span className="font-medium text-emerald-700">
																		Email:
																	</span>{" "}
																	<span className="text-emerald-900">
																		{student.email}
																	</span>
																</div>
															</div>

															{/* Enrollment Simulation Button */}
															<div className="pt-4 border-t border-emerald-200">
																<button
																	onClick={handleEnrollmentClick}
																	className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-jakarta"
																>
																	🎓 Start Enrollment Simulation
																</button>
															</div>
														</div>
													) : null;
												})()}
											</div>
										)}

										<div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
											<div className="flex items-center space-x-2">
												<div
													className={`w-2 h-2 rounded-full ${
														loading
															? "bg-yellow-400"
															: error
															? "bg-red-400"
															: "bg-green-400"
													}`}
												></div>
												<span>
													{loading
														? "Loading..."
														: error
														? "Connection Error"
														: `${students.length} students loaded`}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</>
					) : (
						/* Enrollment Simulation View */
						<div className="max-w-4xl mx-auto">
							<div className="text-center mb-8">
								<h2 className="text-4xl font-bold text-slate-800 mb-4 font-jakarta leading-tight">
									🎓 Enrollment Simulation
								</h2>
								<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-inter">
									{(() => {
										const student = students.find(
											(s) => s.student_id === parseInt(selectedStudent)
										);
										return student
											? `Simulating course enrollment for ${student.first_name} ${student.last_name}`
											: "Course Enrollment Simulation";
									})()}
								</p>
							</div>

							{/* Back Button */}
							<div className="mb-8">
								<button
									onClick={handleBackToStudents}
									className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta flex items-center gap-2"
								>
									← Back to Student Selection
								</button>
							</div>

							{/* Course Catalog */}
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-2xl font-bold text-slate-800 font-jakarta">
										Course Catalog
									</h3>
									<button
										onClick={fetchCatalog}
										disabled={catalogLoading}
										className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:opacity-50"
									>
										{catalogLoading ? "Loading..." : "Refresh"}
									</button>
								</div>

								{catalogError && (
									<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
										<p className="text-red-700 text-sm font-medium">
											{catalogError}
										</p>
										<button
											onClick={fetchCatalog}
											className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
										>
											Try again
										</button>
									</div>
								)}

								{catalogLoading ? (
									<div className="text-center py-12">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
										<p className="text-slate-600 font-inter">
											Loading course catalog...
										</p>
									</div>
								) : catalog.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-4xl mb-4">📚</div>
										<p className="text-slate-600 font-inter">
											No courses available in the catalog.
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{catalog.map((department) => (
											<div
												key={department.dept_id}
												className="border border-slate-200 rounded-xl overflow-hidden"
											>
												{/* Department Header - Clickable */}
												<button
													onClick={() => toggleDepartment(department.dept_id)}
													className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 text-left transition-all duration-200"
												>
													<div className="flex items-center justify-between">
														<h4 className="text-xl font-bold font-jakarta">
															{department.dept_code} - {department.dept_name}
														</h4>
														<div className="flex items-center space-x-2">
															<span className="text-sm bg-white/20 px-2 py-1 rounded-full">
																{department.courses.length} courses
															</span>
															<svg
																className={`w-5 h-5 transition-transform duration-200 ${
																	openDepartments.has(department.dept_id)
																		? "rotate-180"
																		: ""
																}`}
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M19 9l-7 7-7-7"
																/>
															</svg>
														</div>
													</div>
												</button>

												{/* Courses - Collapsible */}
												{openDepartments.has(department.dept_id) && (
													<div className="p-4 space-y-3 bg-slate-50/50">
														{department.courses.length === 0 ? (
															<p className="text-slate-500 font-inter text-center py-4">
																No courses available in this department.
															</p>
														) : (
															department.courses.map((course) => (
																<div
																	key={course.course_id}
																	className="bg-white rounded-lg border border-slate-200 overflow-hidden"
																>
																	{/* Course Header - Clickable */}
																	<button
																		onClick={() =>
																			toggleCourse(course.course_id)
																		}
																		className="w-full p-4 text-left hover:bg-slate-50 transition-colors duration-200"
																	>
																		<div className="flex items-center justify-between">
																			<div>
																				<h5 className="text-lg font-semibold text-slate-800 font-jakarta">
																					{course.course_code} -{" "}
																					{course.course_title}
																				</h5>
																				<p className="text-emerald-600 font-medium text-sm">
																					{course.credits}{" "}
																					{course.credits === 1
																						? "Credit"
																						: "Credits"}
																					{course.sections.length > 0 && (
																						<span className="text-slate-500 ml-2">
																							• {course.sections.length}{" "}
																							{course.sections.length === 1
																								? "section"
																								: "sections"}
																						</span>
																					)}
																				</p>
																				{!expandedCourses.has(
																					course.course_id
																				) &&
																					course.sections.length > 0 && (
																						<div className="mt-2 text-xs text-slate-600">
																							<span className="font-medium">
																								Instructors:{" "}
																							</span>
																							{course.sections
																								.filter(
																									(section) =>
																										section.instructor_name
																								)
																								.map(
																									(section) =>
																										section.instructor_name
																								)
																								.filter(
																									(name, index, arr) =>
																										arr.indexOf(name) === index
																								) // Remove duplicates
																								.join(", ") || "TBA"}
																						</div>
																					)}
																			</div>
																			<svg
																				className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
																					expandedCourses.has(course.course_id)
																						? "rotate-180"
																						: ""
																				}`}
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth={2}
																					d="M19 9l-7 7-7-7"
																				/>
																			</svg>
																		</div>
																	</button>

																	{/* Sections - Expandable */}
																	{expandedCourses.has(course.course_id) &&
																		course.sections.length > 0 && (
																			<div className="px-4 pb-4 border-t border-slate-100">
																				<div className="pt-3">
																					<h6 className="text-sm font-semibold text-slate-700 mb-3 font-jakarta">
																						Available Sections:
																					</h6>
																					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
																						{course.sections.map((section) => (
																							<div
																								key={section.section_id}
																								className="bg-slate-50 rounded-md p-3 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
																							>
																								<div className="flex items-center justify-between mb-2">
																									<span className="font-medium text-slate-800">
																										Section{" "}
																										{section.section_code}
																									</span>
																									<span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
																										Cap: {section.capacity}
																									</span>
																								</div>
																								<div className="space-y-1">
																									{section.instructor_name ? (
																										<p className="text-sm text-slate-700 font-medium">
																											{" "}
																											{section.instructor_name}
																										</p>
																									) : section.instructor_id ? (
																										<p className="text-xs text-slate-500">
																											Instructor ID:{" "}
																											{section.instructor_id}
																										</p>
																									) : (
																										<p className="text-xs text-slate-400 italic">
																											No instructor assigned
																										</p>
																									)}
																								</div>
																							</div>
																						))}
																					</div>
																				</div>
																			</div>
																		)}
																</div>
															))
														)}
													</div>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default App;
