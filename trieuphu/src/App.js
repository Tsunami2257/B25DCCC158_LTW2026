import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const STORAGE_KEY = "ltw_trieuphu_history";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");

  // Đọc lịch sử từ localStorage khi khởi tạo
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Tải câu hỏi
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError("Không tải được câu hỏi");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Lưu lịch sử mỗi khi đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Thêm một lượt chơi (không sửa trực tiếp state, dùng spread)
  const addHistory = (record) => {
    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        playedAt: new Date().toLocaleString("vi-VN"),
        ...record,
      },
    ]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            playerName.trim() === ""
              ? <Navigate to="/" replace />
              : <Play
                  questions={questions}
                  playerName={playerName}
                  onFinish={addHistory}
                />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} onClear={() => setHistory([])} />}
        />
        <Route
          path="questions"
          element={<QuestionBank questions={questions} loading={loading} error={error} />}
        />
        <Route
          path="questions/:id"
          element={<QuestionDetail questions={questions} loading={loading} error={error} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;