const classes = [
  {
    id: "c1",
    title: "CS 101 - Intro to CS",
    location: "Room 201",
    instructor: "Prof. X",
    days: [1, 3, 5], // Mon, Wed, Fri (0=Sun, 1=Mon, ..., 6=Sat)
    startTime: "09:00", // HH:mm
    endTime: "10:20", // HH:mm
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    timezone: "America/Los_Angeles",
    color: "#8b5e3c", // theme brown
    notes: "Introductory programming concepts",
  },
  {
    id: "c2",
    title: "MATH 201 - Calculus",
    location: "Math Building, Room 105",
    instructor: "Prof. Johnson",
    days: [2, 4], // Tue, Thu
    startTime: "10:30", // HH:mm
    endTime: "12:00", // HH:mm
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    timezone: "America/Los_Angeles",
    color: "#6b4423",
    notes: "Calculus II",
  },
  {
    id: "c3",
    title: "ENG 150 - Literature",
    location: "Library, Room 301",
    instructor: "Prof. Davis",
    days: [1, 3], // Mon, Wed
    startTime: "14:00", // HH:mm
    endTime: "15:30", // HH:mm
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    timezone: "America/Los_Angeles",
    color: "#a67c52",
    notes: "Classic Literature Survey",
  },
];

module.exports = classes;
