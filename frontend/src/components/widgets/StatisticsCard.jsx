// ============================================
// StatisticsCard Component
// ============================================
const StatisticsCard = ({ icon, label, value, color, trend }) => {
    return (
        <div className="glass-card p-6 hover:scale-105 transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/60 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white mb-2">
                        {value}
                    </p>
                    {trend && (
                        <p
                            className={`text-sm flex items-center gap-1 ${
                                trend > 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                        >
                            {trend > 0 ? '📈' : '📉'} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: color + '30' }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export { CoursesPage, EventsPage, StatisticsCard };
export default CoursesPage;
