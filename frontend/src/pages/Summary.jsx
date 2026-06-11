import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Summary() {

  const [summary, setSummary] =
    useState(null);

  useEffect(() => {

    fetchSummary();

  }, []);

  const fetchSummary = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:8000/summary"
        );

      setSummary(response.data);

    } catch (err) {

      console.error(err);

    }
  };

  if (!summary) {

    return <p>Loading...</p>;

  }

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "auto"
      }}
    >

      <h1>
        🎉 Interview Summary
      </h1>

      <h2>
        Average Score:
        {summary.average_score}/10
      </h2>

      <h3>
        Total Questions:
        {summary.total_questions}
      </h3>

      <hr />

      <h2>💪 Strong Topics</h2>

      <ul>

        {summary.strong_topics.map(
          (topic, index) => (

            <li key={index}>
              {topic}
            </li>

          )
        )}

      </ul>

      <h2>📉 Weak Topics</h2>

      <ul>

        {summary.weak_topics.map(
          (topic, index) => (

            <li key={index}>
              {topic}
            </li>

          )
        )}

      </ul>

      <br />

      <Link to="/dashboard">
        Go To Dashboard →
      </Link>

    </div>

  );
}

export default Summary;