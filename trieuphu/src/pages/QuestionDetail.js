import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, LETTERS } from "../data";

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>{error}</p>;

  const q = questions.find((item) => item.id === Number(id));

  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Câu hỏi số {q.id} ({LEVELS[q.level]})</h2>
      <p>{q.question}</p>
      <ul>
        {q.options.map((opt, i) => (
          <li key={i} className={i === q.answer ? "correct-text" : ""}>
            {LETTERS[i]}. {opt}
            {i === q.answer && " (Đáp án đúng)"}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;