import React, { useState } from "react";
import AllNotifications from "./components/AllNotifications.jsx";
import { useNotifications } from "./hooks/useNotification.js";
import Header from "../../components/ui/Header.jsx";
import Button from "../../components/ui/buttons/Button.jsx";
import "./Notification.css";

const options = ["all", "unseen", "seen"];

const Notification = () => {
  const [page, setPage] = useState("all");
  const { grouped, loading, error, markAllAsRead, unreadCount } = useNotifications();

  const currentNotifications = grouped[page];

  return (
    <div className="notification_page_layout_wrapper">
      <div className="header_part">
        <div className="notification_heading">
          <Header name="notifications" />
          <Button text="Mark all as seen" onClick={markAllAsRead} threshold={600} disabled={!unreadCount} />
        </div>

        <div className="notification_tabs">
          {options.map((op) => (
            <button
              key={op}
              onClick={() => setPage(op)}
              className={page === op ? "active" : ""}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="notification_container">
        {loading ? <div className="state_msg">Loading…</div> : error ? <div className="state_msg">Something went wrong.</div> : <AllNotifications groupedNotifications={currentNotifications} />}
      </div>
    </div>
  );
};

export default Notification;