import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Interview.css";

function Interview() {

  const location = useLocation();

  const role =
    location.state?.role || "AI Engineer";

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(false);

  const startInterview = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8000/start-interview",
        {
          role: role,
          skills: []
        }
      );

      setQuestion(
        response.data.data.question
      );

    } catch (error) {

      console.error(error);

      alert("Failed to start interview");

    }
  };

  const submitAnswer = async () => {

    if (!answer.trim()) {

      alert("Please enter an answer");

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/chat-interview",
        {
          role: role,
          question: question,
          answer: answer
        }
      );

      console.log(response.data);

      setEvaluation(
        response.data.evaluation
      );

      setQuestion(
        response.data.next_question.question
      );

      setAnswer("");

    } catch (error) {

      console.error(error);

      alert("Failed to submit answer");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="interview-container">

      <h1>🎯 AI Mock Interview</h1>

      <p>
        Practice technical interviews and
        receive instant AI feedback.
      </p>

      <div className="question-card">

        <h3>Target Role</h3>

        <p>{role}</p>

        {!question ? (

          <button
            className="submit-btn"
            onClick={startInterview}
          >
            Start Interview
          </button>

        ) : (

          <>
            <h2>Current Question</h2>

            <p>{question}</p>
          </>

        )}

      </div>

      {question && (

        <>

          <textarea
            className="answer-box"
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type your answer here..."
          />

          <button
            className="submit-btn"
            onClick={submitAnswer}
          >
            Submit Answer
          </button>

        </>

      )}

      {loading && (
        <p>Evaluating answer...</p>
      )}

      {evaluation && (

        <div className="feedback-card">

          <h2>Evaluation</h2>

          <div className="score-badge">

            Score: {evaluation.score}/10

          </div>

          <br />
          <br />

          <p>

            <strong>Feedback:</strong>

            <br />

            {evaluation.feedback}

          </p>

          <h3>Correct Answer</h3>

          <p>
            {evaluation.correct_answer}
          </p>

          <h3>Improvement Points</h3>

          <ul className="improvement-list">

            {evaluation.improvement_points?.map(
              (point, index) => (

                <li key={index}>
                  {point}
                </li>

              )
            )}

          </ul>

        </div>

      )}

    </div>

  );
}

export default Interview;