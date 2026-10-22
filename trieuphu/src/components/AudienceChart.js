import { LETTERS } from "../data";

const AudienceChart = ({ percents }) => (
  <div>
    {percents.map((p, i) => (
      <div className="bar-row" key={i}>
        <span className="label">{LETTERS[i]}: {p}%</span>
        <div className="bar" style={{ width: `${p}%` }} />
      </div>
    ))}
  </div>
);

export default AudienceChart;