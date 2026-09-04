import { create } from "zustand";
import {
  createQuestion,
  createSubTopic,
  createTopic,
  deleteQuestion,
  deleteSubTopic,
  deleteTopic,
  reorderQuestions,
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
  reorderQuestions: async (topicId, subTopicId, startIndex, endIndex) =>
    set({
      topics: await reorderQuestions(topicId, subTopicId, startIndex, endIndex),
    }),
}));

export default useSheetStore;
