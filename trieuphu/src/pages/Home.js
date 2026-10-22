import { useNavigate } from "react-router-dom";

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      <p>
        Luật chơi: trả lời lần lượt 15 câu hỏi trắc nghiệm, mỗi câu 30 giây.
        Trả lời đúng thì leo lên bậc thưởng cao hơn, câu cuối trị giá
        250.000.000 đ. Câu 5, 10, 15 là các mốc an toàn.
      </p>
      <input
        placeholder="Nhập tên người chơi"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />{" "}
      <button
        disabled={playerName.trim() === ""}
        onClick={() => navigate("/play")}
      >
        Bắt đầu
      </button>
    </div>
  );
};

export default Home;