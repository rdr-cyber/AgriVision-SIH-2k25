import * as React from 'react';

interface AgriVisionLogoLargeProps {
  className?: string;
  width?: number;
  height?: number;
}

export const AgriVisionLogoLarge: React.FC<AgriVisionLogoLargeProps> = ({
  className = '',
  width = 48,
  height = 48
}) => {
  return (
    React.createElement('svg', {
      width: width,
      height: height,
      viewBox: '0 0 48 48',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      className: className
    },
    React.createElement('path', {
      d: 'M24 4L4 14L24 24L44 14L24 4Z',
      stroke: '#10B981',
      strokeWidth: '3',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('path', {
      d: 'M4 34L24 44L44 34',
      stroke: '#10B981',
      strokeWidth: '3',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('path', {
      d: 'M4 24L24 34L44 24',
      stroke: '#10B981',
      strokeWidth: '3',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }),
    React.createElement('circle', {
      cx: '24',
      cy: '24',
      r: '6',
      fill: '#10B981'
    }))
  );
};