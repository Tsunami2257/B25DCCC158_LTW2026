const Lifelines = ({
  usedFifty,
  usedAudience,
  disabled,
  onFifty,
  onAudience,
  onStop,
}) => (
  <div className="lifelines">
    <button onClick={onFifty} disabled={disabled || usedFifty}>
      50:50
    </button>
    <button onClick={onAudience} disabled={disabled || usedAudience}>
      Hỏi khán giả
    </button>
    <button onClick={onStop} disabled={disabled}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;