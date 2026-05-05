import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { IconEntry } from '../types/index.js';

interface IconCardProps {
  iconId: string;
  icon: IconEntry;
  onRemove: (iconId: string) => void;
}

export function IconCard({ iconId, icon, onRemove }: IconCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: iconId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'grab',
    position: 'relative',
    minWidth: '80px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="icon-card"
      {...attributes}
      {...listeners}
    >
      <img
        src={icon.svgUrl}
        alt={icon.displayName}
        className="icon-card__thumbnail"
        style={{ width: 48, height: 48, objectFit: 'contain' }}
        draggable={false}
      />
      <span
        className="icon-card__name"
        style={{ fontSize: '11px', marginTop: '4px', textAlign: 'center' }}
      >
        {icon.displayName}
      </span>
      <button
        type="button"
        className="icon-card__remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(iconId);
        }}
        aria-label={`Remove ${icon.displayName}`}
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: 1,
          padding: '2px 4px',
          borderRadius: '3px',
          color: '#666',
        }}
      >
        ✕
      </button>
    </div>
  );
}
