import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import WorkoutPage from './pages/WorkoutPage'
import GeneralExercisesListPage from './pages/GeneralExercisesListPage'

function App() {
    
  return (
    <>
    <Navbar />
<Routes>
  <Route path="/" element={<WorkoutPage />} />
  <Route path="/workout" element={<WorkoutPage />} />
  <Route path="/exercises" element={<GeneralExercisesListPage />} />
</Routes>
    </>
  )
}

export default App
