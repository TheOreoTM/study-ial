"use client";

import { useUser } from "@/lib/auth/useUser";
import { useState } from "react";

/**
 * Example component showing how to search questions using the useUser hook
 */
export function QuestionSearch({ subjectId }: { subjectId: string }) {
  const { db, isAuthenticated } = useUser();
  const [searchText, setSearchText] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "very_hard">("medium");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const { questions: results } = await db.questions.search({
        subjectId,
        difficulty,
        searchText: searchText || undefined,
        limit: 20,
      });
      setQuestions(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Search Questions</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Text</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="e.g., integral, equilibrium..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="very_hard">Very Hard</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold">Found {questions.length} questions</h3>
          {questions.map((q) => (
            <div key={q.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{q.questionType}</p>
                  <p className="text-sm text-gray-600">Q{q.sourceQuestionNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  q.difficulty === "easy" ? "bg-green-100 text-green-800" :
                  q.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
                  q.difficulty === "hard" ? "bg-orange-100 text-orange-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {q.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
