// components/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [completedSessions, setCompletedSessions] = useState(0);

    const audioRef = useRef(null);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer finished
                        playNotification();

                        if (isBreak) {
                            // Break finished, start work timer
                            setIsBreak(false);
                            setMinutes(workDuration);
                            setSeconds(0);
                            alert('Break time finished! Back to work! 💪');
                        } else {
                            // Work finished, start break timer
                            setIsBreak(true);
                            setMinutes(breakDuration);
                            setSeconds(0);
                            setCompletedSessions((prev) => prev + 1);
                            alert('Great job! Time for a break! ☕');
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, isBreak, workDuration, breakDuration]);

    const playNotification = () => {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(workDuration);
        setSeconds(0);
    };

    const formatTime = (mins, secs) => {
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    const getProgress = () => {
        const totalSeconds = isBreak ? breakDuration * 60 : workDuration * 60;
        const currentSeconds = minutes * 60 + seconds;
        return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className={`px-4 py-3 rounded-full shadow-lg font-bold text-white ${
                        isBreak
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                    } transition`}
                >
                    🍅 {formatTime(minutes, seconds)}
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-6 w-80">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center">
                    🍅 Pomodoro Timer
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Minimize"
                    >
                        ➖
                    </button>
                </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    {/* Progress Circle */}
                    <svg className="transform -rotate-90 w-48 h-48">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke={isBreak ? '#10B981' : '#EF4444'}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 88}`}
                            strokeDashoffset={`${
                                2 * Math.PI * 88 * (1 - getProgress() / 100)
                            }`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />
                    </svg>

                    {/* Time Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-gray-900">
                            {formatTime(minutes, seconds)}
                        </span>
                        <span
                            className={`text-sm font-medium mt-2 ${
                                isBreak ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {isBreak ? '☕ Break Time' : '💪 Focus Time'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={toggleTimer}
                    className={`flex-1 py-3 rounded-lg font-semibold text-white transition ${
                        isActive
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : isBreak
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                    {isActive ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                    🔄 Reset
                </button>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Sessions completed:</span>
                    <span className="font-bold text-gray-900">
                        {completedSessions} 🎯
                    </span>
                </div>
            </div>

            {/* Settings */}
            <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
                    ⚙️ Settings
                </summary>
                <div className="mt-3 space-y-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            Work Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={workDuration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setWorkDuration(val);
                                if (!isActive && !isBreak) {
                                    setMinutes(val);
                                    setSeconds(0);
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={isActive}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            Break Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={breakDuration}
                            onChange={(e) =>
                                setBreakDuration(parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={isActive}
                        />
                    </div>
                    <button
                        onClick={() => setCompletedSessions(0)}
                        className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs"
                    >
                        Reset Sessions
                    </button>
                </div>
            </details>
        </div>
    );
}

// How to use:
// 1. Import in your main App.jsx or layout component:
// import PomodoroTimer from './components/PomodoroTimer';
//
// 2. Add it anywhere in your JSX (it will float):
// <PomodoroTimer />
//
// The timer will appear as a floating widget in the bottom-right corner
