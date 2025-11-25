function StudentSelector({
	students,
	selectedStudent,
	loading,
	error,
	onStudentChange,
	onEnrollmentClick,
	onAnalyticalReportsClick,
	onRetry,
	onRefresh,
}) {
	const selectedStudentData = students.find(
		(s) => s.student_id === parseInt(selectedStudent)
	);

	return (
		<div className="max-w-2xl mx-auto mb-16">
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
				<div className="text-center mb-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex-1">
							<h3 className="text-2xl font-bold text-slate-800 mb-2 font-jakarta">
								Select a Student
							</h3>
							<p className="text-slate-600 font-inter">
								Choose a student to view their information
							</p>
						</div>
						<button
							onClick={onRefresh}
							disabled={loading}
							className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
									Refreshing...
								</>
							) : (
								<>Refresh</>
							)}
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-700 text-sm font-medium">{error}</p>
						<button
							onClick={onRetry}
							className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
						>
							Try again
						</button>
					</div>
				)}

				<div className="space-y-4">
					<select
						value={selectedStudent}
						onChange={onStudentChange}
						disabled={loading}
						className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-inter text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
					>
						<option value="">
							{loading ? "Loading students..." : "Select a student..."}
						</option>
						{students.map((student) => (
							<option key={student.student_id} value={student.student_id}>
								{student.student_number} - {student.first_name}{" "}
								{student.last_name}
							</option>
						))}
					</select>

					{selectedStudent && selectedStudentData && (
						<div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
							<div className="space-y-4">
								<h4 className="font-bold text-emerald-800 font-jakarta">
									Selected Student:
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium text-emerald-700">ID:</span>{" "}
										<span className="text-emerald-900">
											{selectedStudentData.student_id}
										</span>
									</div>
									<div>
										<span className="font-medium text-emerald-700">
											Number:
										</span>{" "}
										<span className="text-emerald-900">
											{selectedStudentData.student_number}
										</span>
									</div>
									<div>
										<span className="font-medium text-emerald-700">Name:</span>{" "}
										<span className="text-emerald-900">
											{selectedStudentData.first_name}{" "}
											{selectedStudentData.last_name}
										</span>
									</div>
									<div>
										<span className="font-medium text-emerald-700">Email:</span>{" "}
										<span className="text-emerald-900">
											{selectedStudentData.email}
										</span>
									</div>
								</div>
								<div className="pt-4 border-t border-emerald-200 space-y-3">
									<button
										onClick={onEnrollmentClick}
										className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-jakarta"
									>
										Start Enrollment Simulation
									</button>
								</div>
							</div>
						</div>
					)}
					{/* Analytical Reports */}
					<div className="mt-6 pt-6 border-t border-gray-200">
						<button
							onClick={onAnalyticalReportsClick}
							className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-jakarta flex items-center justify-center gap-2"
						>
							View Analytical Reports
						</button>
					</div>

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
	);
}

export default StudentSelector;
