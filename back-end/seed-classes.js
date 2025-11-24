/**
 * Seed MongoDB with initial classes data
 * Run with: node seed-classes.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Class = require("./models/Class");

dotenv.config();

const seedClasses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing classes
    await Class.deleteMany({});
    console.log("🗑️  Cleared existing classes");

    // Insert sample classes
    const sampleClasses = [
      {
        title: "CS 101 - Intro to CS",
        location: "Room 201",
        instructor: "Prof. Smith",
        days: [1, 3, 5], // Mon, Wed, Fri
        startTime: "09:00",
        endTime: "10:20",
        startDate: "2025-09-01",
        endDate: "2025-12-15",
        timezone: "America/Los_Angeles",
        color: "#8b5e3c",
        notes: "Introductory programming concepts",
      },
      {
        title: "MATH 201 - Calculus",
        location: "Math Building, Room 105",
        instructor: "Prof. Johnson",
        days: [2, 4], // Tue, Thu
        startTime: "10:30",
        endTime: "12:00",
        startDate: "2025-09-01",
        endDate: "2025-12-15",
        timezone: "America/Los_Angeles",
        color: "#6b4423",
        notes: "Calculus II",
      },
      {
        title: "ENG 150 - Literature",
        location: "Library, Room 301",
        instructor: "Prof. Davis",
        days: [1, 3], // Mon, Wed
        startTime: "14:00",
        endTime: "15:30",
        startDate: "2025-09-01",
        endDate: "2025-12-15",
        timezone: "America/Los_Angeles",
        color: "#a67c52",
        notes: "Classic Literature Survey",
      },
    ];

    const created = await Class.insertMany(sampleClasses);
    console.log(`✅ Created ${created.length} classes:`);
    created.forEach((cls) => {
      console.log(`  - ${cls.title} (ID: ${cls._id})`);
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding classes:", error.message);
    process.exit(1);
  }
};

seedClasses();
