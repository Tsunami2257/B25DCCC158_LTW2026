import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LETTERS, TIME_PER_QUESTION } from "../data";
import { calcPrize, makeAudience } from "../utils";
import QuestionCard from "../components/QuestionCard";
import AnswerButton from "../components/AnswerButton";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";

const Game = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("answering"); // answering | locked | revealed
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // State mới của Bài 3
  const [hidden, setHidden] = useState([]);        // các đáp án bị 50:50 ẩn
  const [audience, setAudience] = useState(null);  // mảng % hoặc null
  const [usedFifty, setUsedFifty] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);

  const q = questions[index];

  // Kết thúc lượt chơi: tính tiền, lưu lịch sử, rồi sang trang kết quả
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({ name: playerName, prize, correctCount });
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
      if (selected !== q.answer) {
        finish("wrong", index);
      } else if (index === questions.length - 1) {
        finish("won", questions.length);
      } else {
        setIndex(index + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_QUESTION);
        setHidden([]);      // sang câu mới: bỏ ẩn đáp án
        setAudience(null);  // và xóa biểu đồ khán giả
        setStatus("answering");
      }
    }, delay);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // (4) Phím tắt A-D: gắn sự kiện vào window, gỡ ra khi cleanup
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(e.key.toUpperCase()); // a và A đều ra "A"
      if (i === -1 || status !== "answering" || hidden.includes(i)) return;
      handlePick(i);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden]);

  // (5) Tiêu đề tab: đổi theo câu, trả lại khi rời màn chơi
  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} - ${playerName}`;
    return () => {
      document.title = "Ai là triệu phú";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handlePick = (i) => {
    if (status !== "answering") return;
    setSelected(i);
    setStatus("locked");
  };

  const handleFifty = () => {
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.answer);
    const shuffled = [...wrong].sort(() => Math.random() - 0.5); // sort trên bản sao
    setHidden(shuffled.slice(0, 2));
    setUsedFifty(true);
  };

  const handleAudience = () => {
    setAudience(makeAudience(q.answer, hidden));
    setUsedAudience(true);
  };

  const handleStop = () => {
    finish("quit", index); // câu hiện tại chưa trả lời nên số câu đúng = index
  };

  const getState = (i) => {
    if (hidden.includes(i)) return "hidden";
    if (status === "answering") return "normal";
    if (status === "locked") return i === selected ? "selected" : "normal";
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

        <Lifelines
          usedFifty={usedFifty}
          usedAudience={usedAudience}
          disabled={status !== "answering"}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onStop={handleStop}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

const Play = ({ questions, playerName, onFinish }) =>
  questions.length === 0
    ? <p>Đang tải câu hỏi...</p>
    : <Game questions={questions} playerName={playerName} onFinish={onFinish} />;

export default Play;