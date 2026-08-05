import "./MissingSkillsCard.css";

function MissingSkillsCard({

  skills

}) {

  return (

    <div className="card">

      <h2>❌ Missing Skills</h2>

      <div className="badge-container">

        {skills.map((skill, index) => (

          <span
            key={index}
            className="missing-badge"
          >

            {skill}

          </span>

        ))}

      </div>

    </div>

  );

}

export default MissingSkillsCard;