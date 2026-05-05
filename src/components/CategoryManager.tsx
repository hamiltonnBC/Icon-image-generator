import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGridContext } from '../state/context.js';

export function CategoryManager() {
  const { state, dispatch } = useGridContext();
  const { categories } = state;

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  function handleAddCategory() {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    dispatch({
      type: 'CREATE_CATEGORY',
      payload: { id: uuidv4(), name: trimmed },
    });
    setNewCategoryName('');
  }

  function handleAddKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  }

  function startRename(categoryId: string, currentName: string) {
    setEditingId(categoryId);
    setEditingName(currentName);
  }

  function handleSaveRename(categoryId: string) {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    dispatch({
      type: 'RENAME_CATEGORY',
      payload: { categoryId, name: trimmed },
    });
    setEditingId(null);
    setEditingName('');
  }

  function handleCancelRename() {
    setEditingId(null);
    setEditingName('');
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>, categoryId: string) {
    if (e.key === 'Enter') {
      handleSaveRename(categoryId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  }

  function handleDelete(categoryId: string, categoryName: string) {
    const confirmed = window.confirm(
      `Delete category "${categoryName}"? This will remove all icons in this category.`
    );
    if (confirmed) {
      dispatch({ type: 'DELETE_CATEGORY', payload: { categoryId } });
    }
  }

  function handleMoveUp(index: number) {
    if (index <= 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    dispatch({ type: 'REORDER_CATEGORIES', payload: { categories: newCategories } });
  }

  function handleMoveDown(index: number) {
    if (index >= categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    dispatch({ type: 'REORDER_CATEGORIES', payload: { categories: newCategories } });
  }

  const isAddDisabled = newCategoryName.trim().length === 0;
  const isSaveDisabled = editingName.trim().length === 0;

  return (
    <section className="category-manager" aria-label="Category management">
      <h3 className="category-manager__heading">Categories</h3>

      {/* Add Category */}
      <div className="category-manager__add" role="group" aria-label="Add new category">
        <input
          type="text"
          className="category-manager__input"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder="New category name"
          aria-label="New category name"
        />
        <button
          type="button"
          className="category-manager__add-btn"
          onClick={handleAddCategory}
          disabled={isAddDisabled}
          aria-label="Add category"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <ul className="category-manager__list" aria-label="Category list">
        {categories.map((category, index) => (
          <li key={category.id} className="category-manager__item">
            {/* Reorder buttons */}
            <div className="category-manager__reorder-buttons">
              <button
                type="button"
                className="category-manager__move-btn"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                aria-label={`Move ${category.name} up`}
                title="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                className="category-manager__move-btn"
                onClick={() => handleMoveDown(index)}
                disabled={index === categories.length - 1}
                aria-label={`Move ${category.name} down`}
                title="Move down"
              >
                ▼
              </button>
            </div>

            {editingId === category.id ? (
              <div className="category-manager__edit" role="group" aria-label={`Rename category ${category.name}`}>
                <input
                  type="text"
                  className="category-manager__edit-input"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => handleRenameKeyDown(e, category.id)}
                  aria-label={`New name for category ${category.name}`}
                  autoFocus
                />
                <button
                  type="button"
                  className="category-manager__save-btn"
                  onClick={() => handleSaveRename(category.id)}
                  disabled={isSaveDisabled}
                  aria-label="Save category name"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="category-manager__cancel-btn"
                  onClick={handleCancelRename}
                  aria-label="Cancel rename"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="category-manager__display">
                <span className="category-manager__name">{category.name}</span>
                <button
                  type="button"
                  className="category-manager__rename-btn"
                  onClick={() => startRename(category.id, category.name)}
                  aria-label={`Rename category ${category.name}`}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="category-manager__delete-btn"
                  onClick={() => handleDelete(category.id, category.name)}
                  aria-label={`Delete category ${category.name}`}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {categories.length === 0 && (
        <p className="category-manager__empty">No categories yet. Add one above to get started.</p>
      )}
    </section>
  );
}
