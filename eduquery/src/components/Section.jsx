function Section({
	section,
	isExpanded,
	onToggle,
	onEnroll,
	isEnrolling,
	enrollmentFeedback,
}) {
	const isFullyBooked = section.remaining_slots === 0;

	return (
		<div className="bg-white rounded-md border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200">
			{/* Section Header - Clickable */}
			<button
				onClick={onToggle}
				className="w-full p-3 text-left hover:bg-slate-50 transition-colors duration-200"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<span className="font-medium text-slate-800">
							Section {section.section_code}
						</span>
						<span
							className={`text-xs px-2 py-1 rounded-full ${
								isFullyBooked
									? "bg-red-100 text-red-700"
									: section.remaining_slots < 5
									? "bg-yellow-100 text-yellow-700"
									: "bg-emerald-100 text-emerald-700"
							}`}
						>
							{isFullyBooked ? "Full" : `${section.remaining_slots} left`}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						{section.instructor_name && (
							<span className="text-sm text-slate-600">
								{section.instructor_name}
							</span>
						)}
						<svg
							className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
								isExpanded ? "rotate-180" : ""
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
					</div>
				</div>
			</button>

			{/* Expanded Section Details */}
			{isExpanded && (
				<div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
					<div className="pt-3 space-y-4">
						{/* Professor Info */}
						<div>
							<h7 className="text-sm font-semibold text-slate-700 mb-1 font-jakarta block">
								Instructor
							</h7>
							<p className="text-slate-600">
								{section.instructor_name || "TBA"}
							</p>
						</div>

						{/* Time Slots */}
						<div>
							<h7 className="text-sm font-semibold text-slate-700 mb-1 font-jakarta block">
								Schedule
							</h7>
							<p className="text-slate-600">
								Schedule information will be available soon.
							</p>
						</div>

						{/* Description */}
						<div>
							<h7 className="text-sm font-semibold text-slate-700 mb-1 font-jakarta block">
								Description
							</h7>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-600">Capacity:</span>
									<span className="font-medium">
										{section.capacity} students
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-600">Available Slots:</span>
									<span
										className={`font-medium ${
											isFullyBooked
												? "text-red-600"
												: section.remaining_slots < 5
												? "text-yellow-600"
												: "text-emerald-600"
										}`}
									>
										{section.remaining_slots}{" "}
										{section.remaining_slots === 1 ? "slot" : "slots"}
									</span>
								</div>
								<p className="text-slate-600 text-sm">
									{section.instructor_name &&
										`Taught by ${section.instructor_name}.`}
									This section provides comprehensive course instruction with
									personalized learning opportunities.
								</p>
							</div>
						</div>

						{/* Enroll Button */}
						<div className="pt-2 border-t border-slate-100">
							<div className="flex items-center justify-between">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onEnroll(section.section_id);
									}}
									disabled={isEnrolling || isFullyBooked}
									className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-jakarta disabled:cursor-not-allowed ${
										isFullyBooked
											? "bg-gray-400 text-gray-600 cursor-not-allowed"
											: "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white"
									}`}
								>
									{isEnrolling ? (
										<span className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Enrolling...
										</span>
									) : isFullyBooked ? (
										"Section Full"
									) : (
										"Enroll in Section"
									)}
								</button>

								{/* Enrollment Feedback */}
								{enrollmentFeedback && (
									<div
										className={`text-sm font-medium ${
											enrollmentFeedback.type === "success"
												? "text-emerald-600"
												: "text-red-600"
										}`}
									>
										{enrollmentFeedback.message}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Section;
