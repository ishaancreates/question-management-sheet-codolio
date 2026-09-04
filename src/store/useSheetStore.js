import { create } from "zustand";
import {
  createQuestion,
  createSubTopic,
  createTopic,
  deleteQuestion,
  deleteSubTopic,
  deleteTopic,
  updateQuestion,
  updateSubTopic,
  updateTopic,
} from "../services/api";

 const useSheetStore = create((set) => ({
  topics: [],
  isLoading: false,

  setTopics: (topics) => set({ topics }),

  // Topic CRUD
  addTopic: async (title) => set({ topics: await createTopic(title) }),
  updateTopic: async (topicId, changes) =>
    set({ topics: await updateTopic(topicId, changes) }),
  deleteTopic: async (topicId) => set({ topics: await deleteTopic(topicId) }),

  addSubTopic: async (topicId, title) =>
    set({ topics: await createSubTopic(topicId, title) }),
  updateSubTopic: async (topicId, subTopicId, changes) =>
    set({ topics: await updateSubTopic(topicId, subTopicId, changes) }),
  deleteSubTopic: async (topicId, subTopicId) =>
    set({ topics: await deleteSubTopic(topicId, subTopicId) }),

  addQuestion: async (topicId, subTopicId, data) =>
    set({ topics: await createQuestion(topicId, subTopicId, data) }),
  updateQuestion: async (topicId, subTopicId, questionId, changes) =>
    set({
      topics: await updateQuestion(topicId, subTopicId, questionId, changes),
    }),
  deleteQuestion: async (topicId, subTopicId, questionId) =>
    set({ topics: await deleteQuestion(topicId, subTopicId, questionId) }),

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

export default useSheetStore;