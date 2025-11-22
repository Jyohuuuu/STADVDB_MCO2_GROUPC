import Department from "./Department";

function CourseCatalog({
	catalog,
	catalogLoading,
	catalogError,
	onRefresh,
	openDepartments,
	onDepartmentToggle,
	expandedCourses,
	onCourseToggle,
	expandedSections,
	onSectionToggle,
	onEnroll,
	enrollmentLoading,
	enrollmentFeedback,
}) {
	return (
		<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-2xl font-bold text-slate-800 font-jakarta">
					Course Catalog
				</h3>
				<button
					onClick={onRefresh}
					disabled={catalogLoading}
					className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:opacity-50"
				>
					{catalogLoading ? "Loading..." : "Refresh"}
				</button>
			</div>

			{catalogError && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-700 text-sm font-medium">{catalogError}</p>
					<button
						onClick={onRefresh}
						className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
					>
						Try again
					</button>
				</div>
			)}

			{catalogLoading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
					<p className="text-slate-600 font-inter">Loading course catalog...</p>
				</div>
			) : catalog.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-4xl mb-4"></div>
					<p className="text-slate-600 font-inter">
						No courses available in the catalog.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{catalog.map((department) => (
						<Department
							key={department.dept_id}
							department={department}
							isOpen={openDepartments.has(department.dept_id)}
							onToggle={() => onDepartmentToggle(department.dept_id)}
							expandedCourses={expandedCourses}
							onCourseToggle={onCourseToggle}
							expandedSections={expandedSections}
							onSectionToggle={onSectionToggle}
							onEnroll={onEnroll}
							enrollmentLoading={enrollmentLoading}
							enrollmentFeedback={enrollmentFeedback}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default CourseCatalog;
