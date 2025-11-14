// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';

// Pages
import ModernLandingPage from './components/pages/ModernLandingPage';
import ModernDashboard from './components/pages/ModernDashboard';

// Other Pages
import CoursesPage from './components/pages/CoursesPage';
import TasksPage from './components/pages/TasksPage';
import EventsPage from './components/pages/EventsPage';
import GradesPage from './components/pages/GradesPage';
import FinancePage from './components/pages/FinancePage';
import ExamsPage from './components/pages/ExamsPage';
import HabitsPage from './components/pages/HabitsPage';

// Layout Wrapper for other pages (NOT Dashboard/Landing)
import DashboardLayout from './components/layout/DashboardLayout';

// Widgets
import PomodoroTimer from './components/widgets/PomodoroTimer';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Landing Page - NO LAYOUT (has own navbar) */}
                            <Route path="/" element={<ModernLandingPage />} />

                            {/* Dashboard - NO LAYOUT (has own navbar) */}
                            <Route
                                path="/dashboard"
                                element={
                                    <>
                                        <ModernDashboard />
                                        <PomodoroTimer />
                                    </>
                                }
                            />

                            {/* Feature Pages - WITH LAYOUT (shared navbar) */}
                            <Route element={<DashboardLayout />}>
                                <Route
                                    path="/courses"
                                    element={<CoursesPage />}
                                />
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route
                                    path="/events"
                                    element={<EventsPage />}
                                />
                                <Route path="/exams" element={<ExamsPage />} />
                                <Route
                                    path="/grades"
                                    element={<GradesPage />}
                                />
                                <Route
                                    path="/finance"
                                    element={<FinancePage />}
                                />
                                <Route
                                    path="/habits"
                                    element={<HabitsPage />}
                                />
                            </Route>

                            {/* Fallback */}
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </BrowserRouter>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
