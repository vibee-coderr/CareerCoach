function TopicCard({

    title,

    topics,

    color

}) {

    return (

        <div className="topic-card">

            <h2>{title}</h2>

            {

                topics.length === 0 ?

                (

                    <p>No Data</p>

                )

                :

                (

                    <ul>

                        {

                            topics.map(

                                (topic,index)=>(

                                    <li

                                        key={index}

                                        style={{

                                            color

                                        }}

                                    >

                                        {topic}

                                    </li>

                                )

                            )

                        }

                    </ul>

                )

            }

        </div>

    );

}

export default TopicCard;