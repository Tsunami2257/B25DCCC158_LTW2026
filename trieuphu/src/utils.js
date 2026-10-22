import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "quit" || reason === "won") {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};

// Tạo tỉ lệ % khán giả chọn A, B, C, D (tổng = 100)
// answer: vị trí đáp án đúng; hidden: các đáp án đã bị 50:50 ẩn (được 0%)
export const makeAudience = (answer, hidden) => {
  const result = [0, 0, 0, 0];
  const correct = 40 + Math.floor(Math.random() * 31); // ngẫu nhiên 40..70
  result[answer] = correct;

  const others = [0, 1, 2, 3].filter(
    (i) => i !== answer && !hidden.includes(i)
  );
  let remain = 100 - correct;

  others.forEach((i, k) => {
    if (k === others.length - 1) {
      result[i] = remain; // đáp án cuối nhận phần còn lại, đảm bảo tổng = 100
    } else {
      const v = Math.floor(Math.random() * (remain + 1));
      result[i] = v;
      remain -= v;
    }
  });

  return result;
};