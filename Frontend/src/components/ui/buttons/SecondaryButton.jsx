import "./css/zSecondaryButton.css"
const SecondaryButton = ({ text, icon: Icon, onClick, disabled = false, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      className={`secondary-btn${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="secondary-btn__icon" size={16} />}
      {text && <span>{text}</span>}
    </button>
  )
}

export default SecondaryButton