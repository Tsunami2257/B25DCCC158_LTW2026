import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotice } from '../context/NoticeContext';
import { CREDIT_OPTIONS, SEMESTERS } from '../data';
import { addCourse, selectCourses } from '../features/coursesSlice';

const AddCourseForm = () => {
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

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

    dispatch(
      addCourse({
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: numScore,
      })
    );
    showNotice(`Đã thêm môn ${trimmedName}`);

    setCode('');
    setName('');
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore('');
    setErrors({});
    codeInputRef.current?.focus();
  };

  return (
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
  );
};

export default AddCourseForm;