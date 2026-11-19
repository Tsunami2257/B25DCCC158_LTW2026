import { GRADES, RANKS } from './data';

export const getGrade = (score) =>
  GRADES.find((item) => score >= item.min) || GRADES[GRADES.length - 1];

export const getRank = (gpa) => {
  const found = RANKS.find((item) => gpa >= item.min);
  return found ? found.title : 'Chưa xếp loại';
};

export const calcStats = (courses) => {
  if (!courses || courses.length === 0) {
    return {
      count: 0,
      credits: 0,
      points: 0,
      gpa: 0,
      rank: 'Chưa xếp loại',
    };
  }

  const credits = courses.reduce((sum, c) => sum + c.credits, 0);
  const points = courses.reduce(
    (sum, c) => sum + c.credits * getGrade(c.score).point,
    0
  );
  const gpa = credits > 0 ? Math.round((points / credits) * 100) / 100 : 0;
  const rank = getRank(gpa);

  return {
    count: courses.length,
    credits,
    points,
    gpa,
    rank,
  };
};

export const calcRequired = (courses, target, remaining) => {
  const targetStr = String(target).trim();
  const remainingStr = String(remaining).trim();
  const targetNum = Number(targetStr);
  const remainingNum = Number(remainingStr);

  if (
    targetStr === '' ||
    remainingStr === '' ||
    Number.isNaN(targetNum) ||
    targetNum < 0 ||
    targetNum > 4 ||
    !Number.isInteger(remainingNum) ||
    remainingNum < 1
  ) {
    return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  }

  const { credits, points } = calcStats(courses);
  const need = (targetNum * (credits + remainingNum) - points) / remainingNum;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }
  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }
  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remainingNum} tín chỉ còn lại`;
};