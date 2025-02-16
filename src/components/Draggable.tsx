"use client";

import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

type DraggableProps = {
  children: React.ReactNode;
  id: string;
  hoverItem: string | undefined;
  cardTitle: string;
};

export default function Draggable({children, id, hoverItem, cardTitle}: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  }
  
  return (
    <button 
      ref={setNodeRef} 
      style={{
        ...style,
        width: '100%',
        zIndex: hoverItem === cardTitle ? 1000 : 1,
        position: 'relative',
      }}
      {...listeners} 
      {...attributes}
    >
      {children}
    </button>
  );
}
