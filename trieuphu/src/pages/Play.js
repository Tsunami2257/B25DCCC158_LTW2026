import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LETTERS, TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";
import QuestionCard from "../components/QuestionCard";
import AnswerButton from "../components/AnswerButton";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";

const Game = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);          // câu hiện tại (từ 0)
  const [selected, setSelected] = useState(null); // đáp án đã chọn
  const [status, setStatus] = useState("answering"); // answering | locked | revealed
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const q = questions[index];

  // Kết thúc lượt chơi: tính tiền rồi sang trang kết quả
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    navigate("/result", {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  // (1) Đồng hồ: chỉ chạy khi đang chờ chọn đáp án
  useEffect(() => {
    if (status !== "answering") return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // (2) Hết giờ thì tính như trả lời sai
  useEffect(() => {
    if (status === "answering" && timeLeft <= 0) {
      finish("timeout", index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // (3) answering -> locked (1 giây) -> revealed (2 giây) -> câu tiếp / kết thúc
  useEffect(() => {
    if (status === "answering") return;
    const delay = status === "locked" ? 1000 : 2000;

    const id = setTimeout(() => {
      if (status === "locked") {
        setStatus("revealed");
        return;
      }
      // status === "revealed"
      if (selected !== q.answer) {
        finish("wrong", index);
      } else if (index === questions.length - 1) {
        finish("won", questions.length);
      } else {
        setIndex(index + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_QUESTION);
        setStatus("answering");
      }
    }, delay);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handlePick = (i) => {
    if (status !== "answering") return;
    setSelected(i);
    setStatus("locked");
  };

  const getState = (i) => {
    if (status === "answering") return "normal";
    if (status === "locked") return i === selected ? "selected" : "normal";
    // revealed
    if (i === q.answer) return "correct";
    if (i === selected) return "wrong";
    return "normal";
  };

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={q.question}
        >
          {q.options.map((opt, i) => (
            <AnswerButton
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={getState(i)}
              disabled={status !== "answering"}
              onClick={() => handlePick(i)}
            />
          ))}
        </QuestionCard>
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

// Chờ dữ liệu tải xong mới dựng màn chơi
const Play = ({ questions, playerName }) =>
  questions.length === 0
    ? <p>Đang tải câu hỏi...</p>
    : <Game questions={questions} playerName={playerName} />;

export default Play;