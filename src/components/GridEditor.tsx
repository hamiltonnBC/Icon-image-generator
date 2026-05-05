import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useGridContext } from '../state/context.js';
import { IconCard } from './IconCard.js';
import type { IconEntry, Category } from '../types/index.js';

export function GridEditor() {
  const { state, dispatch } = useGridContext();
  const { categories, icons } = state;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overCategoryId, setOverCategoryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const activeIcon: IconEntry | null = activeId ? icons[activeId] ?? null : null;

  /** Find which category contains a given icon id */
  const findCategoryForIcon = useCallback(
    (iconId: string): string | null => {
      for (const cat of categories) {
        if (cat.iconIds.includes(iconId)) {
          return cat.id;
        }
      }
      return null;
    },
    [categories]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setOverCategoryId(null);
      return;
    }

    // Determine which category the cursor is over
    const overId = over.id as string;
    // Check if overId is a category container id
    const isCategory = categories.some((cat) => cat.id === overId);
    if (isCategory) {
      setOverCategoryId(overId);
    } else {
      // overId is an icon — find its category
      const catId = findCategoryForIcon(overId);
      setOverCategoryId(catId);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverCategoryId(null);

    if (!over) return;

    const activeIconId = active.id as string;
    const overId = over.id as string;

    const sourceCategoryId = findCategoryForIcon(activeIconId);
    if (!sourceCategoryId) return;

    // Determine destination category and index
    let destinationCategoryId: string;
    let destinationIndex: number;

    const isOverCategory = categories.some((cat) => cat.id === overId);
    if (isOverCategory) {
      // Dropped on a category container — append to end
      destinationCategoryId = overId;
      const destCategory = categories.find((cat) => cat.id === overId);
      destinationIndex = destCategory ? destCategory.iconIds.length : 0;
    } else {
      // Dropped on another icon — find its category and index
      const destCatId = findCategoryForIcon(overId);
      if (!destCatId) return;
      destinationCategoryId = destCatId;
      const destCategory = categories.find((cat) => cat.id === destCatId);
      destinationIndex = destCategory
        ? destCategory.iconIds.indexOf(overId)
        : 0;
    }

    if (sourceCategoryId === destinationCategoryId) {
      // Reorder within same category
      const sourceCategory = categories.find((cat) => cat.id === sourceCategoryId);
      if (!sourceCategory) return;
      const sourceIndex = sourceCategory.iconIds.indexOf(activeIconId);
      if (sourceIndex === destinationIndex) return;

      dispatch({
        type: 'REORDER_ICON',
        payload: {
          categoryId: sourceCategoryId,
          sourceIndex,
          destinationIndex,
        },
      });
    } else {
      // Move between categories
      dispatch({
        type: 'MOVE_ICON',
        payload: {
          iconId: activeIconId,
          sourceCategoryId,
          destinationCategoryId,
          destinationIndex,
        },
      });
    }
  }

  function handleRemoveIcon(iconId: string) {
    dispatch({ type: 'REMOVE_ICON', payload: { iconId } });
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverCategoryId(null);
  }

  return (
    <section className="grid-editor" aria-label="Icon grid editor">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {categories.map((category) => (
          <DroppableCategory
            key={category.id}
            category={category}
            isOver={overCategoryId === category.id && !!activeId}
          >
            <SortableContext
              items={category.iconIds}
              strategy={rectSortingStrategy}
            >
              <div
                className="grid-editor__icon-list"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  minHeight: '60px',
                }}
              >
                {category.iconIds.map((iconId) => {
                  const icon = icons[iconId];
                  if (!icon) return null;
                  return (
                    <IconCard
                      key={iconId}
                      iconId={iconId}
                      icon={icon}
                      onRemove={handleRemoveIcon}
                    />
                  );
                })}
                {category.iconIds.length === 0 && (
                  <p
                    className="grid-editor__empty"
                    style={{
                      color: '#999',
                      fontSize: '12px',
                      margin: 0,
                      alignSelf: 'center',
                    }}
                  >
                    Drop icons here
                  </p>
                )}
              </div>
            </SortableContext>
          </DroppableCategory>
        ))}

        <DragOverlay>
          {activeIcon ? (
            <div
              className="icon-card icon-card--overlay"
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                border: '1px solid #4a90d9',
                borderRadius: '6px',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '80px',
              }}
            >
              <img
                src={activeIcon.svgUrl}
                alt={activeIcon.displayName}
                style={{ width: 48, height: 48, objectFit: 'contain' }}
                draggable={false}
              />
              <span style={{ fontSize: '11px', marginTop: '4px' }}>
                {activeIcon.displayName}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {categories.length === 0 && (
        <p className="grid-editor__no-categories" style={{ color: '#999' }}>
          Create a category to start adding icons.
        </p>
      )}
    </section>
  );
}

/** Wrapper that registers each category container as a droppable target */
function DroppableCategory({
  category,
  isOver,
  children,
}: {
  category: Category;
  isOver: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: category.id });

  return (
    <div
      ref={setNodeRef}
      className="grid-editor__category"
      style={{
        marginBottom: '16px',
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        background: isOver ? '#e8f4fd' : '#fafafa',
        transition: 'background 0.15s ease',
      }}
    >
      <h4
        className="grid-editor__category-header"
        style={{ margin: '0 0 8px 0', fontSize: '14px' }}
      >
        {category.name}
      </h4>
      {children}
    </div>
  );
}
