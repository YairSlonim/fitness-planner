var express = require('express')
var cors = require('cors')
var app = express()
const fs = require('fs');

const pool = require("./db");

app.use(cors())
var myWorkouts = require("./myWorkouts.json")
var exercises = require("./tempExercises.json")
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    return res.json(result.rows);
  } catch (error) {
    console.error("DB connection failed:", error);
    return res.status(500).json({ success: false, message: "DB error" });
  }
});

app.post("/updateWeek", async (req, res) => {
    // Read the Workout[] payload and validate that we received an array.
    const weekData = req.body;
    if (!Array.isArray(weekData)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a Workout[]"
      });
    }

    // Use a dedicated client so all queries run inside one transaction.
    const client = await pool.connect();
    const userId = 1;

    try {
      // Start transaction to guarantee all-or-nothing update behavior.
      await client.query("BEGIN");

      // Load existing workout_days for this user and map day_of_week -> workout_day_id.
      const daysResult = await client.query(
        "SELECT id, day_of_week FROM workout_days WHERE user_id = $1",
        [userId]
      );
      const dayIdByWeekDay = new Map(daysResult.rows.map((row) => [row.day_of_week, row.id]));

      // Delete existing workout_items for this user while keeping workout_days rows unchanged.
      await client.query(
        `DELETE FROM workout_items wi
         USING workout_days wd
         WHERE wi.workout_day_id = wd.id
           AND wd.user_id = $1`,
        [userId]
      );

      // Insert every current item from the incoming Workout[] payload.
      let insertedItems = 0;
      for (const day of weekData) {
        // Support both dayOfTheWeek and day_of_week field names from the client.
        const dayOfWeek = Number(day.dayOfTheWeek ?? day.day_of_week);
        const workoutDayId = dayIdByWeekDay.get(dayOfWeek);

        // Skip unknown days so we only insert items that map to existing workout_days.
        if (!workoutDayId) continue;

        // Support both arrayOfItems and items field names from the client.
        const items = Array.isArray(day.arrayOfItems) ? day.arrayOfItems : (Array.isArray(day.items) ? day.items : []);
        for (const item of items) {
          // Insert one workout item row linked to the existing workout_day.
          await client.query(
            `INSERT INTO workout_items (workout_day_id, exercise_id, sets, reps)
             VALUES ($1, $2, $3, $4)`,
            [workoutDayId, item.exercise_id, item.sets, item.reps]
          );
          insertedItems += 1;
        }
      }
      // Commit after all deletes/inserts succeed.
      await client.query("COMMIT");
      return res.status(200).json({
        success: true,
        message: "Week updated successfully",
        insertedItems
      });
    } catch (error) {
      // Roll back transaction on any failure to keep database consistent.
      await client.query("ROLLBACK");
      console.error("Failed to update week:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    } finally {
      // Always release the client back to the pool.
      client.release();
    }
});

// app.get("/getWeek",async (req, res) => {

//     var weekWorkouts ;
//     const data = myWorkouts
//   if (data) {
//         const ronen = data.map(day =>{
//             const moshe = day.arrayOfItems.map(exe =>{
//                 const newPart = getTheRightExercise(exe.exercise_id)
//                 return {...exe, ...newPart}
//             })
//             return {
//                 ...day, arrayOfItems: moshe
//             }
//         })
//       res.send(ronen);
//   }
//   weekWorkouts =  Array.from({ length: 7 }, (_, index) => ({
//     dayOfTheWeek: index + 1,
//     arrayOfItems: []
//   }))
// });

app.get("/user-workout/:id", async (req, res) =>{
  const user_id = Number(req.params.id);
  console.log(user_id);
  if (!user_id || Number.isNaN(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing user id"
      });
    }
    try{
      const response = await pool.query(`select wd.day_of_week, wi.id as item_id, wi.sets, wi.reps, e.name, e.muscle_group, e.img, e.id as exercise_id 
        from workout_items wi
        join exercises e on wi.exercise_id = e.id
        join workout_days wd on wd.id = wi.workout_day_id 
        where wd.user_id = $1`,[user_id]);

        return res.json(response.rows);
    }catch (error) {
    console.error("failed to load user workout:", error);
    return res.status(500).json({ success: false, message: "Server error"});
  }
})

app.get("/exercises", async (req, res) =>{
  const response = await pool.query("SELECT * FROM exercises")
  res.send(response.rows)
})
app.listen(PORT,() => {`Server is running on port ${PORT}`})

function getTheRightExercise(exerciseId){
    const correctExercise = exercises.find(exe => exe.id === exerciseId)
    return correctExercise;
}

