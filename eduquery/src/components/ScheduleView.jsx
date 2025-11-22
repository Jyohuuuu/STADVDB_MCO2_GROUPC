import { useMemo } from "react";

const ScheduleView = ({ scheduleData }) => {
	console.log("ScheduleView - scheduleData:", scheduleData);

	// Add detailed logging for debugging
	if (scheduleData && scheduleData.length > 0) {
		console.log("First course structure:", scheduleData[0]);
		scheduleData.forEach((course, index) => {
			console.log(`Course ${index}:`, {
				course_code: course.course_code,
				meetings: course.meetings,
			});
		});
	}

	// Generate time slots from 7:00 AM to 10:00 PM (15-minute increments)
	const timeSlots = useMemo(() => {
		const slots = [];
		for (let hour = 7; hour < 22; hour++) {
			for (let minute = 0; minute < 60; minute += 15) {
				const time24 = `${hour.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")}`;
				slots.push({
					value: time24,
					display: formatTimeForDisplay(time24),
				});
			}
		}
		return slots;
	}, []);

	// Convert 24-hour format to display format
	function formatTimeForDisplay(time24) {
		const [hours, minutes] = time24.split(":").map(Number);
		const period = hours >= 12 ? "PM" : "AM";
		const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
		return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
	}

	// Convert time string to minutes for comparison
	function timeToMinutes(timeStr) {
		const [hours, minutes] = timeStr.split(":").map(Number);
		return hours * 60 + minutes;
	}

	// Get courses for a specific time slot and day
	function getCoursesForTimeSlot(timeSlot, day) {
		if (!scheduleData) return [];

		return scheduleData.filter((course) => {
			const meetings = course.meetings;
			if (!meetings || !Array.isArray(meetings)) return false;

			return meetings.some((meeting) => {
				if (meeting.day_of_week !== day) return false;

				const startTime = meeting.start_time.substring(0, 5);
				const endTime = meeting.end_time.substring(0, 5);
				const startMinutes = timeToMinutes(startTime);
				const endMinutes = timeToMinutes(endTime);
				const slotMinutes = timeToMinutes(timeSlot);

				return slotMinutes >= startMinutes && slotMinutes < endMinutes;
			});
		});
	}

	// Get course block information (start time, end time, duration)
	function getCourseBlockInfo(course, day) {
		const meetings = course.meetings;
		if (!meetings || !Array.isArray(meetings)) return null;

		const meeting = meetings.find((m) => m.day_of_week === day);
		if (!meeting) return null;

		const startTime = meeting.start_time.substring(0, 5);
		const endTime = meeting.end_time.substring(0, 5);
		const startMinutes = timeToMinutes(startTime);
		const endMinutes = timeToMinutes(endTime);
		const duration = endMinutes - startMinutes;

		return {
			startTime,
			endTime,
			duration,
			meeting,
		};
	}

	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	if (!scheduleData) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-gray-500">Loading schedule...</div>
			</div>
		);
	}

	if (scheduleData.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-gray-500">
					No enrolled courses to display in schedule.
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-800">Weekly Schedule</h2>
				{scheduleData && scheduleData.length > 0 && (
					<div className="text-sm text-gray-600">
						{scheduleData.length} course{scheduleData.length !== 1 ? "s" : ""}{" "}
						enrolled
					</div>
				)}
			</div>

			<div className="overflow-x-auto">
				{/* Schedule Grid with proper alignment */}
				<div className="flex min-w-[900px] border border-gray-200 rounded-lg">
					{/* Time column */}
					<div className="flex flex-col w-20 flex-shrink-0 border-r border-gray-200">
						{/* Time header */}
						<div className="h-12 font-semibold text-gray-700 text-sm p-2 flex items-center justify-center bg-gray-50 border-b border-gray-200">
							Time
						</div>

						{/* Time slots */}
						{timeSlots.map((timeSlot, timeIndex) => (
							<div
								key={timeSlot.value}
								className="h-12 text-xs text-gray-500 p-2 border-b border-gray-100 flex items-center justify-center"
								style={{ minHeight: "48px" }}
							>
								{timeIndex % 4 === 0 ? timeSlot.display : ""}
							</div>
						))}
					</div>

					{/* Days grid */}
					<div className="flex-1">
						{/* Day headers */}
						<div className="grid grid-cols-6 h-12 border-b border-gray-200">
							{days.map((day) => (
								<div
									key={day}
									className="font-semibold text-gray-700 text-sm p-2 text-center bg-gray-50 flex items-center justify-center border-r border-gray-200 last:border-r-0"
								>
									{day}
								</div>
							))}
						</div>

						{/* Time slots for each day */}
						<div className="grid grid-cols-6">
							{days.map((day) => (
								<div
									key={day}
									className="border-r border-gray-200 last:border-r-0"
								>
									{timeSlots.map((timeSlot, timeIndex) => {
										const coursesInSlot = getCoursesForTimeSlot(
											timeSlot.value,
											day
										);

										return (
											<div
												key={`${day}-${timeSlot.value}`}
												className="relative h-12 border-b border-gray-100 p-1"
												style={{ minHeight: "48px" }}
											>
												{/* Debug: Log courses in slot */}
												{coursesInSlot.length > 0 &&
													console.log(
														`Found ${coursesInSlot.length} course(s) for ${day} at ${timeSlot.value}:`,
														coursesInSlot
													)}

												{/* Course blocks */}
												{coursesInSlot.map((course, idx) => {
													const blockInfo = getCourseBlockInfo(course, day);
													if (!blockInfo) return null;

													// Only render course block at its start time
													const courseStartMinutes = timeToMinutes(
														blockInfo.startTime
													);
													const slotMinutes = timeToMinutes(timeSlot.value);

													if (courseStartMinutes !== slotMinutes) return null;

													// Calculate height based on duration
													// Each 15-min slot = 48px, so 1 hour = 4 slots = 192px
													const heightInPixels = Math.max(
														48,
														(blockInfo.duration / 60) * 192
													);

													return (
														<div
															key={`${course.section_id}-${idx}`}
															className="absolute inset-x-1 top-0 bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-1 rounded shadow-md border border-emerald-500 z-10 overflow-hidden"
															style={{
																height: `${heightInPixels}px`,
																zIndex: 10,
															}}
														>
															<div className="text-xs font-bold truncate leading-tight">
																{course.course_code}
															</div>
															<div className="text-xs opacity-90 truncate leading-tight">
																{course.course_title}
															</div>
															<div className="text-xs opacity-80 leading-tight">
																{blockInfo.startTime}-{blockInfo.endTime}
															</div>
															{course.instructor_name && (
																<div className="text-xs opacity-70 truncate leading-tight">
																	{course.instructor_name}
																</div>
															)}
														</div>
													);
												})}
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Course Legend */}
				{scheduleData && scheduleData.length > 0 && (
					<div className="mt-6">
						<h3 className="text-lg font-bold text-gray-800 mb-3">
							Course Legend
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
							{scheduleData.map((course) => (
								<div
									key={course.section_id}
									className="flex items-center gap-2 p-2 bg-gray-50 rounded"
								>
									<div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded"></div>
									<div className="text-sm">
										<span className="font-medium">{course.course_code}</span> -{" "}
										{course.course_title}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ScheduleView;
