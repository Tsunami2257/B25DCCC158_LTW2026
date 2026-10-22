const QuestionCard = ({ number, total, question, children }) => (
  <div>
    <h3>Câu {number}/{total}</h3>
    <p>{question}</p>
    <div className="answers">{children}</div>
  </div>
);

export default QuestionCard;
