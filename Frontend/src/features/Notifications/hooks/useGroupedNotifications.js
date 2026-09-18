import { useMemo } from "react";

function groupByDay(notifications) {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const groups = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Older: [],
  };

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);

    if (date >= startOfToday) {
      groups.Today.push(notification);
    } else if (date >= startOfYesterday) {
      groups.Yesterday.push(notification);
    } else if (date >= startOfWeek) {
      groups["This week"].push(notification);
    } else {
      groups.Older.push(notification);
    }
  }

  return Object.fromEntries(
    Object.entries(groups).filter(([, items]) => items.length > 0)
  );
}


function makeGroups(notifications) {
  const seen = [];
  const unseen = [];

  for (const notification of notifications) {
    if (notification.isRead) {
      seen.push(notification);
    } else {
      unseen.push(notification);
    }
  }

  return {
    all: groupByDay(notifications),
    seen: groupByDay(seen),
    unseen: groupByDay(unseen),
  };
}


export function useGroupedNotifications(notifications) {

  const grouped = useMemo(() => {
    return makeGroups(notifications);
  }, [notifications]);


  return {
    all: grouped.all,
    seen: grouped.seen,
    unseen: grouped.unseen,
  };
}