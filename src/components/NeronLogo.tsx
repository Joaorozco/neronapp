import React from 'react';

interface NeronLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  className?: string;
}

export const NeronLogo: React.FC<NeronLogoProps> = ({ size = 'md', className = '' }) => {
  // Dimensions based on size preset
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  }[size];

  return (
    <div className={`relative inline-block flex-shrink-0 ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flower / Scallop path for the outer badge */}
          <path
            id="scallopShape"
            d="M 100 10 
               C 112 10, 118 20, 128 22 
               C 138 24, 148 18, 156 24 
               C 164 30, 166 42, 172 50 
               C 178 58, 190 62, 192 72 
               C 194 82, 186 92, 186 100 
               C 186 108, 194 118, 192 128 
               C 190 138, 178 142, 172 150 
               C 166 158, 164 170, 156 176 
               C 148 182, 138 176, 128 178 
               C 118 180, 112 190, 100 190 
               C 88 190, 82 180, 72 178 
               C 62 176, 52 182, 44 176 
               C 36 170, 34 158, 28 150 
               C 22 142, 10 138, 8 128 
               C 6 118, 14 108, 14 100 
               C 14 92, 6 82, 8 72 
               C 10 62, 22 58, 28 50 
               C 34 42, 36 30, 44 24 
               C 52 18, 62 24, 72 22 
               C 82 20, 88 10, 100 10 Z"
          />

          {/* Text path along the bottom curve inside circle for 'delicias heladas' */}
          <path
            id="textPathArc"
            d="M 42 125 A 62 62 0 0 0 158 125"
            fill="none"
          />
        </defs>

        {/* 1. Dark Maroon Outer Scallop Border */}
        <use href="#scallopShape" fill="#3D101E" />

        {/* 2. Hot Pink Inner Scallop */}
        <use
          href="#scallopShape"
          fill="#EC4899"
          transform="scale(0.88) translate(13.6, 13.6)"
        />

        {/* 3. Outer Cream Ring Outline */}
        <circle cx="100" cy="100" r="68" fill="#FFFFFF" />

        {/* 4. Bright Cyan Ring */}
        <circle cx="100" cy="100" r="65" stroke="#009BBF" strokeWidth="8" fill="none" />

        {/* 5. Creamy Inner Background Circle */}
        <circle cx="100" cy="100" r="58" fill="#FFFBF2" />

        {/* 6. Ice Cream Cone Illustration in Center */}
        {/* Cone Waffle */}
        <path
          d="M 82 72 L 118 72 L 100 128 Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="2"
        />
        {/* Waffle Grid Lines */}
        <path
          d="M 87 80 L 109 112 M 93 80 L 104 120 M 113 80 L 91 112 M 107 80 L 96 120"
          stroke="#B45309"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Chocolate Ice Cream Scoops */}
        <path
          d="M 80 72 
             C 72 70, 70 55, 82 48 
             C 80 35, 95 28, 108 34 
             C 120 30, 130 42, 122 52 
             C 132 60, 125 72, 118 72 Z"
          fill="#3D101E"
        />
        {/* Shine on Ice Cream Scoop */}
        <path
          d="M 88 42 C 92 38, 102 36, 106 40 C 100 42, 92 44, 88 42 Z"
          fill="#5C1F31"
          opacity="0.8"
        />
        <circle cx="92" cy="42" r="3" fill="#FFFFFF" opacity="0.6" />

        {/* 7. "Neron" Main Brand Text */}
        <g>
          {/* Text Shadow/Border */}
          <text
            x="100"
            y="104"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="5"
            fontSize="38"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-1"
          >
            Neron
          </text>
          {/* Text Main */}
          <text
            x="100"
            y="104"
            textAnchor="middle"
            fill="#3D101E"
            fontSize="38"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-1"
          >
            Neron
          </text>
        </g>

        {/* 8. "delicias heladas" Curved Script along bottom */}
        <text fill="#F97316" fontSize="13" fontWeight="bold" fontFamily="cursive, Georgia, serif">
          <textPath href="#textPathArc" startOffset="50%" textAnchor="middle">
            delicias heladas
          </textPath>
        </text>
      </svg>
    </div>
  );
};
