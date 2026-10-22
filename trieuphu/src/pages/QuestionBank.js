import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

const QuestionBank = ({ questions, loading, error }) => {
  const [level, setLevel] = useState("all");
  const [keyword, setKeyword] = useState("");

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>{error}</p>;

  const filtered = questions
    .filter((q) => level === "all" || q.level === Number(level))
    .filter((q) =>
      q.question.toLowerCase().includes(keyword.trim().toLowerCase())
    );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="all">Tất cả</option>
        <option value="1">Dễ</option>
        <option value="2">Trung bình</option>
        <option value="3">Khó</option>
      </select>{" "}
      <input
        placeholder="Tìm kiếm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <p>Có {filtered.length} câu hỏi</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q, i) => (
            <tr key={q.id}>
              <td>{i + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;