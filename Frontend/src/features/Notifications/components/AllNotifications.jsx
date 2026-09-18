import NotificationItem from "./NotificationItem.jsx";
import "./css/zAllNotification.css";
import { Hashtag2 } from "reicon-react";

const AllNotifications = ({ groupedNotifications }) => {

  if (Object.keys(groupedNotifications).length < 1) {
    return <div className="no_notification_warraper">
      <div className="no_notification_icon">
        < Hashtag2 size={60} />
      </div>
      <p>No notifications</p>
    </div>
  }

  return (
    <div className="notification_section_warraper">
      {Object.entries(groupedNotifications).map(
        ([day, notifications]) => (
          <section key={day} className="noti_sections">
            <h3>{day}</h3>

            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                noti={notification}
              />
            ))}
          </section>
        )
      )}
    </div>
  );
};

export default AllNotifications;