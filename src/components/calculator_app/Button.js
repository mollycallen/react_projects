const commonButtonClasses = 'w-100 fw-bold rounded-pill shadow'

export const NumberButton = ({ label, onClick, className = '' }) => {
  return (
    <button
      className={`btn btn-sprout fs-6 py-2 ${className} ${commonButtonClasses} `}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  )
}

export const OperatorButton = ({ label, onClick, className = '' }) => {
  return (
    <button
      className={`btn btn-lavender fs-5 py-1 ${className} ${commonButtonClasses} `}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  )
}
