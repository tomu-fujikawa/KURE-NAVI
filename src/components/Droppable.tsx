"use client";

import {useDroppable} from '@dnd-kit/core';

type DroppableProps = {
  children: React.ReactNode;
  id: string;
  isOverAddClass?: string;
};

export default function Droppable({children, id}: DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });

  const styles = {
    container: {
      backgroundColor: isOver ? 'var(--kure-wave)' : 'transparent',
      opacity: isOver ? 0.3 : 1,
      transition: 'all 0.2s ease',
      
    }
  };

  return (
    <div ref={setNodeRef} style={styles.container}>
      {children}
    </div>
  );
}
