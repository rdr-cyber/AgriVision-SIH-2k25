import * as React from 'react';

interface AgriVisionLogoProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export const AgriVisionLogo: React.FC<AgriVisionLogoProps> = ({
  className = '',
  width = 24,
  height = 24,
  color = 'currentColor'
}) => {
  return (
    React.createElement('svg', {
      width: width,
      height: height,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      className: className
    },
    React.createElement('path', {
      d: 'M12 2L2 7L12 12L22 7L12 2Z',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('path', {
      d: 'M2 17L12 22L22 17',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('path', {
      d: 'M2 12L12 17L22 12',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('circle', {
      cx: '12',
      cy: '12',
      r: '3',
      fill: color
    }))
  );
};