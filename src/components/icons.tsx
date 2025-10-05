import { Bookmark } from 'lucide-react';
import type { SVGProps } from 'react';

export const AppLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 150"
      shapeRendering="crispEdges"
      {...props}
    >
      <g fill="#2F2F2F">
        {/* Cart Basket */}
        <path d="M40,70 h70 v1 h-70 z" />
        <path d="M40,71 h1 v40 h-1 z" />
        <path d="M110,71 h1 v40 h-1 z" />
        <path d="M41,111 h69 v1 h-69 z" />
        {/* Cart Bottom */}
        <path d="M45,112 h60 v5 h-60 z" />
        <path d="M50,117 h50 v5 h-50 z" />
        {/* Wheels */}
        <path fill="#4A4A4A" d="M55,125 h10 v10 h-10 z" />
        <path fill="#4A4A4A" d="M85,125 h10 v10 h-10 z" />
        <path fill="#C0C0C0" d="M58,128 h4 v4 h-4 z" />
        <path fill="#C0C0C0" d="M88,128 h4 v4 h-4 z" />
        {/* Handle */}
        <path d="M35,65 h5 v5 h-5 z" />
        <path d="M30,60 h5 v5 h-5 z" />
      </g>
      {/* Groceries */}
      <g>
        {/* Lettuce */}
        <path fill="#5DBB5D" d="M60,55 h10 v5 h-10 z" />
        <path fill="#4CAF50" d="M62,50 h6 v5 h-6 z" />
        <path fill="#5DBB5D" d="M70,60 h15 v8 h-15 z" />
        <path fill="#4CAF50" d="M72,55 h10 v5 h-10 z" />
        {/* Pumpkin */}
        <path fill="#F57C00" d="M85,60 h15 v10 h-15 z" />
        <path fill="#FFA726" d="M88,58 h9 v2 h-9 z" />
        <path fill="#E65100" d="M90,55 h5 v3 h-5 z" />
        {/* Eggplant */}
        <path fill="#4A148C" d="M50,90 h15 v15 h-15 z" />
        <path fill="#6A1B9A" d="M65,95 h10 v10 h-10 z" />
        {/* Tomatoes */}
        <path fill="#D32F2F" d="M70,85 h10 v10 h-10 z" />
        <path fill="#F44336" d="M80,90 h10 v10 h-10 z" />
        {/* Bananas */}
        <path fill="#FDD835" d="M95,80 h10 v8 h-10 z" />
        <path fill="#FFEE58" d="M98,75 h5 v5 h-5 z" />
        {/* Other Greens */}
        <path fill="#388E3C" d="M45,80 h10 v10 h-10 z" />
        <path fill="#2E7D32" d="M100,95 h8 v8 h-8 z" />
      </g>
      {/* Speech Bubble */}
      <g>
        <path fill="#2F2F2F" d="M50,20 h80 v1 h-80 z" />
        <path fill="#2F2F2F" d="M49,21 h1 v28 h-1 z" />
        <path fill="#2F2F2F" d="M130,21 h1 v28 h-1 z" />
        <path fill="#2F2F2F" d="M50,49 h80 v1 h-80 z" />
        <path fill="#FFFFFF" d="M50,21 h80 v28 h-80 z" />
        {/* Bubble Tail */}
        <path fill="#2F2F2F" d="M65,50 h10 v5 h-10 z" />
        <path fill="#FFFFFF" d="M66,50 h8 v3 h-8 z" />
        <path fill="#81D4FA" d="M67,52 h6 v1 h-6 z" />

        <path fill="#81D4FA" d="M50,48 h80 v1 h-80 z" />
      </g>
      {/* Text */}
      <text
        x="55"
        y="42"
        fontFamily="monospace, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="#2F2F2F"
      >
        SPEND
        <tspan fill="#D32F2F">WISE</tspan>
      </text>
    </svg>
  );
};

export { Bookmark };
