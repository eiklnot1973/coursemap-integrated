import React from "react";

interface MapPinProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  fillColor?: string;
}

const MapPinIcon: React.FC<MapPinProps> = ({ 
  size = 24, 
  fillColor = "currentColor", 
  className,
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={fillColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
};

const MapPinButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Select location"
      style={{
        all: 'unset',
        display: 'block', 
        cursor: 'pointer' 
      }}
    >
      <MapPinIcon size={32} fillColor="#ef4444" />
    </button>
  );
};

export default MapPinButton