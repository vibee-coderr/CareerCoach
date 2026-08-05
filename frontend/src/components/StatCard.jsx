function StatCard({

    title,

    value,

    icon

}) {

    return (

        <div className="stat-card">

            <h3>

                {icon} {title}

            </h3>

            <h2>{value}</h2>

        </div>

    );

}

export default StatCard;