import React from 'react'

const COLORS = [
  "#F87171", "#FB923C", "#FBBF24", "#4ADE80",
  "#2DD4BF", "#38BDF8", "#818CF8", "#C084FC", "#F472B6",
]

const getColorFromName = (name = "") => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

const Avtar = ({ username, imgUrl, size = 36 }) => {
  const hasImage = Boolean(imgUrl)
  const initial = username?.[0]?.toUpperCase() || "?"

  if (hasImage) {
    return (
      <img
        src={imgUrl}
        alt={username}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getColorFromName(username),
        color: "#fff",
        fontWeight: 600,
        fontSize: size * 0.45,
        flexShrink: 0,
      }}
    >{initial}</div>
  )
}

export default Avtar