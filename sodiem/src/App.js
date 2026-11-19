import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { SEMESTERS, formatPoint } from './data';
import {
  removeCourse,
  selectCourses,
  setCourses,
  setScore,
} from './features/coursesSlice';
import { useFetch } from './hooks/useFetch';
import { calcStats, getGrade } from './utils';

const BUILD_TAG = 'TH03';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

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
      dispatch(setScore({ id, score: rawVal }));
    }
  };

  const handleRemove = (course) => {
    dispatch(removeCourse(course.id));
    showNotice(`Đã xóa môn ${course.name}`);
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <div className="container">
        <header>
          <h1>Sổ điểm sinh viên</h1>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
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
                            handleScoreChange(
                              course.id,
                              e.target.valueAsNumber
                            )
                          }
                        />
                      </td>
                      <td>{isFail ? 'F - Học lại' : grade.letter}</td>
                      <td>{formatPoint(grade.point)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemove(course)}
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

        <AddCourseForm />
        <GoalPlanner />
      </div>
    </div>
  );
};

export default App;