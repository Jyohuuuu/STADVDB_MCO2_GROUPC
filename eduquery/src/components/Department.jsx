import Course from "./Course";

function Department({
	department,
	isOpen,
	onToggle,
	expandedCourses,
	onCourseToggle,
	expandedSections,
	onSectionToggle,
	onEnroll,
	enrollmentLoading,
	enrollmentFeedback,
}) {
	return (
		<div className="border border-slate-200 rounded-xl overflow-hidden">
			{/* Department Header */}
			<button
				onClick={onToggle}
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
								isOpen ? "rotate-180" : ""
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
			{isOpen && (
				<div className="p-4 space-y-3 bg-slate-50/50">
					{department.courses.length === 0 ? (
						<p className="text-slate-500 font-inter text-center py-4">
							No courses available in this department.
						</p>
					) : (
						department.courses.map((course) => (
							<Course
								key={course.course_id}
								course={course}
								isExpanded={expandedCourses.has(course.course_id)}
								onToggle={() => onCourseToggle(course.course_id)}
								expandedSections={expandedSections}
								onSectionToggle={onSectionToggle}
								onEnroll={onEnroll}
								enrollmentLoading={enrollmentLoading}
								enrollmentFeedback={enrollmentFeedback}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
}

export default Department;
