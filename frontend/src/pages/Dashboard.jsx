import { useEffect, useState } from "react";
import api from "../api";

import "./Dashboard.css";

import CareerScore from "../components/CareerScore";
import StatCard from "../components/StatCard";
import TopicCard from "../components/TopicCard";
import PerformanceChart from "../components/PerformanceChart";
import InterviewHistory from "../components/InterviewHistory";

function Dashboard() {

  const [progress, setProgress] = useState(null);

  const [dashboard, setDashboard] = useState(null);

  const [history, setHistory] = useState([]);

  const loadDashboard = async () => {
    try {
      const [progressRes, dashboardRes, historyRes] = await Promise.all([
        api.get("/progress"),
        api.get("/dashboard"),
        api.get("/history"),
      ]);
      setProgress(progressRes.data);
      setDashboard(dashboardRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Unable to load dashboard", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const downloadReport = async () => {
    try {
      const response = await api.get("/download-report", {
        responseType: "blob",
      });
      const contentType = response.headers["content-type"] || "";
      if (!contentType.includes("application/pdf")) {
        const text = await new Response(response.data).text();
        throw new Error(text || "Unable to download report.");
      }
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AI_Career_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download report failed", err);
      alert(err.message || "Unable to download report. Please try again.");
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear all interview history? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete("/clear-history");
      await loadDashboard();
    } catch (err) {
      console.error("Clear history failed", err);
      alert("Unable to clear history. Please try again.");
    }
  };

  if (!progress || !dashboard)

    return <h2>Loading Dashboard...</h2>;

  return (

    <div className="dashboard-container">

      <h1>📊 Career Dashboard</h1>

      <CareerScore

        resumeScore={85}

        interviewScore={progress.average_score}

      />

      <div className="stats-grid">

        <StatCard

          title="Resume Score"

          value="85%"

          icon="📄"

        />

        <StatCard

          title="Interview Avg"

          value={progress.average_score}

          icon="🎯"

        />

        <StatCard

          title="Questions"

          value={progress.total_questions}

          icon="❓"

        />

        <StatCard

          title="Best Topic"

          value={dashboard.best_topic || "-"}

          icon="🏆"

        />

      </div>

      <PerformanceChart

        scores={dashboard.recent_scores}

      />

      <div className="topic-grid">

        <TopicCard

          title="💪 Strong Topics"

          topics={progress.strong_topics}

          color="green"

        />

        <TopicCard

          title="📉 Weak Topics"

          topics={progress.weak_topics}

          color="red"

        />

      </div>

      <div className="dashboard-actions">
        <button className="button button-secondary" onClick={downloadReport}>
          Download report
        </button>
        <button className="button button-danger" onClick={clearHistory}>
          Clear history
        </button>
      </div>

      <InterviewHistory

        history={history}

      />

    </div>

  );

}

export default Dashboard;
