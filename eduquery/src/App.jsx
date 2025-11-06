import { useState } from "react";

function App() {
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
						<div className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-white/80">
							<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
									/>
								</svg>
							</div>
							<h3 className="text-slate-800 text-2xl font-bold mb-3 group-hover:text-emerald-700 transition-colors font-jakarta">
								Student Information
							</h3>
							<p className="text-slate-600 leading-relaxed font-medium font-inter">
								Access and manage student records and enrollment data with our
								intuitive interface
							</p>
						</div>

						<div className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-white/80">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 className="text-slate-800 text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors font-jakarta">
								Course Catalog
							</h3>
							<p className="text-slate-600 leading-relaxed font-medium font-inter">
								Browse available courses and their details with advanced search
								and filtering
							</p>
						</div>

						<div className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-white/80">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<h3 className="text-slate-800 text-2xl font-bold mb-3 group-hover:text-purple-700 transition-colors font-jakarta">
								Department Directory
							</h3>
							<p className="text-slate-600 leading-relaxed font-medium font-inter">
								Find information about university departments and their
								specializations
							</p>
						</div>

						<div className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-white/80">
							<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mb-4 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
							<h3 className="text-slate-800 text-2xl font-bold mb-3 group-hover:text-orange-700 transition-colors font-jakarta">
								Instructor Profiles
							</h3>
							<p className="text-slate-600 leading-relaxed font-medium font-inter">
								View instructor information and contact details for better
								academic connections
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default App;
