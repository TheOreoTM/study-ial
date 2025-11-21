"use client";

import { useUser } from "@/lib/auth/useUser";
import { useState } from "react";

/**
 * Example component showing how to record question attempts
 */
export function QuestionAttempt({ questionId }: { questionId: string }) {
  const { db, isAuthenticated } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (isCorrect: boolean) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      // Record the attempt
      await db.progressAdmin.recordAttempt(questionId, isCorrect);
      setSubmitted(true);

      // Optionally show a message
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error("Failed to record attempt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Submit Your Answer</h3>

      <div className="flex gap-3">
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading || !isAuthenticated}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Mark Correct ✓"}
        </button>

        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || !isAuthenticated}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Mark Incorrect ✗"}
        </button>
      </div>

      {submitted && (
        <div className="mt-3 p-3 bg-blue-100 text-blue-800 rounded">
          Attempt recorded!
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded">
          Please sign in to track your progress
        </div>
      )}
    </div>
  );
}
