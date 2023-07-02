import './MainButton.css'

export default function MainButton({ onClick, label }) {
  return (
    <div>
      <button className = "main-button" onClick={onClick}>
        {label}
      </button>
    </div>
  )
}