import "./RoadmapCard.css";

function RoadmapCard({

  roadmap

}) {

  return (

    <div className="card">

      <h2>🗺 Learning Roadmap</h2>

      {

        Object.entries(roadmap).map(

          ([week, data]) => (

            <div
              className="week-card"
              key={week}
            >

              <h3>{week}</h3>

              <h4>{data.skill}</h4>

              <ul>

                {

                  data.topics.map(

                    (topic, index) => (

                      <li key={index}>

                        {topic}

                      </li>

                    )

                  )

                }

              </ul>

            </div>

          )

        )

      }

    </div>

  );

}

export default RoadmapCard;