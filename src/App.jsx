import { useEffect } from "react";
import { useState } from "react";
import AddEditModal from "./components/AddEditModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2, ExternalLink } from "lucide-react";
import { useSheetStore } from "./store/useSheetStore";

export default function App() {
  const {
    topics,
    addTopic,
    addSubTopic,
    addQuestion,
    deleteTopic,
    reorderQuestions,
    setTopics,
  } = useSheetStore();
  const [modal, setModal] = useState(null); // { kind, topicId?, subTopicId? }
  useEffect(() => {
    // Initial mock data matching Codolio structure
    setTopics([
      {
        id: "topic-1",
        title: "Arrays & Hashing",
        subTopics: [
          {
            id: "sub-1",
            title: "Basic Operations",
            questions: [
              {
                id: "q-1",
                title: "Two Sum",
                url: "https://leetcode.com/problems/two-sum",
                difficulty: "Easy",
              },
              {
                id: "q-2",
                title: "Valid Anagram",
                url: "https://leetcode.com/problems/valid-anagram",
                difficulty: "Easy",
              },
            ],
          },
        ],
      },
    ]);
  }, []);

  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "QUESTION") {
      const [topicId, subTopicId] = source.droppableId.split("::");
      reorderQuestions(topicId, subTopicId, source.index, destination.index);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">
              Question Tracker Sheet
            </h1>
            <p className="text-sm text-slate-400">
              Organize and track your coding preparation
            </p>
          </div>
          <button
            onClick={() => setModal({ kind: "topic" })}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Add Topic
          </button>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="space-y-6">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-200">
                    {topic.title}
                  </h2>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="text-slate-400 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {topic.subTopics.map((subTopic) => (
                    <div
                      key={subTopic.id}
                      className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/40"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-indigo-300">
                          {subTopic.title}
                        </h3>
                        <button
                          onClick={() =>
                            setModal({
                              kind: "question",
                              topicId: topic.id,
                              subTopicId: subTopic.id,
                            })
                          }
                          className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                        >
                          <Plus size={12} /> Add Question
                        </button>
                      </div>

                      <Droppable
                        droppableId={`${topic.id}::${subTopic.id}`}
                        type="QUESTION"
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {subTopic.questions.map((q, index) => (
                              <Draggable
                                key={q.id}
                                draggableId={q.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center justify-between bg-slate-800 border border-slate-700/80 p-3 rounded-md hover:border-slate-600 transition"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        {...provided.dragHandleProps}
                                        className="cursor-grab text-slate-500 hover:text-slate-300"
                                      >
                                        <GripVertical size={16} />
                                      </span>
                                      <a
                                        href={q.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-medium text-slate-200 hover:text-indigo-400 flex items-center gap-1.5"
                                      >
                                        {q.title}{" "}
                                        <ExternalLink
                                          size={12}
                                          className="opacity-60"
                                        />
                                      </a>
                                    </div>
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        q.difficulty === "Easy"
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                      }`}
                                    >
                                      {q.difficulty}
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setModal({ kind: "subtopic", topicId: topic.id })
                    }
                    className="text-xs text-slate-400 hover:text-indigo-400"
                  >
                    + Add Sub-topic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {modal?.kind === "topic" && (
        <AddEditModal
          title="Add Topic"
          fields={[
            {
              name: "title",
              label: "Topic Name",
              placeholder: "e.g. Arrays & Hashing",
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={({ title }) => {
            addTopic(title);
            setModal(null);
          }}
        />
      )}

      {modal?.kind === "subtopic" && (
        <AddEditModal
          title="Add Sub-topic"
          fields={[
            {
              name: "title",
              label: "Sub-topic Name",
              placeholder: "e.g. Basic Operations",
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={({ title }) => {
            addSubTopic(modal.topicId, title);
            setModal(null);
          }}
        />
      )}

      {modal?.kind === "question" && (
        <AddEditModal
          title="Add Question"
          fields={[
            {
              name: "title",
              label: "Question Title",
              placeholder: "e.g. Two Sum",
            },
            {
              name: "url",
              label: "Problem URL",
              placeholder: "https://leetcode.com/problems/...",
              required: true
            },
            {
              name: "difficulty",
              label: "Difficulty",
              type: "select",
              options: ["Easy", "Medium", "Hard"],
              default: "Easy",
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={(data) => {
            addQuestion(modal.topicId, modal.subTopicId, data);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
