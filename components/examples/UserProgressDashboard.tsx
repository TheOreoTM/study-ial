"use client";

import { useUser } from "@/lib/auth/useUser";
import { useEffect, useState } from "react";

/**
 * Example component showing how to use the useUser hook
 * This demonstrates accessing user progress statistics
 */
export function UserProgressDashboard() {
  const { clerkUser, db, isAuthenticated, isLoaded } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadStats() {
      try {
        setLoading(true);
        const userStats = await db.progress.getStats();
        setStats(userStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [isAuthenticated, db.progress]);

  // Handle loading states
  if (!isLoaded) {
    return <div className="p-4">Loading user data...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-4">Please sign in to view your dashboard</div>;
  }

  if (loading) {
    return <div className="p-4">Loading statistics...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, {clerkUser?.firstName}!</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">Questions Attempted</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalQuestionsAttempted}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalQuestionsCorrect}
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.successRate.toFixed(1)}%
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded">
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl font-bold text-orange-600">
              {/* Streak would be loaded separately */}
              -
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
