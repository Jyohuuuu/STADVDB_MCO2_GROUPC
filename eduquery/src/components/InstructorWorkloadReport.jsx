import { useState, useEffect } from "react";

function InstructorWorkloadReport({ API_URL }) {
	const [instructorData, setInstructorData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedInstructors, setSelectedInstructors] = useState(new Set());
	const [showAllInstructors, setShowAllInstructors] = useState(false);

	useEffect(() => {
		fetchInstructorWorkload();
	}, []);

	const fetchInstructorWorkload = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch(
				`${API_URL}/api/reports/instructor_workload`
			);
			const data = await response.json();
			if (data.success) {
				setInstructorData(data.data);
			} else {
				setError("Failed to fetch instructor workload data");
			}
		} catch (err) {
			setError("Error connecting to server");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600 mb-4">{error}</p>
				<button
					onClick={fetchInstructorWorkload}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
				>
					Retry
				</button>
			</div>
		);
	}

	const filteredInstructors = instructorData.filter((instructor) => {
		const matchesSearch =
			instructor.instructor_name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			instructor.department_name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());
		const matchesSelection =
			selectedInstructors.size === 0 ||
			selectedInstructors.has(instructor.instructor_id);
		return matchesSearch && matchesSelection;
	});
	const sortedInstructors = [...filteredInstructors].sort((a, b) => {
		const aWorkload = (a.total_sections || 0) + (a.total_students || 0);
		const bWorkload = (b.total_sections || 0) + (b.total_students || 0);
		return bWorkload - aWorkload;
	});

	const maxWorkload =
		sortedInstructors.length > 0
			? Math.max(
					...sortedInstructors.map(
						(i) => (i.total_sections || 0) + (i.total_students || 0)
					)
			  )
			: 1;
	const maxSections =
		sortedInstructors.length > 0
			? Math.max(...sortedInstructors.map((i) => i.total_sections || 0))
			: 1;
	const maxStudents =
		sortedInstructors.length > 0
			? Math.max(...sortedInstructors.map((i) => i.total_students || 0))
			: 1;

	const handleInstructorToggle = (instructorId) => {
		setSelectedInstructors((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(instructorId)) {
				newSet.delete(instructorId);
			} else {
				newSet.add(instructorId);
			}
			return newSet;
		});
	};

	const clearAllFilters = () => {
		setSelectedInstructors(new Set());
		setSearchTerm("");
	};

	return (
		<div className="space-y-6">
			{/* Search and Filter Controls */}
			<div className="bg-slate-50 rounded-lg p-4 border space-y-4">
				<div className="flex flex-col sm:flex-row gap-4 items-center">
					<div className="flex-1">
						<input
							type="text"
							placeholder="Search instructors or departments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => setShowAllInstructors(!showAllInstructors)}
							className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
						>
							{showAllInstructors ? "Hide" : "Show"} All (
							{instructorData.length})
						</button>
						{(selectedInstructors.size > 0 || searchTerm) && (
							<button
								onClick={clearAllFilters}
								className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
							>
								Clear Filters
							</button>
						)}
					</div>
				</div>

				{/* Instructor Selection Grid */}
				{showAllInstructors && (
					<div className="border-t pt-4">
						<h5 className="text-sm font-semibold text-slate-700 mb-3">
							Select Instructors:
						</h5>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
							{instructorData.map((instructor) => (
								<label
									key={instructor.instructor_id}
									className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
								>
									<input
										type="checkbox"
										checked={selectedInstructors.has(instructor.instructor_id)}
										onChange={() =>
											handleInstructorToggle(instructor.instructor_id)
										}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-slate-700 truncate">
											{instructor.instructor_name || "Unknown"}
										</div>
										<div className="text-xs text-slate-500 truncate">
											{instructor.department_name || "Unknown Department"}
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				)}

				{/* Selected Instructors Display */}
				{selectedInstructors.size > 0 && (
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-2">
							<h5 className="text-sm font-semibold text-slate-700">
								Selected Instructors ({selectedInstructors.size}):
							</h5>
						</div>
						<div className="flex flex-wrap gap-2">
							{Array.from(selectedInstructors).map((instructorId) => {
								const instructor = instructorData.find(
									(i) => i.instructor_id === instructorId
								);
								return instructor ? (
									<span
										key={instructorId}
										className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
									>
										{instructor.instructor_name || "Unknown"}
										<button
											onClick={() => handleInstructorToggle(instructorId)}
											className="ml-1 text-blue-600 hover:text-blue-800"
										>
											×
										</button>
									</span>
								) : null;
							})}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{filteredInstructors.length} / {instructorData.length}
					</div>
					<div className="text-teal-100">
						{selectedInstructors.size > 0 || searchTerm
							? "Filtered / Total"
							: "Total"}{" "}
						Instructors
					</div>
				</div>
				<div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{filteredInstructors.length > 0
							? Math.round(
									(filteredInstructors.reduce(
										(sum, i) => sum + (i.total_sections || 0),
										0
									) /
										filteredInstructors.length) *
										10
							  ) / 10
							: 0}
					</div>
					<div className="text-cyan-100">Avg Sections/Instructor</div>
				</div>
				<div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{filteredInstructors.length > 0
							? Math.round(
									(filteredInstructors.reduce(
										(sum, i) => sum + (i.total_students || 0),
										0
									) /
										filteredInstructors.length) *
										10
							  ) / 10
							: 0}
					</div>
					<div className="text-emerald-100">Avg Students/Instructor</div>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-sm border">
				<h4 className="text-lg font-semibold text-slate-800 mb-6">
					Instructor Workload Horizontal Bar Chart
				</h4>

				{/* Legend */}
				<div className="flex items-center justify-center mb-6 space-x-6">
					<div className="flex items-center space-x-2">
						<div className="w-4 h-4 bg-blue-500 rounded"></div>
						<span className="text-sm text-slate-600">Sections</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-4 h-4 bg-green-500 rounded"></div>
						<span className="text-sm text-slate-600">Students</span>
					</div>
				</div>

				{/* Horizontal Bar Chart */}
				<div className="space-y-4">
					{sortedInstructors.map((instructor, index) => {
						const totalSections = instructor.total_sections || 0;
						const totalStudents = instructor.total_students || 0;
						const totalWorkload = totalSections + totalStudents;
						const sectionPercentage =
							maxWorkload > 0 ? (totalSections / maxWorkload) * 100 : 0;
						const studentPercentage =
							maxWorkload > 0 ? (totalStudents / maxWorkload) * 100 : 0;

						return (
							<div key={index} className="space-y-2">
								{/* Instructor name and department */}
								<div className="flex justify-between items-center">
									<div className="min-w-0 flex-1">
										<div className="font-medium text-slate-800 truncate">
											{instructor.instructor_name || "Unknown Instructor"}
										</div>
										<div className="text-sm text-slate-500">
											{instructor.department_name || "Unknown Department"}
										</div>
									</div>
									<div className="text-right text-sm text-slate-600 ml-4">
										<div className="font-medium">Total: {totalWorkload}</div>
										<div>
											{totalSections}S + {totalStudents}St
										</div>
									</div>
								</div>

								{/* Stacked horizontal bar */}
								<div className="flex items-center space-x-2">
									<div className="w-32 text-right">{/* Y-axis */}</div>
									<div className="flex-1 relative">
										<div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
											<div
												className="absolute top-0 left-0 h-6 bg-blue-500 rounded-full transition-all duration-500"
												style={{
													width: `${sectionPercentage}%`,
												}}
											></div>
											<div
												className="absolute top-0 bg-green-500 h-6 rounded-r-full transition-all duration-500"
												style={{
													left: `${sectionPercentage}%`,
													width: `${studentPercentage}%`,
												}}
											></div>
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="text-xs font-medium text-white drop-shadow">
													{instructor.total_sections}S |{" "}
													{instructor.total_students}St
												</span>
											</div>
										</div>
										<div className="flex justify-between text-xs text-slate-400 mt-1">
											<span>0</span>
											<span>{Math.round(maxWorkload / 4)}</span>
											<span>{Math.round(maxWorkload / 2)}</span>
											<span>{Math.round((3 * maxWorkload) / 4)}</span>
											<span>{maxWorkload}</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
					{sortedInstructors.length === 0 && (
						<div className="text-center py-8 text-slate-500">
							<p>No instructors found matching your search criteria.</p>
							{(selectedInstructors.size > 0 || searchTerm) && (
								<button
									onClick={clearAllFilters}
									className="mt-2 text-blue-600 hover:text-blue-800 underline"
								>
									Clear filters to see all instructors
								</button>
							)}
						</div>
					)}
				</div>

				{/* X-axis */}
				<div className="text-center mt-6 text-sm font-medium text-slate-600">
					Workload Metric (Sections + Students)
				</div>
			</div>
		</div>
	);
}

export default InstructorWorkloadReport;
