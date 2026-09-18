const DUMMY_CLASS_LOGS = [
  { _id: "66a1f0a1b2c3d4e5f6071001", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440001", title: "Math", date: "2026-08-09", isAttend: true, createdAt: "2026-08-09T09:05:00.000Z", updatedAt: "2026-08-09T09:05:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071002", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440002", title: "Physics", date: "2026-08-09", isAttend: true, createdAt: "2026-08-09T11:02:00.000Z", updatedAt: "2026-08-09T11:02:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071003", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440003", title: "Chemistry", date: "2026-08-09", isAttend: false, createdAt: "2026-08-09T13:10:00.000Z", updatedAt: "2026-08-09T13:10:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f6071004", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440001", title: "Math", date: "2026-08-10", isAttend: true, createdAt: "2026-08-10T09:03:00.000Z", updatedAt: "2026-08-10T09:03:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071005", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440004", title: "English", date: "2026-08-10", isAttend: true, createdAt: "2026-08-10T15:20:00.000Z", updatedAt: "2026-08-10T15:20:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f6071006", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440002", title: "Physics", date: "2026-08-11", isAttend: false, createdAt: "2026-08-11T11:00:00.000Z", updatedAt: "2026-08-11T11:00:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071007", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440003", title: "Chemistry", date: "2026-08-11", isAttend: true, createdAt: "2026-08-11T13:08:00.000Z", updatedAt: "2026-08-11T13:08:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071008", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440004", title: "English", date: "2026-08-11", isAttend: true, createdAt: "2026-08-11T15:15:00.000Z", updatedAt: "2026-08-11T15:15:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f6071009", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440001", title: "Math", date: "2026-08-12", isAttend: true, createdAt: "2026-08-12T09:04:00.000Z", updatedAt: "2026-08-12T09:04:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f607100a", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440002", title: "Physics", date: "2026-08-12", isAttend: true, createdAt: "2026-08-12T11:01:00.000Z", updatedAt: "2026-08-12T11:01:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f607100b", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440003", title: "Chemistry", date: "2026-08-13", isAttend: false, createdAt: "2026-08-13T13:12:00.000Z", updatedAt: "2026-08-13T13:12:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f607100c", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440004", title: "English", date: "2026-08-13", isAttend: true, createdAt: "2026-08-13T15:18:00.000Z", updatedAt: "2026-08-13T15:18:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f607100d", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440001", title: "Math", date: "2026-08-13", isAttend: true, createdAt: "2026-08-13T09:06:00.000Z", updatedAt: "2026-08-13T09:06:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f607100e", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440002", title: "Physics", date: "2026-08-14", isAttend: true, createdAt: "2026-08-14T11:03:00.000Z", updatedAt: "2026-08-14T11:03:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f607100f", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440003", title: "Chemistry", date: "2026-08-14", isAttend: true, createdAt: "2026-08-14T13:14:00.000Z", updatedAt: "2026-08-14T13:14:00.000Z" },

  { _id: "66a1f0a1b2c3d4e5f6071010", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440004", title: "English", date: "2026-08-15", isAttend: false, createdAt: "2026-08-15T15:22:00.000Z", updatedAt: "2026-08-15T15:22:00.000Z" },
  { _id: "66a1f0a1b2c3d4e5f6071011", userId: "665f1a2b3c4d5e6f7a8b9c0d", subjectId: "550e8400-e29b-41d4-a716-446655440001", title: "Math", date: "2026-08-15", isAttend: true, createdAt: "2026-08-15T09:07:00.000Z", updatedAt: "2026-08-15T09:07:00.000Z" },
]

export default DUMMY_CLASS_LOGS