const Timer = ({ timeLeft }) => (
  <p className={timeLeft <= 10 ? "timer danger" : "timer"}>
    Còn {timeLeft} giây
  </p>
);

export default Timer;