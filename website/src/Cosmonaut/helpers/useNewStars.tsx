import React from 'react';
import { stars } from '../shared/stars';

type NewStar = { x: number; y: number; r: number };

const SVG_Y_ORIGN = 512;

export function useNewStars() {
  const [newStars, setNewStars] = React.useState<NewStar[]>(stars);

  function handleClick(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    const scale = clientRect.height / 1024;
    const y = (e.clientY - clientRect.top) / scale - SVG_Y_ORIGN;
    const r = 0.25;
    setNewStars([...newStars, { x: e.clientX / scale, y, r }]);
  }

  const elements = newStars.map((newStar, index) => (
    <circle
      key={index}
      cx={newStar.x}
      cy={newStar.y}
      r={newStar.r}
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth={10}
      fill="#bde0f6"
      onClick={e => {
        e.stopPropagation();
        if (e.altKey) {
          setNewStars(newStars.filter(s => (s === newStar ? false : true)));
        } else {
          setNewStars(
            newStars.map(s => {
              if (s !== newStar) return s;
              return {
                ...s,
                r: s.r + (e.shiftKey ? -0.25 : 0.25),
              };
            })
          );
        }
      }}
    />
  ));

  console.log(
    JSON.stringify(
      newStars.map(s => ({
        ...s,
        x: +s.x.toFixed(2),
        y: +s.y.toFixed(2),
      }))
    )
  );

  return { handleClick, elements };
}
