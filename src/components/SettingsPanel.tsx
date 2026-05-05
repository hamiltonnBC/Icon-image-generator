import { useGridContext } from '../state/context.js';
import type { GridSettings } from '../types/index.js';

export function SettingsPanel() {
  const { state, dispatch } = useGridContext();
  const { settings } = state;

  function updateSettings(partial: Partial<GridSettings>) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: partial });
  }

  return (
    <fieldset className="settings-panel" aria-label="Grid settings">
      <legend className="settings-panel__legend">Settings</legend>

      {/* Icon Size */}
      <div className="settings-panel__field">
        <label htmlFor="icon-size" className="settings-panel__label">
          Icon Size: {settings.iconSize}px
        </label>
        <input
          id="icon-size"
          type="range"
          min={32}
          max={256}
          step={1}
          value={settings.iconSize}
          onChange={(e) => updateSettings({ iconSize: Number(e.target.value) })}
          aria-valuemin={32}
          aria-valuemax={256}
          aria-valuenow={settings.iconSize}
          aria-valuetext={`${settings.iconSize} pixels`}
        />
      </div>

      {/* Label Enabled */}
      <div className="settings-panel__field">
        <label htmlFor="label-enabled" className="settings-panel__label">
          <input
            id="label-enabled"
            type="checkbox"
            checked={settings.labelEnabled}
            onChange={(e) => updateSettings({ labelEnabled: e.target.checked })}
          />
          Show Labels
        </label>
      </div>

      {/* Category Header Enabled */}
      <div className="settings-panel__field">
        <label htmlFor="category-header-enabled" className="settings-panel__label">
          <input
            id="category-header-enabled"
            type="checkbox"
            checked={settings.categoryHeaderEnabled}
            onChange={(e) => updateSettings({ categoryHeaderEnabled: e.target.checked })}
          />
          Show Category Names
        </label>
      </div>

      {/* Label Position (only shown when labels enabled) */}
      {settings.labelEnabled && (
        <div className="settings-panel__field">
          <label htmlFor="label-position" className="settings-panel__label">
            Label Position
          </label>
          <select
            id="label-position"
            value={settings.labelPosition}
            onChange={(e) =>
              updateSettings({ labelPosition: e.target.value as 'above' | 'below' })
            }
            aria-label="Label position"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>
      )}

      {/* Label Font Size (only shown when labels enabled) */}
      {settings.labelEnabled && (
        <div className="settings-panel__field">
          <label htmlFor="label-font-size" className="settings-panel__label">
            Label Font Size (px)
          </label>
          <input
            id="label-font-size"
            type="number"
            min={8}
            max={48}
            value={settings.labelFontSize}
            onChange={(e) => updateSettings({ labelFontSize: Number(e.target.value) })}
            aria-label="Label font size in pixels"
          />
        </div>
      )}

      {/* Background */}
      <fieldset className="settings-panel__field settings-panel__fieldset">
        <legend className="settings-panel__label">Background</legend>
        <label htmlFor="bg-white" className="settings-panel__radio-label">
          <input
            id="bg-white"
            type="radio"
            name="background"
            value="white"
            checked={settings.background === 'white'}
            onChange={() => updateSettings({ background: 'white' })}
          />
          White
        </label>
        <label htmlFor="bg-transparent" className="settings-panel__radio-label">
          <input
            id="bg-transparent"
            type="radio"
            name="background"
            value="transparent"
            checked={settings.background === 'transparent'}
            onChange={() => updateSettings({ background: 'transparent' })}
          />
          Transparent
        </label>
      </fieldset>
    </fieldset>
  );
}
