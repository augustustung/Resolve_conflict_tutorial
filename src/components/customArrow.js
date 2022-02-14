import React from 'react'

function CustomArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#f5f5f5" }}
      onClick={onClick}
    >
      <i class="fas fa-caret-square-left"></i>
    </div>
  )
}

export default CustomArrow
