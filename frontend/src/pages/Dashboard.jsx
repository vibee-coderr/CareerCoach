import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {

  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const progressRes = await axios.get(
        "http://localhost:8000/progress"
      );

      const historyRes = await axios.get(
        "http://localhost:8000/history"
      );

      setProgress(progressRes.data);
      setHistory(historyRes.data);

    } catch (err) {

      console.error(err);

    }
  };

  const getScoreClass = (score) => {

    if (score >= 7) {
      return "score-good";
    }

    if (score >= 4) {
      return "score-average";
    }

    return "score-poor";
  };

  return (

    <div className="dashboard-container">

      <h1>📊 Interview Dashboard</h1>

      {progress && (

        <div className="stats-grid">

          <div className="stat-card">

            <h3>Total Questions</h3>

            <h2>
              {progress.total_questions}
            </h2>

          </div>

          <div className="stat-card">

            <h3>Average Score</h3>

            <h2>
              {progress.average_score}
            </h2>

          </div>

          <div className="stat-card">

            <h3>Weak Topics</h3>

            <p>
              {progress.weak_topics?.join(", ")}
            </p>

          </div>

        </div>

      )}

      <div className="history-card">

        <h2>🧠 Interview History</h2>

        <table className="history-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Role</th>

              <th>Question</th>

              <th>Score</th>

              <th>Topic</th>

            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.role}</td>

                <td>{item.question}</td>

                <td
                  className={
                    getScoreClass(item.score)
                  }
                >
                  {item.score}/10
                </td>

                <td>{item.topic}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default Dashboard;