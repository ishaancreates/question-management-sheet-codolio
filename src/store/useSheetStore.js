import { create } from "zustand";

export const useSheetStore = create((set) => ({
  topics: [],
  isLoading: false,

  setTopics: (topics) => set({ topics }),

  // Topic CRUD
  addTopic: (title) =>
    set((state) => ({
      topics: [
        ...state.topics,
        { id: `topic-${Date.now()}`, title, subTopics: [] },
      ],
    })),
  deleteTopic: (topicId) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== topicId),
    })),

  addSubTopic: (topicId, title) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id !== topicId
          ? t
          : {
              ...t,
              subTopics: [
                ...t.subTopics,
                { id: crypto.randomUUID(), title, questions: [] },
              ],
            },
      ),
    })),

  addQuestion: (topicId, subTopicId, data) =>
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subTopics: t.subTopics.map((st) =>
            st.id !== subTopicId
              ? st
              : {
                  ...st,
                  questions: [
                    ...st.questions,
                    { id: crypto.randomUUID(), ...data },
                  ],
                },
          ),
        };
      }),
    })),

  // Reorder Handler
  reorderQuestions: (topicId, subTopicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subTopics: t.subTopics.map((st) => {
            if (st.id !== subTopicId) return st;
            const result = Array.from(st.questions);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { ...st, questions: result };
          }),
        };
      }),
    })),
}));
