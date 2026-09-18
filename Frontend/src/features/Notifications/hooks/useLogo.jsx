import {
  Calendar,
  BookOpen,
  CheckSquare,
  CalendarDays,
  Flame,
  Settings,
  Hashtag2,
  Profile,
  Bell,
} from "reicon-react";

const notificationIcons = [
  { type: "timetable", icon: Calendar },
  { type: "class", icon: BookOpen },
  { type: "todo", icon: CheckSquare },
  { type: "event", icon: CalendarDays },
  { type: "habit", icon: Flame },
  { type: "system", icon: Settings },
  { type: "announcement", icon: Hashtag2 },
  { type: "user", icon: Profile },
];

export const useNotificationIcon = (type) => {
  const found = notificationIcons.find(
    (item) => item.type === type
  );

  return {
    Icon: found?.icon || Bell,
  };
};

// enum: ["timetable", "class", "todo", "event", "habit", "system", "announcement", "user"],