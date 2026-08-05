import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./Summary.css";

function Summary() {
  const [summary, setSummary] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get("/summary").then(({ data }) => setSummary(data)).catch(() => setError("We couldn’t load your summary. Please try again.")); }, []);
  if (error) return <main className="page-shell"><p className="form-error">{error}</p></main>;
  if (!summary) return <main className="page-shell status-message">Loading your session summary…</main>;
  if (summary.message) return <main className="page-shell summary-empty"><p className="eyebrow">No sessions yet</p><h1 className="page-title">Your progress will appear here.</h1><p className="page-subtitle">Complete a mock interview to see tailored feedback and track your growth.</p><Link className="button" to="/interview">Start interview practice</Link></main>;
  const groups = [["What you’re doing well", summary.strong_topics, "good"], ["What to focus on", summary.weak_topics, "focus"]];
  return <main className="page-shell summary-page"><p className="eyebrow">Session complete</p><h1 className="page-title">A useful step forward.</h1><p className="page-subtitle">Use this feedback to sharpen your next interview practice session.</p><section className="summary-score surface"><div><span>Average score</span><strong>{summary.average_score}<small>/10</small></strong></div><div><span>Questions completed</span><b>{summary.total_questions}</b></div><div><span>Best response</span><b>{summary.highest_score}<small>/10</small></b></div></section><section className="summary-groups">{groups.map(([title, topics, variant]) => <article className={`summary-group surface ${variant}`} key={title}><h2>{title}</h2>{topics?.length ? <ul>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul> : <p>Keep practising to unlock topic-level insights.</p>}</article>)}</section><div className="summary-actions"><Link className="button button-secondary" to="/dashboard">View progress</Link><Link className="button" to="/interview">Practice again</Link></div></main>;
}
export default Summary;
