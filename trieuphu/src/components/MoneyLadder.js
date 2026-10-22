import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((p, i) => (
      <li
        key={i}
        className={
          (i === current ? "current " : "") +
          (MILESTONES.includes(i + 1) ? "milestone" : "")
        }
      >
        {i + 1}. {formatMoney(p)}
      </li>
    )).reverse()}
  </ul>
);

export default MoneyLadder;