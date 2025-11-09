// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CoursesPage, EventsPage } from './components/pages/CoursesPage';
// Import forms & contexts

// Modern Pages
import ModernLandingPage from './components/pages/ModernLandingPage';
import ModernDashboard from './components/pages/ModernDashboard';
import ModernNavbar from './components/layout/ModernNavbar';

// Feature Pages (update these with modern theme)
import CoursesPage from './components/pages/CoursesPage';
import TasksPage from './components/pages/TasksPage';
import EventsPage from './components/pages/EventsPage';
import GradesPage from './components/pages/GradesPage';
import FinancePage from './components/pages/FinancePage';
import ExamsPage from './components/pages/ExamsPage';
import HabitsPage from './components/pages/HabitsPage';

// Widgets
import PomodoroTimer from './components/widgets/PomodoroTimer';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Landing Page */}
                            <Route path="/" element={<ModernLandingPage />} />

                            {/* Dashboard */}
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

                            {/* Feature Pages */}
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
