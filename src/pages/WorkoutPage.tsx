import { useState } from "react";
import "../css/WorkoutPage.css";
import exercises from "../tempExercises.json";
import ExerciseCard from "../components/ExerciseCard";
import type { Exercise, workout, WorkoutItem } from "../types";
import DayWorkout from "../components/DayWorkout";
//import Navbar from "../components/Navbar";

function WorkoutPage() {

const initialWeek: workout[] = Array.from({length:7}, (_, index) =>({
  dayOfTheWeek: index + 1,
  arrayOfItems: []
}))

  const [weekWorkouts, setWeekWorkouts] = useState<workout[]>(initialWeek);
  //const [workout, setWorkout] = useState<WorkoutItem[]>([]);
  const [dragItemId, setDragItemId] = useState<number | null>(null);
  const [chooseDay, setChooseDay] = useState<number>(1)

  function handleNewExercise(exercise: Exercise) {
    setWeekWorkouts((prev) =>(
      prev.map((dayWorkOut) =>{
        if(dayWorkOut.dayOfTheWeek !== chooseDay){
          return dayWorkOut;
        }
        const uniqId = dayWorkOut.arrayOfItems.length === 0 ? 1 : Math.max(...dayWorkOut.arrayOfItems.map((item) => item.item_id)) + 1;
        const item: WorkoutItem = {
        ...exercise,
        item_id: uniqId,
        sets: 0,
        reps: 0,
      };
      return { ...dayWorkOut, arrayOfItems: [...dayWorkOut.arrayOfItems,item]} 
      })
    ))
  }

  function handleDeleteFromPersonalList(id: number) {
    setWeekWorkouts((prev) =>
    prev.map((dayWorkOut) =>{
      if(dayWorkOut.dayOfTheWeek !== chooseDay){
          return dayWorkOut;
        }
        console.log(dayWorkOut.arrayOfItems)
        console.log(id)
        return {...dayWorkOut, arrayOfItems: dayWorkOut.arrayOfItems.filter((e) => e.item_id !== id)}
    })
  )
   }

   function updateWorkoutItem( id: number, field: "sets" | "reps", value: number,) {
    setWeekWorkouts((prev) =>
      prev.map((dayWorkOut) =>{
        if(dayWorkOut.dayOfTheWeek !== chooseDay){
          return dayWorkOut;
        }
        return {
        ...dayWorkOut,
        arrayOfItems: dayWorkOut.arrayOfItems.map((item) =>
          item.item_id === id ? { ...item, [field]: value } : item
        ),
      };
    })
  )
}

  function handleDrop(dropItemId: number) {

    if (dragItemId == null) return;
    if (dragItemId === dropItemId) return;

       setWeekWorkouts((prev) =>
       prev.map((workout) =>{
        if(workout.dayOfTheWeek !== chooseDay){
          return workout
        }
        const copy = [...workout.arrayOfItems];
        const firstItemIndex = copy.findIndex(e => e.item_id === dragItemId)
        const secondItemIndex = copy.findIndex(e => e.item_id === dropItemId)
         if (firstItemIndex != -1 && secondItemIndex != -1) {
        const [itemToMove] = copy.splice(firstItemIndex, 1);
        copy.splice(secondItemIndex, 0, itemToMove);
      }
      return {...workout, arrayOfItems: copy};
       })
      )
    // setWorkout((prev) => {
    //   const copy = [...prev];
    //   const firstItemIndex = copy.findIndex(e => e.item_id === dragItemId)
    //   const secondItemIndex = copy.findIndex(e => e.item_id === dropItemId)

    //   if (firstItemIndex != -1 && secondItemIndex != -1) {
    //     const [itemToMove] = copy.splice(firstItemIndex, 1);
    //     copy.splice(secondItemIndex, 0, itemToMove);
    //   }
    //   return copy;
    // });
    setDragItemId(null);
  }

  function handleDayChange(event: React.ChangeEvent<HTMLSelectElement>){
    console.log(event.target.value);
    setChooseDay(Number(event.target.value)); 
  }
  function handleDragStart(startIndex: number) {
    setDragItemId(startIndex);
  }

  const selectedWorkout = weekWorkouts.find(w => w.dayOfTheWeek === chooseDay)
  const itemsForDay = selectedWorkout
  ? selectedWorkout.arrayOfItems
  : [];
  return (
    <div className="layout">
      <div className="exercise-list">
        {exercises.map((exe) => {
          return (
            <ExerciseCard
              key={exe.id}
              exercise={exe}
              onClick={handleNewExercise}
              variant="selector"
            />
          );
        })}
      </div>
      <div className="personal-list">
        <h3>התוכנית שלי</h3>
            <select name="" value={chooseDay} onChange={handleDayChange}>
            <option value="1">ראשון</option>
            <option value="2">שני</option>
            <option value="3">שלישי</option>
            <option value="4">רביעי</option>
            <option value="5">חמישי</option>
            <option value="6">שישי</option>
            <option value="7">שבת</option>
            </select>        
        {   
        itemsForDay.map(item => {
            return (
            <DayWorkout
              key={item.item_id}
              exercise={item}
              onDelete={handleDeleteFromPersonalList}
              onIncreaseSetsOrReps={updateWorkoutItem}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ); 
        })}
      </div>
    </div>
  );
}

export default WorkoutPage;
