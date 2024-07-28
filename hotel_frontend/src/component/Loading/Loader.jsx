import React from 'react';
import './loader.css'

const Loader = ({ isVisible }) => {
  const text = 'Loading...';
  return (
    isVisible && (
      <div className="loader">
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
          className="loader-char"
        >
          {char}
        </span>
      ))}
    </div>
    )
  )
}

export default Loader