import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

type DraggableProps = {
  children: React.ReactNode;
  id: string;
};

export default function Draggable({children, id}: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  }
  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
