function Header({ showEnrollment = false }) {
	return (
		<header className="w-full backdrop-blur-sm bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-8 py-4">
				<div className="flex items-center space-x-4">
					<h1 className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent text-4xl font-black tracking-tight font-inter hover:animate-pulse cursor-default">
						EduQuery
					</h1>
					{showEnrollment && (
						<div className="flex items-center space-x-2">
							<span className="text-slate-400 text-2xl">•</span>
							<h2 className="text-2xl font-bold text-slate-700 font-jakarta">
								Enrollment Simulation
							</h2>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export default Header;
