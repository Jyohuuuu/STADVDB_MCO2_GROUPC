import { useState, useEffect } from "react";

function SectionUtilizationReport({ API_URL }) {
	const [sectionData, setSectionData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedDepartments, setSelectedDepartments] = useState(new Set());
	const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

	useEffect(() => {
		fetchSectionUtilization();
	}, []);

	const fetchSectionUtilization = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch(
				`${API_URL}/api/reports/section_utilization`
			);
			const data = await response.json();
			if (data.success) {
				setSectionData(data.data);
			} else {
				setError("Failed to fetch section utilization data");
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
					onClick={fetchSectionUtilization}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
				>
					Retry
				</button>
			</div>
		);
	}

	const departments = [
		...new Set(
			sectionData.map((s) => s.department_name || "Unknown").filter(Boolean)
		),
	];

	const filteredSections =
		selectedDepartments.size > 0
			? sectionData.filter((s) =>
					selectedDepartments.has(s.department_name || "Unknown")
			  )
			: sectionData;

	const maxCapacity = Math.max(...filteredSections.map((s) => s.capacity));

	const handleDepartmentToggle = (department) => {
		setSelectedDepartments((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(department)) {
				newSet.delete(department);
			} else {
				newSet.add(department);
			}
			return newSet;
		});
	};

	const clearDepartmentFilters = () => {
		setSelectedDepartments(new Set());
	};

	return (
		<div className="space-y-6">
			{/* Department Filters */}
			<div className="bg-slate-50 rounded-lg p-4 border">
				<div className="flex items-center justify-between mb-3">
					<h4 className="text-sm font-semibold text-slate-700">
						Filter by Department
					</h4>
					<div className="flex items-center space-x-2">
						{selectedDepartments.size > 0 && (
							<button
								onClick={clearDepartmentFilters}
								className="text-xs text-slate-500 hover:text-slate-700 underline"
							>
								Clear All ({selectedDepartments.size})
							</button>
						)}
						<div className="relative">
							<button
								onClick={() =>
									setShowDepartmentDropdown(!showDepartmentDropdown)
								}
								className="bg-white border border-gray-300 rounded-md px-3 py-1 text-xs font-medium text-slate-700 hover:bg-gray-50 flex items-center space-x-2"
							>
								<span>Select Departments</span>
								<svg
									className={`w-4 h-4 transition-transform ${
										showDepartmentDropdown ? "rotate-180" : ""
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
							</button>
							{showDepartmentDropdown && (
								<div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px]">
									<div className="py-1 max-h-60 overflow-y-auto">
										{departments.map((department) => (
											<label
												key={department}
												className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={selectedDepartments.has(department)}
													onChange={() => handleDepartmentToggle(department)}
													className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-slate-700">
													{department}
												</span>
											</label>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				{selectedDepartments.size > 0 && (
					<div className="flex flex-wrap gap-2">
						{Array.from(selectedDepartments).map((department) => (
							<span
								key={department}
								className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
							>
								{department}
								<button
									onClick={() => handleDepartmentToggle(department)}
									className="ml-1 text-blue-600 hover:text-blue-800"
								>
									×
								</button>
							</span>
						))}
					</div>
				)}
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">{filteredSections.length}</div>
					<div className="text-blue-100">
						{selectedDepartments.size > 0 ? "Filtered" : "Total"} Sections
					</div>
				</div>
				<div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{filteredSections.length > 0
							? Math.round(
									(filteredSections.filter((s) => s.enrolled_count > 0).length /
										filteredSections.length) *
										100
							  )
							: 0}
						%
					</div>
					<div className="text-green-100">Sections with Enrollment</div>
				</div>
				<div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{filteredSections.length > 0
							? Math.round(
									(filteredSections.reduce(
										(sum, s) => sum + s.enrolled_count / s.capacity,
										0
									) /
										filteredSections.length) *
										100
							  )
							: 0}
						%
					</div>
					<div className="text-purple-100">Avg Utilization</div>
				</div>
			</div>

			{/* Section List */}
			<div className="space-y-4">
				{filteredSections.length === 0 ? (
					<div className="text-center py-8 text-slate-500">
						<p>No sections found for the selected departments.</p>
					</div>
				) : (
					filteredSections.map((section, index) => {
						const utilization =
							(section.enrolled_count / section.capacity) * 100;
						const isOverCapacity = section.enrolled_count > section.capacity;
						return (
							<div
								key={index}
								className="bg-white p-4 rounded-lg shadow-sm border"
							>
								<div className="flex justify-between items-center mb-2">
									<div>
										<span className="font-semibold text-slate-800">
											{section.course_code} - {section.section_code}
										</span>
										<div className="text-sm text-slate-600">
											{section.course_title}
										</div>
									</div>
									<div className="text-right">
										<div
											className={`font-bold ${
												isOverCapacity ? "text-red-600" : "text-slate-800"
											}`}
										>
											{section.enrolled_count}/{section.capacity}
										</div>
										<div className="text-sm text-slate-600">
											{Math.round(utilization)}% full
										</div>
									</div>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className={`h-3 rounded-full transition-all duration-300 ${
											utilization > 100
												? "bg-red-500"
												: utilization > 80
												? "bg-yellow-500"
												: "bg-green-500"
										}`}
										style={{ width: `${Math.min(utilization, 100)}%` }}
									></div>
								</div>
								<div className="text-sm text-slate-600 mt-1">
									{section.department_name || "Unknown Department"}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default SectionUtilizationReport;
