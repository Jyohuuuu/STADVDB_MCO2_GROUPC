function Welcome() {
	return (
		<div className="text-center mb-16">
			<h2 className="text-4xl font-bold text-slate-800 mb-6 font-jakarta leading-tight">
				Welcome to{" "}
				<span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text animate-pulse">
					EduQuery
				</span>
			</h2>
			<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-inter">
				Your comprehensive university information system
			</p>
		</div>
	);
}

export default Welcome;
