export default function QuestionItem({
  question,
  index,
  onToggle,
  onRemove,
  onDragStart,
  onDrop,
}) {
  return (
    <div
      className={`question-row status-${question.status}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(index)}
    >
      <span className="drag-handle" aria-hidden="true">
        ⠿
      </span>
      <button
        className="check-button"
        type="button"
        onClick={onToggle}
        aria-label="Toggle completion"
      >
        {question.status === "done" ? "✓" : ""}
      </button>
      <span className="question-text">{question.text}</span>
      <span className={`status-label ${question.status}`}>
        {question.status}
      </span>
      <button
        className="icon-button delete-button"
        type="button"
        onClick={onRemove}
        aria-label="Delete question"
      >
        ×
      </button>
    </div>
  );
}
