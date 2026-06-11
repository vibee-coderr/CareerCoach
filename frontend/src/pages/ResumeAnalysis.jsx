import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("AI Engineer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("role", role);

      const response = await axios.post(
        "http://localhost:8000/analyze-resume",
        formData
      );

      setAnalysis(response.data);

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed to analyze resume");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="resume-container">

      <div className="hero">

        <h1>🚀 AI Career Coach</h1>

        <p>
          Upload your resume and get:
        </p>

        <ul>
          <li>Skill Analysis</li>
          <li>Skill Gap Detection</li>
          <li>Learning Roadmap</li>
          <li>Mock Interview Preparation</li>
        </ul>

        <div className="input-group">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

        </div>

        <div className="input-group">

          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Target Role"
          />

        </div>

        <button
          className="analyze-btn"
          onClick={analyzeResume}
        >
          Analyze Resume
        </button>

        <br /><br />

        {loading && (
          <p>
            Analyzing Resume...
          </p>
        )}

        <p>
          Selected File: {file?.name}
        </p>

        <p>
          Target Role: {role}
        </p>

      </div>

      {analysis && (

        <div>

          <h2>Extracted Skills</h2>

          <div className="skills-container">

            {analysis.analysis.skills.map(
              (skill, index) => (

                <span
                  key={index}
                  className="skill-tag"
                >
                  {skill}
                </span>

              )
            )}

          </div>

          <hr />

          <h2>Missing Skills</h2>

          <div className="skills-container">

            {analysis.skill_gap.missing_skills.map(
              (skill, index) => (

                <span
                  key={index}
                  className="missing-tag"
                >
                  {skill}
                </span>

              )
            )}

          </div>

          <hr />

          <h2>Learning Roadmap</h2>

          {Object.entries(
            analysis.roadmap
          ).map(([week, data]) => (

            <div
              key={week}
              className="roadmap-card"
            >

              <h3>
                {week} - {data.skill}
              </h3>

              <ul>

                {data.topics.map(
                  (topic, i) => (

                    <li key={i}>
                      {topic}
                    </li>

                  )
                )}

              </ul>

            </div>

          ))}

          <br />

          <button
            className="start-btn"
            onClick={() =>
              navigate(
                "/interview",
                {
                  state: { role }
                }
              )
            }
          >
            Start Interview
          </button>

        </div>

      )}

    </div>
  );
}

export default ResumeAnalysis;