import { useEffect } from "react";
import { useState } from "react";

import AddEditModal from "./components/AddEditModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  ChevronRight,
  Search,
  House,
  Globe2,
  Lock,
  ClipboardList,
  Table2,
  Binoculars,
  FileCode2,
  NotepadText,
  CalendarDays,
  Trophy,
  CircleHelp,
  UserRound,
  Bell,
  SquarePlay,
  Star,
  Menu,
  ChevronDown,
} from "lucide-react";
SquarePlay;

import useSheetStore from "./store/useSheetStore";
import fetchSheet from "./services/api";

export default function App() {
  const {
    topics,
    addTopic,
    addSubTopic,
    addQuestion,
    deleteTopic,
    deleteSubTopic,
    deleteQuestion,
    reorderQuestions,
    reorderSubTopics,
    reorderTopics,
    setTopics,
  } = useSheetStore();
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [starredQuestions, setStarredQuestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("question-sheet-starred") ?? "{}");
    } catch {
      return {};
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [collapsedTopics, setCollapsedTopics] = useState({});
  useEffect(() => {
    fetchSheet().then(setTopics);
  }, [setTopics]);
  const toggleQuestion = (questionId) => {
    setCompletedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleStarredQuestion = (questionId) => {
    setStarredQuestions((previous) => {
      const next = {
        ...previous,
        [questionId]: !previous[questionId],
      };

      try {
        localStorage.setItem("question-sheet-starred", JSON.stringify(next));
      } catch {
        // Keep the in-memory state working if storage is unavailable.
      }

      return next;
    });
  };

  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "QUESTION") {
      const [topicId, subTopicId] = source.droppableId.split("::");
      reorderQuestions(topicId, subTopicId, source.index, destination.index);
      return;
    }

    if (type === "TOPIC") {
      const sourceTopic = filteredTopics[source.index];
      const destinationTopic = filteredTopics[destination.index];

      if (sourceTopic && destinationTopic) {
        reorderTopics(sourceTopic.id, destinationTopic.id);
      }
      return;
    }

    if (type === "SUBTOPIC" && source.droppableId === destination.droppableId) {
      const topic = filteredTopics.find(
        (item) => item.id === source.droppableId,
      );
      const sourceSubTopic = topic?.subTopics[source.index];
      const destinationSubTopic = topic?.subTopics[destination.index];

      if (sourceSubTopic && destinationSubTopic) {
        reorderSubTopics(topic.id, sourceSubTopic.id, destinationSubTopic.id);
      }
    }
  };

  const [sheetTitle, setSheetTitle] = useState("Striver SDE Sheet");
  const [sheetDescription, setSheetDescription] = useState(
    "Practice problems organized by topic and sub-topic",
  );

  const handleCreateTopic = async ({ title }) => {
    await addTopic(title);
    setModal(null);
  };

  const handleCreateSubTopic = async ({ title }) => {
    await addSubTopic(modal.topicId, title);
    setModal(null);
  };

  const filteredTopics = topics
    .map((topic) => {
      const query = searchQuery.trim().toLowerCase();
      const isFiltering = query.length > 0 || difficultyFilter !== "All";
      const topicMatches = topic.title.toLowerCase().includes(query);

      const filteredSubTopics = topic.subTopics
        .map((subTopic) => {
          const subTopicMatches = subTopic.title.toLowerCase().includes(query);
          const matchingDifficultyQuestions = subTopic.questions.filter(
            (question) =>
              difficultyFilter === "All" ||
              question.difficulty === difficultyFilter,
          );

          const filteredQuestions = matchingDifficultyQuestions.filter(
            (question) => question.title.toLowerCase().includes(query),
          );

          if (
            !isFiltering ||
            topicMatches ||
            subTopicMatches ||
            filteredQuestions.length > 0
          ) {
            return {
              ...subTopic,
              questions:
                !isFiltering || topicMatches || subTopicMatches
                  ? matchingDifficultyQuestions
                  : filteredQuestions,
            };
          }

          return null;
        })
        .filter(
          (subTopic) =>
            subTopic && (!isFiltering || subTopic.questions.length > 0),
        )
        .filter(Boolean);

      if (
        !isFiltering ||
        ((topicMatches || filteredSubTopics.length > 0) &&
          filteredSubTopics.some((subTopic) => subTopic.questions.length > 0))
      ) {
        return {
          ...topic,
          subTopics: filteredSubTopics,
        };
      }

      return null;
    })
    .filter(Boolean);

  const totalQuestions = topics.reduce(
    (sum, t) => sum + t.subTopics.reduce((s, st) => s + st.questions.length, 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#e8e9ec] font-[Inter,ui-sans-serif,system-ui]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[220px] border-r border-[#1a1c22] bg-[#0d0e12] transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[60px] items-center border-b border-[#1a1c22] px-5">
            <div className="flex items-center gap-2">
              <a
                href="https://codolio.com/"
                className="flex items-center"
                target=""
                rel="noreferrer"
              >
                <img src="/codolio.svg" alt="Codolio" className="h-8 w-auto" />
                <span className=" px-3 text-[20px] font-semibold tracking-tight text-white">
                  Codolio
                </span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="sidebar-navigation flex-1 overflow-y-auto px-3 py-4">
            {/* Home */}
            <nav className="mb-5">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-[#e8e9ee] transition hover:bg-[#15171d]">
                <House size={20} strokeWidth={1.7} />
                Home
              </button>
            </nav>

            {/* Profile Tracker */}
            <div className="mb-5">
              <div className="mb-1 flex items-center px-3">
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8b8d96]">
                  Profile Tracker
                </p>
                <div className="ml-2 h-px flex-1 bg-[#24252b]" />
              </div>

              <nav className="space-y-0.5">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#777980] transition hover:bg-[#15171d] hover:text-[#e8e9ee]">
                  <Globe2 size={20} strokeWidth={1.6} />
                  <span className="flex-1 text-left">Portfolio</span>
                  <Lock size={16} strokeWidth={1.6} />
                </button>
              </nav>
            </div>

            {/* Question Tracker */}
            <div className="mb-5">
              <div className="mb-1 flex items-center px-3">
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8b8d96]">
                  Question Tracker
                </p>
                <div className="ml-2 h-px flex-1 bg-[#24252b]" />
              </div>

              <nav className="space-y-0.5">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <ClipboardList size={20} strokeWidth={1.6} />
                  Company Wise Kit
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <Table2 size={20} strokeWidth={1.6} />
                  My Workspace
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <Binoculars size={20} strokeWidth={1.6} />
                  Explore Sheets
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#777980] transition hover:bg-[#15171d] hover:text-[#e8e9ee]">
                  <FileCode2 size={20} strokeWidth={1.6} />
                  <span className="flex-1 text-left">My Sheets</span>
                  <Lock size={16} strokeWidth={1.6} />
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#777980] transition hover:bg-[#15171d] hover:text-[#e8e9ee]">
                  <NotepadText size={20} strokeWidth={1.6} />
                  <span className="flex-1 text-left">Notes</span>
                  <Lock size={16} strokeWidth={1.6} />
                </button>
              </nav>
            </div>

            {/* Event Tracker */}
            <div className="mb-5">
              <div className="mb-1 flex items-center px-3">
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8b8d96]">
                  Event Tracker
                </p>
                <div className="ml-2 h-px flex-1 bg-[#24252b]" />
              </div>

              <nav>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <CalendarDays size={20} strokeWidth={1.6} />
                  Contests
                </button>
              </nav>
            </div>

            {/* Community */}
            <div className="mb-5">
              <div className="mb-1 flex items-center px-3">
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8b8d96]">
                  Community
                </p>
                <div className="ml-2 h-px flex-1 bg-[#24252b]" />
              </div>

              <nav>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <Trophy size={20} strokeWidth={1.6} />
                  Leaderboard
                </button>
              </nav>
            </div>

            {/* Support */}
            <div>
              <div className="mb-1 flex items-center px-3">
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8b8d96]">
                  Support
                </p>
                <div className="ml-2 h-px flex-1 bg-[#24252b]" />
              </div>

              <nav className="space-y-0.5">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <CircleHelp size={20} strokeWidth={1.6} />
                  Help Center
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-[#e8e9ee] transition hover:bg-[#15171d]">
                  <ClipboardList size={20} strokeWidth={1.6} />
                  Feedback
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Login */}
          <div className="border-t border-[#1a1c22] p-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff7100] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#ff7d19]">
              <UserRound size={18} strokeWidth={1.8} />
              Log In
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-[#0a0b0e]/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main */}
      <div
        className={`transition-[padding] duration-200 ${sidebarOpen ? "lg:pl-[220px]" : "lg:pl-0"}`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 min-h-[60px] border-b border-[#1a1c22] bg-[#0a0b0e]/95 backdrop-blur">
          <div className="flex min-h-[60px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-7">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                onClick={() => setSidebarOpen((open) => !open)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1f2128] bg-[#121317] text-[#8b8d96] transition hover:border-[#2a2d36] hover:text-[#e8e9ec]"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu size={16} />
              </button>
              <h1 className="truncate text-[15px] font-semibold text-[#f2f3f5]">
                Question Tracker Sheet
              </h1>
              <p className="mt-0.5 hidden text-[10.5px] text-[#5c5e68] md:block md:whitespace-nowrap">
                This masterpiece was made by Ishaan Pandey
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#1f2128] bg-[#121317] text-[#8b8d96] transition hover:border-[#2a2d36] hover:text-[#e8e9ec] sm:flex">
                <Bell size={15} />
              </button>

              <button
                type="button"
                onClick={() => setModal({ kind: "topic" })}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#ff7100] px-3 py-2 text-[12px] font-semibold text-[#06110d] shadow-[0_0_0_1px_rgba(0,211,167,0.3)] transition hover:bg-[#1fe0b8] active:scale-[0.97] sm:px-4"
              >
                <Plus size={14} strokeWidth={2.5} />
                Add Topic
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-[1100px] px-5 py-6 lg:px-8">
          {/* Sheet Header */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#1a1c22] bg-[#0d0e12] px-5 py-4">
            {/* Sheet Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sheetTitle}
                  onChange={(e) => setSheetTitle(e.target.value)}
                  placeholder="Sheet title"
                  className="w-auto min-w-[180px] max-w-[400px] bg-transparent text-[17px] font-semibold text-[#f2f3f5] outline-none placeholder:text-[#5c5e68]"
                />

                <span className="rounded-full border border-[#ff7100]/25 bg-[#ff7100]/10 px-2.5 py-0.5 text-[10px] font-medium text-white">
                  {topics.length} Topics
                </span>

                <span className="rounded-full border border-[#1f2128] bg-[#121317] px-2.5 py-0.5 text-[10px] font-medium text-[#8b8d96]">
                  {totalQuestions} Questions
                </span>
              </div>

              <input
                type="text"
                value={sheetDescription}
                onChange={(e) => setSheetDescription(e.target.value)}
                placeholder="Add a description..."
                className="mt-1 w-full max-w-[600px] bg-transparent text-[11.5px] text-[#8b8d96] outline-none placeholder:text-[#5c5e68]"
              />
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative hidden w-[240px] md:block">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c5e68]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="h-9 w-full rounded-full border border-[#1f2128] bg-[#121317] pl-9 pr-9 text-[12px] text-[#e8e9ec] outline-none transition placeholder:text-[#5c5e68] hover:border-[#2a2d36] focus:border-[#ff7100]/50 focus:bg-[#15171d]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5c5e68] transition hover:text-[#c7c9d0]"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Difficulty Filters */}
              <div className="hidden items-center gap-1.5 sm:flex">
                {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                    aria-pressed={difficultyFilter === difficulty}
                    className={
                      difficultyFilter === difficulty
                        ? "rounded-full bg-[#ff7100]/10 px-3 py-1.5 text-[11px] font-medium text-[#ff7100]"
                        : "rounded-full border border-[#1f2128] bg-[#121317] px-3 py-1.5 text-[11px] text-[#8b8d96] transition hover:border-[#2a2d36] hover:text-[#d5d6db]"
                    }
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics */}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="TOPICS" type="TOPIC">
              {(topicDropProvided) => (
                <div
                  {...topicDropProvided.droppableProps}
                  ref={topicDropProvided.innerRef}
                  className="space-y-3.5"
                >
                  {filteredTopics.map((topic, topicIndex) => {
                    const topicQuestionCount = topic.subTopics.reduce(
                      (total, sub) => total + sub.questions.length,
                      0,
                    );

                    const completedCount = topic.subTopics.reduce(
                      (total, sub) =>
                        total +
                        sub.questions.filter((q) => completedQuestions[q.id])
                          .length,
                      0,
                    );

                    const progress =
                      topicQuestionCount > 0
                        ? Math.round(
                            (completedCount / topicQuestionCount) * 100,
                          )
                        : 0;

                    return (
                      <Draggable
                        key={topic.id}
                        draggableId={topic.id}
                        index={topicIndex}
                      >
                        {(topicProvided) => (
                          <div
                            ref={topicProvided.innerRef}
                            {...topicProvided.draggableProps}
                            className="overflow-hidden rounded-2xl border border-[#1a1c22] bg-[#0d0e12]"
                          >
                            {/* Topic Header */}
                            <div className="flex items-center justify-between gap-4 border-b border-[#1a1c22] px-4 py-3.5">
                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                <span
                                  {...topicProvided.dragHandleProps}
                                  className="cursor-grab text-[#3d3f47]"
                                  title="Drag topic"
                                >
                                  <GripVertical size={15} />
                                </span>
                                <div>
                                  <h2 className="text-[13.5px] font-semibold text-[#e8e9ec]">
                                    {topic.title}
                                  </h2>
                                  <p className="mt-0.5 text-[10.5px] text-[#5c5e68]">
                                    {topicQuestionCount} questions
                                  </p>
                                </div>

                                {/* progress bar */}
                                <div className="ml-2 hidden items-center gap-2 sm:flex">
                                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#181a20]">
                                    <div
                                      className="h-full rounded-full bg-[#ff7100] transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>

                                  <span className="min-w-[32px] text-[10px] font-medium text-[#5c5e68]">
                                    {progress}%
                                  </span>
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCollapsedTopics((previous) => ({
                                      ...previous,
                                      [topic.id]: !previous[topic.id],
                                    }))
                                  }
                                  className="rounded-full p-2 text-[#5c5e68] transition hover:bg-[#121317] hover:text-[#e8e9ec]"
                                  aria-label={
                                    collapsedTopics[topic.id]
                                      ? `Expand ${topic.title}`
                                      : `Minimize ${topic.title}`
                                  }
                                  title={
                                    collapsedTopics[topic.id]
                                      ? "Expand topic"
                                      : "Minimize topic"
                                  }
                                >
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform ${collapsedTopics[topic.id] ? "-rotate-90" : ""}`}
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    setModal({
                                      kind: "subtopic",
                                      topicId: topic.id,
                                    })
                                  }
                                  className="flex items-center gap-1.5 rounded-full border border-[#1f2128] bg-[#121317] px-3 py-1.5 text-[10.5px] font-medium text-[#ff7100] transition hover:border-[#ff7100]/40 hover:bg-[#ff7100]/10"
                                >
                                  <Plus size={12} />
                                  Sub-topic
                                </button>

                                <button
                                  onClick={() => deleteTopic(topic.id)}
                                  className="rounded-full p-2 text-[#5c5e68] transition hover:bg-[#2a1418] hover:text-[#f2687a]"
                                  title="Delete topic"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Subtopics */}
                            {!collapsedTopics[topic.id] && (
                              <Droppable droppableId={topic.id} type="SUBTOPIC">
                                {(subTopicDropProvided) => (
                                  <div
                                    {...subTopicDropProvided.droppableProps}
                                    ref={subTopicDropProvided.innerRef}
                                    className="divide-y divide-[#161820]"
                                  >
                                    {topic.subTopics.map(
                                      (subTopic, subTopicIndex) => (
                                        <Draggable
                                          key={subTopic.id}
                                          draggableId={subTopic.id}
                                          index={subTopicIndex}
                                        >
                                          {(subTopicProvided) => (
                                            <div
                                              ref={subTopicProvided.innerRef}
                                              {...subTopicProvided.draggableProps}
                                            >
                                              {/* Subtopic header */}
                                              <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                  <span
                                                    {...subTopicProvided.dragHandleProps}
                                                    className="cursor-grab text-[#3d3f47]"
                                                    title="Drag subtopic"
                                                  >
                                                    <GripVertical size={14} />
                                                  </span>
                                                  <ChevronRight
                                                    size={13}
                                                    className="text-[#5c5e68]"
                                                  />
                                                  <h3 className="text-[11.5px] font-medium text-[#b0b2ba]">
                                                    {subTopic.title}
                                                  </h3>
                                                  <span className="rounded-full bg-[#161820] px-2 py-0.5 text-[9.5px] text-[#6a6d78]">
                                                    {subTopic.questions.length}
                                                  </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                  <button
                                                    onClick={() =>
                                                      setModal({
                                                        kind: "question",
                                                        topicId: topic.id,
                                                        subTopicId: subTopic.id,
                                                      })
                                                    }
                                                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium text-[#ff7100] transition hover:bg-[#ff7100]/10"
                                                  >
                                                    <Plus size={11} />
                                                    Add
                                                  </button>

                                                  <button
                                                    onClick={() =>
                                                      deleteSubTopic(
                                                        topic.id,
                                                        subTopic.id,
                                                      )
                                                    }
                                                    className="rounded-full p-1.5 text-[#565962] transition hover:bg-[#2a1418] hover:text-[#f2687a]"
                                                    title="Delete sub-topic"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Questions */}
                                              <Droppable
                                                droppableId={`${topic.id}::${subTopic.id}`}
                                                type="QUESTION"
                                              >
                                                {(provided) => (
                                                  <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="px-3 pb-3"
                                                  >
                                                    {subTopic.questions.map(
                                                      (q, index) => (
                                                        <Draggable
                                                          key={q.id}
                                                          draggableId={q.id}
                                                          index={index}
                                                        >
                                                          {(provided) => (
                                                            <div
                                                              ref={
                                                                provided.innerRef
                                                              }
                                                              {...provided.draggableProps}
                                                              className="group flex min-h-[42px] items-center justify-between rounded-xl border border-transparent px-1.5 hover:border-[#1f2128] hover:bg-[#121317] sm:px-2.5"
                                                            >
                                                              <div className="flex min-w-0 items-center gap-2.5">
                                                                <span
                                                                  {...provided.dragHandleProps}
                                                                  className="cursor-grab text-[#3d3f47] transition"
                                                                >
                                                                  <GripVertical
                                                                    size={14}
                                                                  />
                                                                </span>

                                                                {/* solved indicator */}
                                                                <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                    toggleQuestion(
                                                                      q.id,
                                                                    )
                                                                  }
                                                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition ${
                                                                    completedQuestions[
                                                                      q.id
                                                                    ]
                                                                      ? "border-[#ff7100] bg-[#ff7100] text-[#06110d]"
                                                                      : "border-[#2a2d36] bg-[#121317] group-hover:border-[#ff7100]/50"
                                                                  }`}
                                                                  aria-label={
                                                                    completedQuestions[
                                                                      q.id
                                                                    ]
                                                                      ? `Mark ${q.title} as unsolved`
                                                                      : `Mark ${q.title} as solved`
                                                                  }
                                                                >
                                                                  {completedQuestions[
                                                                    q.id
                                                                  ] && (
                                                                    <svg
                                                                      viewBox="0 0 12 12"
                                                                      className="h-3 w-3"
                                                                      fill="none"
                                                                      stroke="currentColor"
                                                                      strokeWidth="2"
                                                                    >
                                                                      <path d="M2.5 6l2.2 2.2L9.5 3.5" />
                                                                    </svg>
                                                                  )}
                                                                </button>
                                                                <a
                                                                  href={
                                                                    q.leetcodeUrl ??
                                                                    q.url ??
                                                                    "#"
                                                                  }
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                  className="flex min-w-0 items-center gap-1.5 truncate text-[12px] font-medium text-[#c7c9d0] transition hover:text-[#ff7100]"
                                                                >
                                                                  <span
                                                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#ffa116] text-[8px] font-bold text-[#0a0b0e]"
                                                                    title="Open LeetCode problem"
                                                                  >
                                                                    LC
                                                                  </span>
                                                                  <span className="truncate">
                                                                    {q.title}
                                                                  </span>
                                                                  <ExternalLink
                                                                    size={10}
                                                                    className="shrink-0 text-[#565962]"
                                                                  />
                                                                </a>

                                                                {q.youtubeUrl && (
                                                                  <a
                                                                    href={
                                                                      q.youtubeUrl
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="shrink-0 rounded p-1 text-[#ff4d5f] transition hover:bg-[#2a1418] hover:text-[#ff7180]"
                                                                    aria-label={`Watch ${q.title} on YouTube`}
                                                                    title="Watch solution on YouTube"
                                                                  >
                                                                    <SquarePlay
                                                                      size={14}
                                                                    />
                                                                  </a>
                                                                )}
                                                              </div>

                                                              <div className="ml-1 flex shrink-0 items-center gap-1 sm:ml-3 sm:gap-2">
                                                                <span
                                                                  className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-medium sm:px-2.5 ${
                                                                    q.difficulty ===
                                                                    "Easy"
                                                                      ? "bg-[#0f2e22] text-[#3ddc97]"
                                                                      : q.difficulty ===
                                                                          "Medium"
                                                                        ? "bg-[#332a10] text-[#e8b23d]"
                                                                        : "bg-[#331416] text-[#f2687a]"
                                                                  }`}
                                                                >
                                                                  {q.difficulty}
                                                                </span>

                                                                <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                    toggleStarredQuestion(
                                                                      q.id,
                                                                    )
                                                                  }
                                                                  className={`hidden rounded-full p-1 transition hover:bg-[#332a10] sm:inline-flex ${starredQuestions[q.id] ? "text-[#e8b23d]" : "text-[#4a4c54] hover:text-[#e8b23d]"}`}
                                                                  aria-label={
                                                                    starredQuestions[
                                                                      q.id
                                                                    ]
                                                                      ? `Remove ${q.title} from starred questions`
                                                                      : `Star ${q.title}`
                                                                  }
                                                                  title={
                                                                    starredQuestions[
                                                                      q.id
                                                                    ]
                                                                      ? "Unstar question"
                                                                      : "Star question"
                                                                  }
                                                                >
                                                                  <Star
                                                                    size={13}
                                                                    fill={
                                                                      starredQuestions[
                                                                        q.id
                                                                      ]
                                                                        ? "currentColor"
                                                                        : "none"
                                                                    }
                                                                  />
                                                                </button>

                                                                <button
                                                                  onClick={() =>
                                                                    deleteQuestion(
                                                                      topic.id,
                                                                      subTopic.id,
                                                                      q.id,
                                                                    )
                                                                  }
                                                                  className="rounded-full p-1 text-[#4a4c54] opacity-50 transition group-hover:opacity-100 hover:bg-[#2a1418] hover:text-[#f2687a]"
                                                                  aria-label={`Delete ${q.title}`}
                                                                  title="Delete question"
                                                                >
                                                                  <Trash2
                                                                    size={12}
                                                                  />
                                                                </button>
                                                              </div>
                                                            </div>
                                                          )}
                                                        </Draggable>
                                                      ),
                                                    )}
                                                    {provided.placeholder}
                                                  </div>
                                                )}
                                              </Droppable>
                                            </div>
                                          )}
                                        </Draggable>
                                      ),
                                    )}
                                    {subTopicDropProvided.placeholder}

                                    {/* Add subtopic */}
                                    <button
                                      onClick={() =>
                                        setModal({
                                          kind: "subtopic",
                                          topicId: topic.id,
                                        })
                                      }
                                      className="flex w-full items-center gap-2 px-5 py-3 text-[10.5px] font-medium text-[#565962] transition hover:bg-[#121317] hover:text-[#ff7100]"
                                    >
                                      <Plus size={12} />
                                      Add Sub-topic
                                    </button>
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {topicDropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
      </div>

      {/* Modals */}
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
          onSubmit={handleCreateTopic}
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
          onSubmit={handleCreateSubTopic}
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
              required: true,
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
