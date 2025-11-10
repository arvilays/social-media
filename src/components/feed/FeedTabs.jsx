import "../../styles/feedTabs.css";

export const FeedTabs = ({ activeTab, tabs, onTabChange }) => (
  <div className="feed-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={activeTab === tab.value ? "active" : ""}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
