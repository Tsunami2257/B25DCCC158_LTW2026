const COURSES_KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
  try {
    const raw = window.localStorage.getItem(COURSES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    window.localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch {
    // Bỏ qua nếu trình duyệt chặn lưu trữ
  }
};