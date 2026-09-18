export const ACCENT_COLORS = {
  "royal-blue": "#4f6ef7",
  "forest-green": "#3d8b62",
  "crimson-red": "#d64545",
}

export const applyAccentColor = (accent) => {
  const color = typeof accent === "string" ? ACCENT_COLORS[accent] : accent?.color
  if (!color) return false

  const root = document.documentElement
  root.style.setProperty("--accent-clr", color)
  root.style.setProperty("--accent-soft", `color-mix(in srgb, ${color} 16%, transparent)`)
  return true
}

export const getAccentColor = (accent) => ACCENT_COLORS[accent] || ACCENT_COLORS["royal-blue"]
