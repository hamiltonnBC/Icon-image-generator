import { useGridContext } from '../state/context.js';

/**
 * Displays icons grouped by category with remove and reorder buttons.
 */
export function IconList() {
  const { state, dispatch } = useGridContext();
  const { categories, icons } = state;

  function handleRemoveIcon(iconId: string) {
    dispatch({ type: 'REMOVE_ICON', payload: { iconId } });
  }

  function handleMoveIcon(categoryId: string, sourceIndex: number, destinationIndex: number) {
    dispatch({
      type: 'REORDER_ICON',
      payload: { categoryId, sourceIndex, destinationIndex },
    });
  }

  if (categories.length === 0) {
    return (
      <section className="icon-list" aria-label="Added icons">
        <p style={{ color: '#999', fontSize: '13px' }}>
          Create a category and add icons to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="icon-list" aria-label="Added icons">
      {categories.map((category) => (
        <div key={category.id} className="icon-list__category">
          <h4 className="icon-list__category-header">{category.name}</h4>
          <div className="icon-list__icons">
            {category.iconIds.map((iconId, index) => {
              const icon = icons[iconId];
              if (!icon) return null;
              return (
                <div key={iconId} className="icon-list__item">
                  <div className="icon-list__reorder">
                    <button
                      type="button"
                      className="icon-list__move-btn"
                      onClick={() => handleMoveIcon(category.id, index, index - 1)}
                      disabled={index === 0}
                      aria-label={`Move ${icon.displayName} left`}
                      title="Move left"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      className="icon-list__move-btn"
                      onClick={() => handleMoveIcon(category.id, index, index + 1)}
                      disabled={index === category.iconIds.length - 1}
                      aria-label={`Move ${icon.displayName} right`}
                      title="Move right"
                    >
                      ▶
                    </button>
                  </div>
                  <img
                    src={icon.svgUrl}
                    alt={icon.displayName}
                    className="icon-list__thumbnail"
                    width={36}
                    height={36}
                  />
                  <span className="icon-list__name">{icon.displayName}</span>
                  <button
                    type="button"
                    className="icon-list__remove-btn"
                    onClick={() => handleRemoveIcon(iconId)}
                    aria-label={`Remove ${icon.displayName}`}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            {category.iconIds.length === 0 && (
              <p className="icon-list__empty">No icons in this category</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
