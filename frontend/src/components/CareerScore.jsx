function CareerScore({

    resumeScore,

    interviewScore

}) {

    const careerScore = Math.round(

        (resumeScore + interviewScore * 10) / 2

    );

    return (

        <div className="career-card">

            <h2>Career Readiness</h2>

            <div className="career-circle">

                <h1>{careerScore}%</h1>

            </div>

            <p>

                Based on Resume Analysis & Interview Performance

            </p>

        </div>

    );

}

export default CareerScore;