
import { useContext } from "react";
import { NotificationContext } from "../context/notificationContext.jsx";

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }

  return ctx;
};