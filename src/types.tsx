export type Exercise = {
        id:number,
        image:string,
        name:string,
        howToPreform: string
        muscleGroup: string
}

export type WorkoutItem = Exercise & {
  item_id: number
  sets: number
  reps: number
}

export type workout = {
  dayOfTheWeek: number
  arrayOfItems: WorkoutItem[]
}


export type DayWorkoutProps = {
  exercise: WorkoutItem
  onDragStart: (id: number) => void
  onDrop:  (id: number) => void
  onDelete: (itemId: number) => void
  onIncreaseSetsOrReps: (itemId: number, fieldName : "sets" | "reps", updatedNumber: number ) => void
}
 
export type ExerciseCardProps = {
  exercise: Exercise
  onClick?: (exercise: Exercise) => void
  variant?: "catalog" | "selector"
}