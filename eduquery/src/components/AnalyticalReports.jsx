import { useState } from "react";
import SectionUtilizationReport from "./SectionUtilizationReport";
import StudentLoadReport from "./StudentLoadReport";
import InstructorWorkloadReport from "./InstructorWorkloadReport";

function AnalyticalReports({ API_URL }) {
	const [selectedReport, setSelectedReport] = useState("section_utilization");

	const handleReportChange = (reportType) => {
		setSelectedReport(reportType);
	};

	const renderSelectedReport = () => {
		const reportComponents = {
			section_utilization: {
				component: <SectionUtilizationReport API_URL={API_URL} />,
				title: "Section Utilization",
				description:
					"View enrollment statistics and capacity utilization for all course sections",
			},
			student_load: {
				component: <StudentLoadReport API_URL={API_URL} />,
				title: "Student Load Distribution",
				description: "Analyze credit load distribution across all students",
			},
			instructor_workload: {
				component: <InstructorWorkloadReport API_URL={API_URL} />,
				title: "Instructor Workload",
				description: "Compare teaching workloads across all instructors",
			},
		};

		const config = reportComponents[selectedReport];
		return (
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
				<div className="mb-6">
					<h3 className="text-2xl font-bold text-slate-800 font-jakarta mb-2">
						{config.title}
					</h3>
					<p className="text-slate-600 font-inter">{config.description}</p>
				</div>
				{config.component}
			</div>
		);
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden"
			style={{
				backgroundImage: `
					radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
				`,
			}}
		>
			<div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
			<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100 to-emerald-100 rounded-full opacity-30 blur-3xl"></div>

			<div className="relative z-10 p-8">
				<div className="max-w-7xl mx-auto space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold text-slate-800 font-jakarta">
							Analytical Reports Dashboard
						</h1>
						<p className="text-xl text-slate-600 font-inter max-w-3xl mx-auto">
							Comprehensive insights into academic operations, student loads,
							and resource utilization
						</p>
						<div className="text-sm text-slate-600">
							Select a report type below to view detailed analytics
						</div>
					</div>

					{/* Report Selector */}
					<div className="flex justify-center">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
							<div className="flex space-x-2">
								<button
									onClick={() => handleReportChange("section_utilization")}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
										selectedReport === "section_utilization"
											? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
											: "bg-white/70 text-slate-600 hover:bg-white/90"
									}`}
								>
									Section Utilization
								</button>
								<button
									onClick={() => handleReportChange("student_load")}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
										selectedReport === "student_load"
											? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
											: "bg-white/70 text-slate-600 hover:bg-white/90"
									}`}
								>
									Student Load
								</button>
								<button
									onClick={() => handleReportChange("instructor_workload")}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
										selectedReport === "instructor_workload"
											? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
											: "bg-white/70 text-slate-600 hover:bg-white/90"
									}`}
								>
									Instructor Workload
								</button>
							</div>
						</div>
					</div>
					{renderSelectedReport()}
				</div>
			</div>
		</div>
	);
}

export default AnalyticalReports;
