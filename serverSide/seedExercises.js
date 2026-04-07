const pool = require("./db");
const exercises = require("./tempExercises.json");

async function seedExercises() {
  try {
    for (const exercise of exercises) {
      await pool.query(
        `
        INSERT INTO exercises (name, muscle_group, img)
        VALUES ($1, $2, $3)
        `,
        [exercise.name, exercise.muscleGroup, exercise.image]
      );
    }

    console.log("Exercises inserted successfully");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await pool.end();
  }
}

seedExercises();