import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import DocumentsPage from "./pages/documents/DocumentsPage"
import FlashcardsPage from "./pages/flashcards/FlashcardsPage"
import QuizzesPage from "./pages/quizzes/QuizzesPage"
import ProfilePage from "./pages/profile/ProfilePage"
import AppLayout from "./layout/AppLayout"

const App = () => {
  return (
   <Routes>
    <Route path="/" element={<Navigate to="/login" replace/>}></Route>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route element={<AppLayout/>}>
      <Route path="/dashboard" element={<DashboardPage/>}/>
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/flashcards" element={<FlashcardsPage />} />
      <Route path="/quizzes" element={<QuizzesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
   </Routes>
  )
}

export default App