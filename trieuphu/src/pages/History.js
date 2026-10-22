import { formatMoney } from "../data";

const History = ({ history, onClear }) => {
  if (history.length === 0) return <p>Chưa có lượt chơi nào</p>;

  // Sắp xếp giảm dần theo tiền thưởng, sort trên bản sao
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const best = sorted[0].prize;
  const total = history.reduce((sum, h) => sum + h.prize, 0);

  return (
    <div>
      <h2>Lịch sử</h2>
      <p>Số lượt chơi: {history.length}</p>
      <p>Tiền thưởng cao nhất: {formatMoney(best)}</p>
      <p>Tổng tiền thưởng: {formatMoney(total)}</p>
      <button onClick={onClear}>Xóa lịch sử</button>

      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Tiền thưởng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.correctCount}</td>
              <td>{formatMoney(h.prize)}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;