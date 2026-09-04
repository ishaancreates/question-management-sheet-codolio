const SHEET_URL = import.meta.env.VITE_SHEET_API_URL;
const STORAGE_KEY = "question-sheet-data";

const fallbackSheet = [
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
            url: "https://leetcode.com/problems/two-sum/",
            difficulty: "Easy",
          },
          {
            id: "q-2",
            title: "Valid Anagram",
            url: "https://leetcode.com/problems/valid-anagram/",
            difficulty: "Easy",
          },
        ],
      },
    ],
  },
];

function readStoredSheet() {
  try {
    const storedSheet = localStorage.getItem(STORAGE_KEY);
    return storedSheet ? JSON.parse(storedSheet) : null;
  } catch (error) {
    console.error("Failed to read saved sheet:", error);
    return null;
  }
}

function saveSheet() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localSheet));
  } catch (error) {
    console.error("Failed to save sheet:", error);
  }

  return clone(localSheet);
}

const storedSheet = readStoredSheet();
let localSheet = Array.isArray(storedSheet)
  ? storedSheet
  : structuredClone(fallbackSheet);

const clone = (value) => structuredClone(value);

const isYoutubeUrl = (value) =>
  typeof value === "string" && /(?:youtube\.com|youtu\.be)/i.test(value);

function getRemoteQuestions(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data?.questions ?? payload?.data?.sheet?.questions ?? [];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\W+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRemoteSheet(payload) {
  const topics = new Map();

  const questions = getRemoteQuestions(payload);

  questions.forEach((item, index) => {
    const question = item?.questionId ?? item ?? {};

    const topicTitle = item?.topic ?? "Uncategorized";
    const subTopicTitle = item?.subTopic ?? "General";

    const topicId = `topic-${slugify(topicTitle)}`;
    const subTopicId = `${topicId}-sub-${slugify(subTopicTitle)}`;

    let topic = topics.get(topicId);

    if (!topic) {
      topic = {
        id: topicId,
        title: topicTitle,
        subTopics: [],
      };

      topics.set(topicId, topic);
    }

    let subTopic = topic.subTopics.find(
      (subTopic) => subTopic.id === subTopicId,
    );

    if (!subTopic) {
      subTopic = {
        id: subTopicId,
        title: subTopicTitle,
        questions: [],
      };

      topic.subTopics.push(subTopic);
    }

    subTopic.questions.push({
      id: item?._id ?? question?.id ?? `question-${index}`,

      title: item?.title ?? question?.name ?? "Untitled question",

      leetcodeUrl: question?.problemUrl ?? item?.problemUrl ?? "#",

      youtubeUrl: isYoutubeUrl(item?.resource) ? item.resource : null,

      difficulty: question?.difficulty ?? item?.difficulty ?? "Medium",
    });
  });

  return Array.from(topics.values());
}

export default async function fetchSheet() {
  if (Array.isArray(storedSheet)) {
    return clone(localSheet);
  }

  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error(`Sheet request failed: ${response.status}`);
    }

    const payload = await response.json();

    const remoteSheet = normalizeRemoteSheet(payload);

    if (remoteSheet.length > 0) {
      localSheet = remoteSheet;
    }

    return saveSheet();
  } catch (error) {
    console.error("Failed to fetch sheet:", error);

    return saveSheet();
  }
}

export async function createTopic(title) {
  localSheet = [
    {
      id: `topic-${crypto.randomUUID()}`,
      title,
      subTopics: [],
    },
    ...localSheet,
  ];

  return saveSheet();
}

export async function updateTopic(topicId, changes) {
  localSheet = localSheet.map((topic) =>
    topic.id === topicId
      ? {
          ...topic,
          ...changes,
        }
      : topic,
  );

  return saveSheet();
}

export async function deleteTopic(topicId) {
  localSheet = localSheet.filter((topic) => topic.id !== topicId);

  return saveSheet();
}

export async function createSubTopic(topicId, title) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: [
        {
          id: `sub-${crypto.randomUUID()}`,
          title,
          questions: [],
        },
        ...topic.subTopics,
      ],
    };
  });

  return saveSheet();
}

export async function updateSubTopic(topicId, subTopicId, changes) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.map((subTopic) =>
        subTopic.id === subTopicId
          ? {
              ...subTopic,
              ...changes,
            }
          : subTopic,
      ),
    };
  });

  return saveSheet();
}

export async function deleteSubTopic(topicId, subTopicId) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.filter(
        (subTopic) => subTopic.id !== subTopicId,
      ),
    };
  });

  return saveSheet();
}

export async function createQuestion(topicId, subTopicId, data) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.map((subTopic) => {
        if (subTopic.id !== subTopicId) {
          return subTopic;
        }

        return {
          ...subTopic,
          questions: [
            {
              id: `question-${crypto.randomUUID()}`,
              ...data,
              leetcodeUrl: data.leetcodeUrl ?? data.url ?? "#",
              youtubeUrl: data.youtubeUrl ?? null,
            },
            ...subTopic.questions,
          ],
        };
      }),
    };
  });

  return saveSheet();
}

export async function updateQuestion(topicId, subTopicId, questionId, changes) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.map((subTopic) => {
        if (subTopic.id !== subTopicId) {
          return subTopic;
        }

        return {
          ...subTopic,
          questions: subTopic.questions.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  ...changes,
                }
              : question,
          ),
        };
      }),
    };
  });

  return saveSheet();
}

export async function deleteQuestion(topicId, subTopicId, questionId) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.map((subTopic) => {
        if (subTopic.id !== subTopicId) {
          return subTopic;
        }

        return {
          ...subTopic,
          questions: subTopic.questions.filter(
            (question) => question.id !== questionId,
          ),
        };
      }),
    };
  });

  return saveSheet();
}

export async function reorderQuestions(
  topicId,
  subTopicId,
  startIndex,
  endIndex,
) {
  localSheet = localSheet.map((topic) => {
    if (topic.id !== topicId) {
      return topic;
    }

    return {
      ...topic,
      subTopics: topic.subTopics.map((subTopic) => {
        if (subTopic.id !== subTopicId) {
          return subTopic;
        }

        const questions = [...subTopic.questions];
        const [movedQuestion] = questions.splice(startIndex, 1);
        questions.splice(endIndex, 0, movedQuestion);

        return {
          ...subTopic,
          questions,
        };
      }),
    };
  });

  return saveSheet();
}
