function Sidebar({ activeTab, onTabChange }) {
	const tabs = [
		{ id: "catalog", label: "Course Catalog", icon: "" },
		{ id: "schedule", label: "Schedule", icon: "" },
		{ id: "enrolled", label: "Currently Enrolled Classes", icon: "" },
	];

	return (
		<aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-white/20 min-h-screen sticky top-16 z-40">
			<div className="p-6">
				<h2 className="text-lg font-bold text-slate-800 mb-6 font-jakarta">
					Navigation
				</h2>
				<nav className="space-y-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
								activeTab === tab.id
									? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
									: "text-slate-700 hover:bg-slate-100 hover:text-emerald-600"
							}`}
						>
							<span className="text-lg">{tab.icon}</span>
							<span className="font-medium">{tab.label}</span>
						</button>
					))}
				</nav>
			</div>
		</aside>
	);
}

export default Sidebar;
