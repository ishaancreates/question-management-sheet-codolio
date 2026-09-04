import { useState } from "react";
import SubTopicAccordion from "./SubTopicAccordion";

export default function TopicCard({ topic, actions }) {
  const [open, setOpen] = useState(true);
  return (
    <article className="topic-card" style={{ "--topic-color": topic.color }}>
      <div className="topic-heading">
        <button
          className="topic-title"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <span className={`chevron ${open ? "open" : ""}`}>›</span>
          <span>
            <strong>{topic.title}</strong>
            <small>{topic.description}</small>
          </span>
        </button>
        <div className="topic-tools">
          <span className="topic-total">
            {topic.subtopics.reduce(
              (total, item) => total + item.questions.length,
              0,
            )}{" "}
            questions
          </span>
          <button
            className="button button-quiet"
            type="button"
            onClick={() => actions.addSubtopic(topic.id)}
          >
            + Sub-topic
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => actions.deleteTopic(topic.id)}
            aria-label={`Delete ${topic.title}`}
          >
            ×
          </button>
        </div>
      </div>
      {open && (
        <div className="subtopics">
          {topic.subtopics.map((subtopic) => (
            <SubTopicAccordion
              key={subtopic.id}
              topicId={topic.id}
              subtopic={subtopic}
              onAddQuestion={actions.addQuestion}
              onToggle={actions.toggleQuestion}
              onRemove={actions.removeQuestion}
              onReorder={actions.reorderQuestions}
            />
          ))}
          {topic.subtopics.length === 0 && (
            <p className="empty-state">No sub-topics yet.</p>
          )}
        </div>
      )}
    </article>
  );
}
