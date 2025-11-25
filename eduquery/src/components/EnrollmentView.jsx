import CourseCatalog from "./CourseCatalog";
import ScheduleView from "./ScheduleView";

function EnrollmentView({
	students,
	selectedStudent,
	onBackToStudents,
	catalog,
	catalogLoading,
	catalogError,
	onFetchCatalog,
	openDepartments,
	onDepartmentToggle,
	expandedCourses,
	onCourseToggle,
	expandedSections,
	onSectionToggle,
	onEnroll,
	onCancelEnrollment,
	enrollmentLoading,
	enrollmentFeedback,
	activeTab = "catalog",
	enrolledCourses,
	enrolledLoading,
	enrolledError,
	onFetchEnrolled,
	schedule,
	scheduleLoading,
	scheduleError,
	onFetchSchedule,
}) {
	const student = students.find(
		(s) => s.student_id === parseInt(selectedStudent)
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case "catalog":
				return (
					<CourseCatalog
						catalog={catalog}
						catalogLoading={catalogLoading}
						catalogError={catalogError}
						onRefresh={onFetchCatalog}
						openDepartments={openDepartments}
						onDepartmentToggle={onDepartmentToggle}
						expandedCourses={expandedCourses}
						onCourseToggle={onCourseToggle}
						expandedSections={expandedSections}
						onSectionToggle={onSectionToggle}
						onEnroll={onEnroll}
						enrollmentLoading={enrollmentLoading}
						enrollmentFeedback={enrollmentFeedback}
					/>
				);
			case "schedule":
				return <ScheduleView scheduleData={schedule} />;
			case "enrolled":
				return (
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold text-slate-800 font-jakarta">
								Currently Enrolled Classes
							</h3>
							<button
								onClick={onFetchEnrolled}
								disabled={enrolledLoading}
								className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:opacity-50"
							>
								{enrolledLoading ? "Loading..." : "Refresh"}
							</button>
						</div>

						{enrolledError && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-700 text-sm font-medium">
									{enrolledError}
								</p>
								<button
									onClick={onFetchEnrolled}
									className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
								>
									Try again
								</button>
							</div>
						)}

						{enrolledLoading ? (
							<div className="text-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
								<p className="text-slate-600 font-inter">
									Loading enrolled courses...
								</p>
							</div>
						) : enrolledCourses.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-4xl mb-4"></div>
								<p className="text-slate-600 font-inter">
									No enrolled courses found. Start by enrolling in some courses
									from the catalog!
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{enrolledCourses.map((course) => (
									<div
										key={`${course.course_id}-${course.section_id}`}
										className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="text-xl font-bold text-slate-800 mb-2 font-jakarta">
													{course.course_code} - {course.course_title}
												</h4>
												<div className="space-y-2">
													<div className="flex items-center space-x-4 text-sm">
														<span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
															Section {course.section_code}
														</span>
														<span className="text-slate-600">
															{course.credits}{" "}
															{course.credits === 1 ? "Credit" : "Credits"}
														</span>
													</div>
													{course.instructor_name && (
														<div className="flex items-center space-x-2 text-sm text-slate-600">
															<span className="font-medium">Instructor:</span>
															<span>{course.instructor_name}</span>
														</div>
													)}
													<div className="flex items-center space-x-2 text-sm text-slate-600">
														<span className="font-medium">Capacity:</span>
														<span>{course.capacity} students</span>
													</div>
												</div>

												{/* Feedback Message */}
												{enrollmentFeedback[course.section_id] && (
													<div
														className={`mt-3 p-2 rounded-lg text-sm ${
															enrollmentFeedback[course.section_id].type ===
															"success"
																? "bg-green-50 text-green-700 border border-green-200"
																: "bg-red-50 text-red-700 border border-red-200"
														}`}
													>
														{enrollmentFeedback[course.section_id].message}
													</div>
												)}
											</div>
											<div className="flex flex-col items-end space-y-2">
												<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
													Enrolled
												</span>
												<button
													onClick={() => onCancelEnrollment(course.section_id)}
													disabled={enrollmentLoading.has(course.section_id)}
													className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
												>
													{enrollmentLoading.has(course.section_id) ? (
														<>
															<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
															Cancelling...
														</>
													) : (
														<>Cancel Enrollment</>
													)}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<button
					onClick={onBackToStudents}
					className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta flex items-center gap-2"
				>
					← Back to Student Selection
				</button>
			</div>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-slate-800 mb-2 font-jakarta leading-tight">
					{student ? `${student.first_name} ${student.last_name}` : "Student"}'s
					Enrollment
				</h2>
			</div>
			{renderTabContent()}
		</div>
	);
}

export default EnrollmentView;
