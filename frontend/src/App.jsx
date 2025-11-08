// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Modern Components
import ModernLandingPage from './components/pages/ModernLandingPage';
import ModernDashboard from './components/pages/ModernDashboard';
import ModernNavbar from './components/layout/ModernNavbar';

// Existing Components (update these dengan modern theme)
import CoursesPage from './components/pages/CoursesPage';
import TasksPage from './components/pages/TasksPage';
import GradesPage from './components/pages/GradesPage';
import FinancePage from './components/pages/FinancePage';
import ExamsPage from './components/pages/ExamsPage';
import HabitsPage from './components/pages/HabitsPage';
import EventsPage from './components/pages/EventsPage';

// Widgets
import PomodoroTimer from './components/widgets/PomodoroTimer';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page - New Modern Design */}
                <Route path="/" element={<ModernLandingPage />} />

                {/* Dashboard - New Modern Design */}
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <ModernNavbar />
                            <ModernDashboard />
                            <PomodoroTimer />
                        </>
                    }
                />

                {/* Other Pages - Will update these next */}
                <Route
                    path="/courses"
                    element={
                        <>
                            <ModernNavbar />
                            <CoursesPage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <>
                            <ModernNavbar />
                            <TasksPage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <>
                            <ModernNavbar />
                            <EventsPage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/exams"
                    element={
                        <>
                            <ModernNavbar />
                            <ExamsPage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/grades"
                    element={
                        <>
                            <ModernNavbar />
                            <GradesPage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/finance"
                    element={
                        <>
                            <ModernNavbar />
                            <FinancePage />
                            <PomodoroTimer />
                        </>
                    }
                />
                <Route
                    path="/habits"
                    element={
                        <>
                            <ModernNavbar />
                            <HabitsPage />
                            <PomodoroTimer />
                        </>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
