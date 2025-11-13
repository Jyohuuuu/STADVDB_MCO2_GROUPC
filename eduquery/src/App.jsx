import { useState, useEffect } from "react";

function App() {
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
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

	const handleStudentChange = (e) => {
		setSelectedStudent(e.target.value);
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
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-slate-800 mb-6 font-jakarta leading-tight">
							Welcome to{" "}
							<span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text animate-pulse">
								EduQuery
							</span>
						</h2>
						<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-inter">
							Your comprehensive university information system designed for the
							modern academic experience ✨
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
									<p className="text-red-700 text-sm font-medium">{error}</p>
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
										{loading ? "Loading students..." : "Select a student..."}
									</option>
									{students.map((student) => (
										<option key={student.student_id} value={student.student_id}>
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
												<div className="space-y-2">
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
				</main>
			</div>
		</div>
	);
}

export default App;
