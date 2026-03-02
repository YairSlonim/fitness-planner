import '../App.css'
import type { DayWorkoutProps } from '../types'

export default function DayWorkout({exercise, onDragStart, onDrop, onDelete, onIncreaseSetsOrReps}: DayWorkoutProps) {
    return (
    <div className="workout-item"
        draggable 
        onDragStart={() => onDragStart(exercise.item_id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(exercise.item_id)}>
        
        <img src={exercise.image} alt={exercise.name} />
        <h3>{exercise.name}</h3>
        <p>{exercise.howToPreform}</p>
        <button onClick={() => { onDelete(exercise.item_id) }}>מחיקת תרגיל מהרשימה</button>
        <div>
            כמות סטים{" "}
            <input
                type="number"
                name={`sets-${exercise.item_id}`}
                min={0}
                value={exercise.sets}
                onChange={(e) =>
                    onIncreaseSetsOrReps(exercise.item_id, "sets", Number(e.target.value))
                }
            />
        </div>

        <div>
            כמות חזרות{" "}
            <input
                type="number"
                name={`reps-${exercise.item_id}`}
                min={0}
                value={exercise.reps}
                onChange={(e) =>
                    onIncreaseSetsOrReps(exercise.item_id, "reps", Number(e.target.value))
                }
            />
        </div>
    </div>
    )
}

