import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { coursesReducer } from './coursesReducer';
import { CREDIT_OPTIONS, SEMESTERS, formatPoint } from './data';
import { useFetch } from './hooks/useFetch';
import { calcStats, getGrade } from './utils';

const BUILD_TAG = 'TH03';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [selectedSemester, setSelectedSemester] = useState('all');

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (selectedSemester === 'all') return courses;
    return courses.filter((c) => c.semester === selectedSemester);
  }, [courses, selectedSemester]);

  const filteredStats = useMemo(
    () => calcStats(filteredCourses),
    [filteredCourses]
  );

  const totalStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, rawVal) => {
    if (!Number.isNaN(rawVal) && rawVal >= 0 && rawVal <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score: rawVal } });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const numScore = Number(score);

    if (!trimmedCode) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else if (
      courses.some((c) => c.code.toLowerCase() === trimmedCode.toLowerCase())
    ) {
      nextErrors.code = 'Mã môn đã tồn tại';
    }

    if (!trimmedName) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    if (
      score.trim() === '' ||
      Number.isNaN(numScore) ||
      numScore < 0 ||
      numScore > 10
    ) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: numScore,
      },
    });

    setCode('');
    setName('');
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore('');
    setErrors({});
    codeInputRef.current?.focus();
  };

  return (
    <div className="app light" data-build={BUILD_TAG}>
      <div className="container">
        <header>
          <h1>Sổ điểm sinh viên</h1>
        </header>

        <section className="section-card">
          <h2>Thống kê</h2>
          <p>{`Số môn: ${filteredStats.count}`}</p>
          <p>{`Tổng tín chỉ: ${filteredStats.credits}`}</p>
          <p>{`GPA (hệ 4): ${filteredStats.gpa.toFixed(2)}`}</p>
          <p>{`Xếp loại: ${filteredStats.rank}`}</p>
          <p>{`GPA tích lũy: ${totalStats.gpa.toFixed(2)}`}</p>
        </section>

        <section className="section-card">
          <h2>Bảng điểm</h2>
          <div className="toolbar">
            <label htmlFor="semester-filter">Xem học kỳ</label>
            <select
              id="semester-filter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Đang tải bảng điểm...</p>}
          {!loading && error && <p>Không tải được bảng điểm.</p>}
          {!loading && !error && filteredCourses.length === 0 && (
            <p>Chưa có môn học nào</p>
          )}
          {!loading && !error && filteredCourses.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th>Tín chỉ</th>
                  <th>Học kỳ</th>
                  <th>Điểm (hệ 10)</th>
                  <th>Điểm chữ</th>
                  <th>Điểm (hệ 4)</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const grade = getGrade(course.score);
                  const isFail = grade.letter === 'F';
                  return (
                    <tr key={course.id} className={isFail ? 'row-fail' : ''}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.credits}</td>
                      <td>{course.semester}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          aria-label={`Điểm ${course.name}`}
                          value={course.score}
                          onChange={(e) =>
                            handleScoreChange(course.id, e.target.valueAsNumber)
                          }
                        />
                      </td>
                      <td>{isFail ? 'F - Học lại' : grade.letter}</td>
                      <td>{formatPoint(grade.point)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: 'REMOVE', payload: course.id })
                          }
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="section-card">
          <h2>Thêm môn học</h2>
          <form onSubmit={handleAddSubmit} className="form-grid" noValidate>
            <div className="field-group">
              <label htmlFor="course-code">Mã môn</label>
              <input
                ref={codeInputRef}
                id="course-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {errors.code && (
                <p role="alert" className="error-text">
                  {errors.code}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="course-name">Tên môn</label>
              <input
                id="course-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p role="alert" className="error-text">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="course-credits">Số tín chỉ</label>
              <select
                id="course-credits"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              >
                {CREDIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="course-semester">Học kỳ</label>
              <select
                id="course-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="course-score">Điểm hệ 10</label>
              <input
                id="course-score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              {errors.score && (
                <p role="alert" className="error-text">
                  {errors.score}
                </p>
              )}
            </div>

            <div className="field-group">
              <span>&nbsp;</span>
              <button type="submit">Thêm môn</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default App;