import { Link, Navigate, useLocation } from "react-router-dom";
import { formatMoney } from "../data";

const TITLES = {
  won: "Chúc mừng! Bạn đã trở thành triệu phú",
  wrong: "Rất tiếc, bạn đã trả lời sai",
  timeout: "Hết giờ!",
  quit: "Bạn đã dừng cuộc chơi",
};

const Result = () => {
  const { state } = useLocation();

  // Mở /result trực tiếp thì không có state -> về trang chủ
  if (!state) return <Navigate to="/" replace />;

  return (
    <div>
      <h2>{TITLES[state.reason]}</h2>
      <p>Người chơi: {state.name}</p>
      <p>Số câu trả lời đúng: {state.correctCount}</p>
      <p>Tiền thưởng: {formatMoney(state.prize)}</p>
      <Link to="/play">Chơi lại</Link> | <Link to="/">Về trang chủ</Link>
    </div>
  );
};

export default Result;