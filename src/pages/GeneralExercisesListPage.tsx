import exercises from "../tempExercises.json";
import "../css/GeneralExercisesListPage.css";
import ExerciseCard from "../components/ExerciseCard";

export default function GeneralExercisesListPage() {

    const muscleGroups = ["legs", "chest", "back", "shoulders", "triceps", "biceps"];
    return (
        <div>
            <h1>General Exercises</h1>
            <div className="general-page">
                {muscleGroups.map(muscle => {
                    const exercisesPerMuscle = exercises.filter(e => e.muscleGroup === muscle)
                    if(exercisesPerMuscle.length === 0) return null;
                    return (
                        <section key={muscle} className="muscle-section">
                            <h3 className="muscle-title">{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</h3>
                            <div className="cardsGrid">
                                {exercisesPerMuscle.map(exe => (
                                    <ExerciseCard
                                        key={exe.id}
                                        exercise={exe}
                                        variant="catalog"
                                    />
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}
