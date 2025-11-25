import { useState, useEffect } from "react";

function StudentLoadReport({ API_URL }) {
	const [studentData, setStudentData] = useState([]);
	const [studentMetrics, setStudentMetrics] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchStudentLoadDistribution();
	}, []);

	const fetchStudentLoadDistribution = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch(
				`${API_URL}/api/reports/student_load_distribution`
			);
			const data = await response.json();
			if (data.success) {
				setStudentData(data.data);
				setStudentMetrics(data.metrics || {});
			} else {
				setError("Failed to fetch student load data");
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
					onClick={fetchStudentLoadDistribution}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
				>
					Retry
				</button>
			</div>
		);
	}

	const creditDistribution = studentMetrics.distribution_percent || {};
	const sortedCredits = Object.keys(creditDistribution).sort(
		(a, b) => Number(a) - Number(b)
	);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">{studentData.length}</div>
					<div className="text-indigo-100">Total Students</div>
				</div>
				<div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{Math.round(studentMetrics.average_credits * 10) / 10}
					</div>
					<div className="text-orange-100">Avg Credits</div>
				</div>
				<div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
					<div className="text-2xl font-bold">
						{studentMetrics.under_loaded_count}
					</div>
					<div className="text-red-100">Under-loaded (&lt;12)</div>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-sm border">
				<h4 className="text-lg font-semibold text-slate-800 mb-4">
					Credit Load Distribution
				</h4>
				<div className="space-y-3">
					{sortedCredits.map((credits) => {
						const percentage = creditDistribution[credits];
						const studentCount = Math.round(
							(studentData.length * percentage) / 100
						);
						return (
							<div key={credits} className="flex items-center space-x-4">
								<div className="w-16 text-sm font-medium text-slate-600">
									{credits} credits
								</div>
								<div className="flex-1">
									<div className="w-full bg-gray-200 rounded-full h-4">
										<div
											className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-300"
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
								<div className="text-sm text-slate-600 min-w-[4rem]">
									{studentCount} ({percentage}%)
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default StudentLoadReport;
