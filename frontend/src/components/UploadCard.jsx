import "./UploadCard.css";

function UploadCard({ file, role, setRole, setFile, analyzeResume, loading }) {
  return <section className="upload-card surface">
    <div className="upload-heading"><span className="section-icon">↗</span><div><h2>Start with your resume</h2><p>We’ll identify strengths, gaps, and the next best steps for your target role.</p></div></div>
    <div className="form-grid">
      <label className="file-drop"><input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} /><span className="file-icon">⌁</span><strong>{file ? file.name : "Choose a PDF resume"}</strong><small>{file ? "Ready to analyze" : "PDF files only · up to 10 MB"}</small></label>
      <label className="field-label">Target role<input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. AI Engineer" /></label>
    </div>
    <button className="button analyze-button" type="button" onClick={analyzeResume} disabled={loading}>{loading ? "Analyzing your resume…" : "Analyze resume"}</button>
  </section>;
}

export default UploadCard;
