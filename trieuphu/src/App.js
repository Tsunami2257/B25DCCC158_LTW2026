import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy thì không báo lỗi
        setError("Không tải được câu hỏi");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
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