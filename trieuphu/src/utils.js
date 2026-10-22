import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  // Dừng cuộc chơi hoặc thắng: nhận tiền của câu đúng gần nhất
  if (reason === "quit" || reason === "won") {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  // Sai hoặc hết giờ: chỉ nhận tiền của mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};