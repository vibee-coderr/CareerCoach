import "./SkillsCard.css";

function SkillsCard({ skills }) {

  return (

    <div className="card">

      <h2>🛠 Extracted Skills</h2>

      <div className="badge-container">

        {skills.map((skill, index) => (

          <span
            key={index}
            className="skill-badge"
          >
            {skill}
          </span>

        ))}

      </div>

    </div>

  );

}

export default SkillsCard;