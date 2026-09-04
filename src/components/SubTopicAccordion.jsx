import { useState } from "react";
import QuestionItem from "./QuestionItem";

export default function SubTopicAccordion({
  topicId,
  subtopic,
  onAddQuestion,
  onToggle,
  onRemove,
  onReorder,
}) {
  const [open, setOpen] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  return (
    <section className="subtopic">
      <button
        className="subtopic-heading"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className={`chevron ${open ? "open" : ""}`}>›</span>
        <strong>{subtopic.title}</strong>
        <span className="question-count">{subtopic.questions.length}</span>
      </button>
      {open && (
        <div className="question-list">
          {subtopic.questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onToggle={() => onToggle(topicId, subtopic.id, question.id)}
              onRemove={() => onRemove(topicId, subtopic.id, question.id)}
              onDragStart={setDraggedIndex}
              onDrop={(toIndex) => {
                if (draggedIndex !== null && draggedIndex !== toIndex)
                  onReorder(topicId, subtopic.id, draggedIndex, toIndex);
                setDraggedIndex(null);
              }}
            />
          ))}
          <button
            className="add-question"
            type="button"
            onClick={() => onAddQuestion(topicId, subtopic.id)}
          >
            + Add question
          </button>
        </div>
      )}
    </section>
  );
}
