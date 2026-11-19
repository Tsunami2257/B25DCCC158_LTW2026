import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { selectGoal, setRemaining, setTarget } from '../features/goalSlice';
import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const resultText = useMemo(
    () => calcRequired(courses, target, remaining),
    [courses, target, remaining]
  );

  return (
    <section className="section-card">
      <h2>Mục tiêu GPA</h2>
      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="goal-target">GPA mục tiêu</label>
          <input
            id="goal-target"
            type="number"
            step="0.01"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </div>

        <div className="field-group">
          <label htmlFor="goal-remaining">Số tín chỉ còn lại</label>
          <input
            id="goal-remaining"
            type="number"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </div>
      </div>
      <p>{resultText}</p>
    </section>
  );
};

export default GoalPlanner;
