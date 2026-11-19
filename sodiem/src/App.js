import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCourseForm from './components/AddCourseForm';
import CourseRow from './components/CourseRow';
import GoalPlanner from './components/GoalPlanner';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { GRADES, SEMESTERS } from './data';
import {
  removeCourse,
  selectCourses,
  setCourses,
  setScore,
} from './features/coursesSlice';
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { hasSaved } from './store';
import { calcStats, getGrade } from './utils';

const BUILD_TAG = 'TH03';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedSemester, setSelectedSemester] = useLocalStorage(
    'ltw_sodiem_semester',
    'all'
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchInputRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!hasSaved && !initializedRef.current && data) {
      initializedRef.current = true;
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const activeEl = document.activeElement;
      const tag = activeEl?.tagName;
      const isEditing =
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        activeEl?.isContentEditable;

      if (e.key === '/' && !isEditing) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && activeEl === searchInputRef.current) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const semesterCourses = useMemo(() => {
    if (selectedSemester === 'all') return courses;
    return courses.filter((c) => c.semester === selectedSemester);
  }, [courses, selectedSemester]);

  const displayedCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return semesterCourses;
    return semesterCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.code.toLowerCase().includes(keyword)
    );
  }, [semesterCourses, debouncedSearch]);

  const semesterStats = useMemo(
    () => calcStats(semesterCourses),
    [semesterCourses]
  );

  const totalStats = useMemo(() => calcStats(courses), [courses]);

  const gradeDistribution = useMemo(() => {
    const counts = semesterCourses.reduce((acc, c) => {
      const { letter } = getGrade(c.score);
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    return GRADES.map((g) => ({
      letter: g.letter,
      count: counts[g.letter] || 0,
    }));
  }, [semesterCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${totalStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, totalStats.gpa]);

  const handleScore = useCallback(
    (id, rawVal) => {
      if (!Number.isNaN(rawVal) && rawVal >= 0 && rawVal <= 10) {
        dispatch(setScore({ id, score: rawVal }));
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id, name) => {
      dispatch(removeCourse(id));
      showNotice(`Đã xóa môn ${name}`);
    },
    [dispatch, showNotice]
  );

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  const handleResetSample = async () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
      return;
    }
    try {
      const res = await fetch('/data/courses.json');
      if (res.ok) {
        const json = await res.json();
        dispatch(setCourses(json));
        showNotice('Đã đặt lại dữ liệu mẫu');
      }
    } catch {
      // Bỏ qua nếu lỗi mạng
    }
  };

  const showInitialLoading = !hasSaved && loading;
  const showInitialError = !hasSaved && !loading && error;

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
          <p>{`Số môn: ${semesterStats.count}`}</p>
          <p>{`Tổng tín chỉ: ${semesterStats.credits}`}</p>
          <p>{`GPA (hệ 4): ${semesterStats.gpa.toFixed(2)}`}</p>
          <p>{`Xếp loại: ${semesterStats.rank}`}</p>
          <p>{`GPA tích lũy: ${totalStats.gpa.toFixed(2)}`}</p>

          <h3>Phân bố điểm chữ</h3>
          <ul className="grade-dist-list">
            {gradeDistribution.map(({ letter, count }) => (
              <li key={letter} className="grade-dist-item">
                <span>{`${letter}: ${count}`}</span>
                <span
                  className="grade-bar"
                  style={{ width: `${24 * count}px` }}
                />
              </li>
            ))}
          </ul>
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

            <label htmlFor="course-search">Tìm môn học</label>
            <input
              ref={searchInputRef}
              id="course-search"
              type="text"
              value={search}
              onChange={handleCourseShift}
            />
          </div>

          <p>{`Tìm thấy ${displayedCourses.length} môn`}</p>

          {showInitialLoading && <p>Đang tải bảng điểm...</p>}
          {showInitialError && <p>Không tải được bảng điểm.</p>}
          {!showInitialLoading &&
            !showInitialError &&
            displayedCourses.length === 0 && <p>Chưa có môn học nào</p>}
          {!showInitialLoading &&
            !showInitialError &&
            displayedCourses.length > 0 && (
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
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCourses.map((course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onScore={handleScore}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            )}

          <div style={{ marginTop: '12px' }}>
            <button type="button" onClick={handleResetSample}>
              Đặt lại dữ liệu mẫu
            </button>
          </div>
        </section>

        <AddCourseForm />
        <GoalPlanner />
      </div>
    </div>
  );
};

export default App;