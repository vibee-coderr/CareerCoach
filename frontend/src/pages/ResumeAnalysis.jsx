import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./ResumeAnalysis.css";
import UploadCard from "../components/UploadCard";
import ResumeScoreCard from "../components/ResumeScoreCard";
import SkillsCard from "../components/SkillsCard";
import MissingSkillsCard from "../components/MissingSkillsCard";
import RoadmapCard from "../components/RoadmapCard";

function ResumeAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("AI Engineer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!file) { setError("Choose a PDF resume before running an analysis."); return; }
    setLoading(true); setError("");
    try {
      const formData = new FormData(); formData.append("file", file); formData.append("role", role);
      const response = await api.post("/analyze-resume", formData);
      setAnalysis(response.data);
    } catch { setError("We couldn’t analyze the resume. Check that the API is running and try again."); }
    finally { setLoading(false); }
  };

  return <main className="page-shell resume-container">
    <section className="resume-hero">
      <p className="eyebrow">Career intelligence, made practical</p>
      <h1 className="page-title">Turn your resume into a clear career plan.</h1>
      <p className="page-subtitle">Get an instant skills assessment, tailored learning roadmap, and focused interview practice for the role you want next.</p>
      <div className="trust-row"><span>✓ Personalized skill gap analysis</span><span>✓ Role-specific roadmap</span><span>✓ AI interview coaching</span></div>
    </section>
    <UploadCard file={file} role={role} setRole={setRole} setFile={setFile} analyzeResume={analyzeResume} loading={loading} />
    {error && <p className="form-error" role="alert">{error}</p>}
    {analysis && <section className="analysis-results" aria-live="polite">
      <div className="results-header"><div><p className="eyebrow">Your assessment</p><h2>Here’s where to focus next</h2></div><span className="ready-tag">Analysis complete</span></div>
      <ResumeScoreCard missingSkills={analysis.skill_gap?.missing_skills || []} />
      <SkillsCard skills={analysis.analysis?.skills || []} />
      <MissingSkillsCard skills={analysis.skill_gap?.missing_skills || []} />
      <RoadmapCard roadmap={analysis.roadmap || {}} />
      <div className="interview-cta"><div><h2>Ready to put this into practice?</h2><p>Start a tailored mock interview for {role}.</p></div><button className="button" onClick={() => navigate("/interview", { state: { role } })}>Start interview practice →</button></div>
    </section>}
  </main>;
}
export default ResumeAnalysis;
