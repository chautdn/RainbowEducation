import PlayerSelector from "../../components/dashBoard/player-selector";
import WeeklySummary from "../../components/dashBoard/weekly-summary";
import CourseProgress from "../../components/dashBoard/course-progress";
import ParentDashboardMenu from "../../components/navbar/ParentDashboardMenu";

export const ParentDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <ParentDashboardMenu />

                <div className="space-y-6">
                    <PlayerSelector />
                    <WeeklySummary />
                    <CourseProgress />
                </div>
            </div>
        </div>
    );
}