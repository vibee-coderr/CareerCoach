import "./ResumeScoreCard.css";

function ResumeScoreCard({

  missingSkills

}) {

  const score = Math.max(

    100 - missingSkills.length * 10,

    30

  );

  return (

    <div className="score-card">

      <div className="circle">

        <h1>

          {score}%

        </h1>

      </div>

      <h2>

        Resume Score

      </h2>

    </div>

  );

}

export default ResumeScoreCard;