import React from 'react'
import "./style.css"
function Linetext({linetext}) {
  return (
      <div className="line-container">
          <hr className="line" />
          <span className="line-text">{linetext}</span>
          <hr className="line" />
        </div>
  )
}

export default Linetext
