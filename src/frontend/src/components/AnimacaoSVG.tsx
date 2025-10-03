import React from 'react';
import './Animacao.css'; 

const AnimacaoSVG: React.FC = () => {
  return (
    <div className="svgContainer">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 636 636.4"
      >
        
        <g id="circle-r">
          <circle className="cls-1" cx="318" cy="318.2" r="318" />
          <circle className="cls-2" cx="318" cy="318.2" r="263.8" />
          <circle className="cls-3" cx="318" cy="318.2" r="215.6" />
        </g>

        <g id="paper">
        <rect className="cls-4" x="225" y="172.2" width="190.5" height="280.5" rx="15.6" />
        <rect className="cls-5" x="225" y="177.3" width="180.3" height="270.3" rx="13.5" />
        </g>

        <g id="shadow-r">
          <rect className="cls-6" x="323.6" y="366.3" width="78" height="40.5" rx="6.8" />
        </g>

        <g id="lines">
            <line className="line line1" x1="246.9" y1="202.4" x2="389.2" y2="202.4" />
            <line className="line line2" x1="246.9" y1="236.5" x2="389.2" y2="236.5" />
            <line className="line line3" x1="246.9" y1="270.6" x2="389.2" y2="270.6" />
        </g>

        <g id="pen">
            <polygon className="cls-7" points="387.4 227.3 379.7 219.7 360.7 232.5 361.4 242.7 387.4 227.3" />
            <polygon className="cls-6" points="360.7 232.5 253.5 306.2 267.4 316.9 361.4 242.7 360.7 232.5" />
            <polygon className="cls-4" points="267.4 316.9 273.9 329.5 361.4 242.7 267.4 316.9" />
        </g>
      </svg>
    </div>
  );
};

export default AnimacaoSVG;
