import React from 'react'
import "./Hero.css"

function Hero() {
  return (
    <div className='hero'>
        <div className="hero__overlay">
            <div className="hero__content">
                <h1 className='hero__content--text'>
                    Want to go camping?
                </h1>
                <h1 className='hero__content--text'>
                    We got your back!
                </h1>
                <button className="hero__content--action">Start Shopping</button>
            </div>
        </div>
    </div>
  )
}

export default Hero