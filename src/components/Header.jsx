export default function Header({ query, onQueryChange, stats, onAddTopic }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">?</span>
        <span>Question Sheet</span>
      </div>
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search questions..."
        />
        <kbd>/</kbd>
      </label>
      <div className="header-actions">
        <span className="stat">
          <strong>{stats.total}</strong> questions
        </span>
        <span className="stat">
          <strong>{stats.done}</strong> completed
        </span>
        <button
          className="button button-primary"
          type="button"
          onClick={onAddTopic}
        >
          + Add topic
        </button>
      </div>
    </header>
  );
}
