function InterviewHistory({ history }) {

  const getScoreClass = (score) => {

    if (score >= 8) return "score-good";

    if (score >= 5) return "score-average";

    return "score-poor";
  };

  return (

    <div className="history-card">

      <h2>🕒 Recent Interviews</h2>

      <table className="history-table">

        <thead>

          <tr>

            <th>Role</th>

            <th>Topic</th>

            <th>Score</th>

            <th>Question</th>

          </tr>

        </thead>

        <tbody>

          {history.map((item) => (

            <tr key={item.id}>

              <td>{item.role}</td>

              <td>{item.topic}</td>

              <td className={getScoreClass(item.score)}>

                {item.score}/10

              </td>

              <td>{item.question}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default InterviewHistory;