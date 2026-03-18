import '../css/ExerciseCard.css'
import type { ExerciseCardProps } from '../types'


export default function ExerciseCard({exercise, onClick, variant}: ExerciseCardProps){
     return (
    <div
      className={`exercise-card ${variant ?? ""} ${onClick ? "clickable" : ""}`} onClick={() => onClick?.(exercise)}>
      <img src={exercise.image} alt={exercise.name} />
      <h3>{exercise.name}</h3>
      <p>{exercise.howToPreform}</p>
    </div>
  )
}