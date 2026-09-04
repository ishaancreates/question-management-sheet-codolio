const initialSheet = [
  {
    id: "javascript",
    title: "JavaScript",
    description: "Core language concepts and browser fundamentals",
    color: "#f2b84b",
    subtopics: [
      {
        id: "js-basics",
        title: "Language basics",
        questions: [
          {
            id: "js-1",
            text: "What is the difference between let, const, and var?",
            status: "todo",
          },
          {
            id: "js-2",
            text: "Explain how closures work in JavaScript.",
            status: "review",
          },
        ],
      },
      {
        id: "js-async",
        title: "Asynchronous JavaScript",
        questions: [
          {
            id: "js-3",
            text: "How does the event loop handle promises?",
            status: "done",
          },
        ],
      },
    ],
  },
  {
    id: "react",
    title: "React",
    description: "Components, state, and rendering patterns",
    color: "#61c5d6",
    subtopics: [
      {
        id: "react-core",
        title: "Core concepts",
        questions: [
          {
            id: "react-1",
            text: "When should you use a controlled component?",
            status: "todo",
          },
          {
            id: "react-2",
            text: "What causes a React component to re-render?",
            status: "review",
          },
        ],
      },
    ],
  },
];

export async function fetchSheet() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return structuredClone(initialSheet);
}
