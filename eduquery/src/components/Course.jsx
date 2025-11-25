import Section from "./Section";

function Course({
	course,
	isExpanded,
	onToggle,
	expandedSections,
	onSectionToggle,
	onEnroll,
	enrollmentLoading,
	enrollmentFeedback,
}) {
	const getInstructorSummary = () => {
		if (course.sections.length === 0) return "No sections";
		const instructors = [
			...new Set(
				course.sections
					.filter((s) => s.instructor_name)
					.map((s) => s.instructor_name.split(" ").pop())
			),
		];
		return instructors.length > 0
			? `Instructors: ${instructors.slice(0, 2).join(", ")}${
					instructors.length > 2 ? "..." : ""
			  }`
			: "Instructors: TBA";
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			{/* Course Header */}
			<button
				onClick={onToggle}
				className="w-full p-4 text-left hover:bg-slate-50 transition-colors duration-200"
			>
				<div className="flex items-center justify-between">
					<div>
						<h5 className="text-lg font-semibold text-slate-800 font-jakarta">
							{course.course_code} - {course.course_title}
						</h5>
						<div className="flex items-center space-x-4 text-sm">
							<p className="text-emerald-600 font-medium">
								{course.credits} {course.credits === 1 ? "Credit" : "Credits"}
							</p>
							{course.sections.length > 0 && (
								<span className="text-slate-500">
									• {course.sections.length} sections
								</span>
							)}
							{!isExpanded && (
								<span className="text-slate-400 text-xs">
									{getInstructorSummary()}
								</span>
							)}
						</div>
					</div>
					<svg
						className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
							isExpanded ? "rotate-180" : ""
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
			{isExpanded && course.sections.length > 0 && (
				<div className="px-4 pb-4 border-t border-slate-100">
					<div className="pt-3">
						<h6 className="text-sm font-semibold text-slate-700 mb-3 font-jakarta">
							Available Sections:
						</h6>
						<div className="space-y-2">
							{course.sections.map((section) => (
								<Section
									key={section.section_id}
									section={section}
									isExpanded={expandedSections.has(section.section_id)}
									onToggle={() => onSectionToggle(section.section_id)}
									onEnroll={onEnroll}
									isEnrolling={enrollmentLoading.has(section.section_id)}
									enrollmentFeedback={enrollmentFeedback[section.section_id]}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{isExpanded && course.sections.length === 0 && (
				<div className="px-4 pb-4 border-t border-slate-100">
					<p className="text-slate-500 font-inter text-center py-4">
						No sections available for this course.
					</p>
				</div>
			)}
		</div>
	);
}

export default Course;
