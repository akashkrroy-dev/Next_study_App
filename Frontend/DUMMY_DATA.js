const day = 24 * 60 * 60 * 1000

export const dummyNotifications = [
  // --- Today ---
  { _id: "n1", type: "class", title: "Class starting soon", message: "Data Structures starts in 15 minutes — Room 204.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000) },
  { _id: "n2", type: "class", title: "Class cancelled", message: "DBMS lab today has been cancelled by the faculty.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { _id: "n3", type: "todo", title: "Todo due soon", message: "\"Finish OS assignment\" is due in 3 hours.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { _id: "n4", type: "todo", title: "Todo overdue", message: "\"Submit lab report\" was due yesterday and is still pending.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { _id: "n5", type: "exam", title: "Upcoming exam", message: "DBMS mid-sem starts tomorrow at 10:00 AM.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  { _id: "n6", type: "user", title: "Habit reminder", message: "You haven't logged today's study session yet.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { _id: "n7", type: "system", title: "Important message", message: "Your account email was verified successfully.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { _id: "n8", type: "class", title: "Class rescheduled", message: "Operating Systems moved from 2 PM to 4 PM today.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000) },

  // --- Yesterday ---
  { _id: "n9", type: "todo", title: "Todo completed", message: "\"Revise chapter 4\" marked as done.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 1 * 60 * 60 * 1000) },
  { _id: "n10", type: "announcement", title: "Event updated", message: "Workshop on Web Dev moved to Seminar Hall B.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 3 * 60 * 60 * 1000) },
  { _id: "n11", type: "announcement", title: "Event cancelled", message: "Guest lecture on AI has been cancelled.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 5 * 60 * 60 * 1000) },
  { _id: "n12", type: "user", title: "Habit completed", message: "You completed your daily coding practice.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 7 * 60 * 60 * 1000) },
  { _id: "n13", type: "user", title: "7-day streak reached", message: "You've kept your study habit going for a full week.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 9 * 60 * 60 * 1000) },
  { _id: "n14", type: "system", title: "Timetable updated", message: "Your semester timetable was updated by the admin.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 11 * 60 * 60 * 1000) },
  { _id: "n15", type: "class", title: "Class starting soon", message: "Discrete Math starts in 15 minutes — Room 101.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 1 * day - 13 * 60 * 60 * 1000) },

  // --- This week (2-6 days ago) ---
  { _id: "n16", type: "todo", title: "Todo due soon", message: "\"Prepare presentation slides\" is due in 2 days.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 2 * day) },
  { _id: "n17", type: "todo", title: "Todo overdue", message: "\"Plan weekend trip\" is 2 days overdue.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 2 * day - 6 * 60 * 60 * 1000) },
  { _id: "n18", type: "class", title: "Class cancelled", message: "Compiler Design lecture cancelled due to faculty leave.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 3 * day) },
  { _id: "n19", type: "announcement", title: "Upcoming event", message: "Coding club meetup this Friday at 5 PM.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 3 * day - 4 * 60 * 60 * 1000) },
  { _id: "n20", type: "user", title: "Habit reminder", message: "Don't forget to log your reading habit today.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 4 * day) },
  { _id: "n21", type: "system", title: "Important message", message: "New feature: dark mode is now available in Settings.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 4 * day - 8 * 60 * 60 * 1000) },
  { _id: "n22", type: "class", title: "Class updated", message: "Networks lab shifted to Lab 3 this week.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 5 * day) },
  { _id: "n23", type: "announcement", title: "Event updated", message: "Hackathon registration deadline extended to Sunday.", isRead: false, scheduledFor: null, createdAt: new Date(Date.now() - 5 * day - 5 * 60 * 60 * 1000) },
  { _id: "n24", type: "user", title: "Habit completed", message: "You completed your daily exercise habit.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 6 * day) },
  { _id: "n25", type: "todo", title: "Todo completed", message: "\"Reply to client email\" marked as done.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 6 * day - 10 * 60 * 60 * 1000) },

  // --- Older (7+ days ago) ---
  { _id: "n26", type: "system", title: "Timetable updated", message: "Second-semester timetable was published.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 9 * day) },
  { _id: "n27", type: "announcement", title: "Event cancelled", message: "Orientation session postponed indefinitely.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 11 * day) },
  { _id: "n28", type: "user", title: "30-day streak reached", message: "You've maintained your habit for a full month.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 14 * day) },
  { _id: "n29", type: "class", title: "Class starting soon", message: "Orientation class starts in 15 minutes.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 20 * day) },
  { _id: "n30", type: "todo", title: "Todo due soon", message: "\"Set up study schedule\" was due in 2 days.", isRead: true, scheduledFor: null, createdAt: new Date(Date.now() - 25 * day) },
]