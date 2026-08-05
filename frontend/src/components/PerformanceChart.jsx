import {

    LineChart,

    Line,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip,

    ResponsiveContainer

} from "recharts";

function PerformanceChart({

    scores

}) {

    const data = scores.map(

        (score,index)=>({

            Interview:index+1,

            Score:score

        })

    );

    return (

        <div className="chart-card">

            <h2>Performance Trend</h2>

            <ResponsiveContainer

                width="100%"

                height={300}

            >

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="Interview"/>

                    <YAxis domain={[0,10]}/>

                    <Tooltip/>

                    <Line

                        type="monotone"

                        dataKey="Score"

                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default PerformanceChart;