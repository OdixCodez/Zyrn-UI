import React, { useId, useRef, useState } from 'react';
import './Tabs.css';

export type ZyrnTabsOrientation = 'horizontal' | 'vertical';
export type ZyrnTabsSize = 'sm' | 'md' | 'lg';

export interface ZyrnTabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface ZyrnTabsProps {
  tabs: ZyrnTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  orientation?: ZyrnTabsOrientation;
  size?: ZyrnTabsSize;
  fullWidth?: boolean;
  className?: string;
}

export const ZyrnTabs = React.forwardRef<HTMLDivElement, ZyrnTabsProps>(function ZyrnTabs(
  {
    tabs,
    value,
    defaultValue,
    onValueChange,
    label = 'Tabs',
    orientation = 'horizontal',
    size = 'md',
    fullWidth = false,
    className = '',
  },
  ref,
) {
  const generatedId = useId();
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? enabledTabs[0]?.value ?? '');
  const requestedValue = value ?? uncontrolledValue;
  const selectedTab = tabs.find((tab) => tab.value === requestedValue && !tab.disabled) ?? enabledTabs[0];
  const selectedValue = selectedTab?.value ?? '';
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectValue = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const moveSelection = (currentIndex: number, direction: 1 | -1 | 'start' | 'end') => {
    const enabledIndexes = tabs
      .map((tab, index) => (tab.disabled ? -1 : index))
      .filter((index) => index >= 0);
    if (enabledIndexes.length === 0) return;

    let nextIndex: number;
    if (direction === 'start') {
      nextIndex = enabledIndexes[0];
    } else if (direction === 'end') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    } else {
      const currentEnabledIndex = Math.max(0, enabledIndexes.indexOf(currentIndex));
      nextIndex = enabledIndexes[(currentEnabledIndex + direction + enabledIndexes.length) % enabledIndexes.length];
    }

    selectValue(tabs[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  };

  const selectedIndex = tabs.findIndex((tab) => tab.value === selectedValue);
  const tabId = (tab: ZyrnTabItem) => `zyrn-tab-${generatedId}-${tab.value}`;
  const panelId = (tab: ZyrnTabItem) => `zyrn-tabpanel-${generatedId}-${tab.value}`;

  return (
    <div
      ref={ref}
      className={['zyrn-tabs', `zyrn-tabs--${orientation}`, `zyrn-tabs--${size}`, fullWidth ? 'zyrn-tabs--fullWidth' : '', className].filter(Boolean).join(' ')}
    >
      <div className="zyrn-tabs__list" role="tablist" aria-label={label} aria-orientation={orientation}>
        {tabs.map((tab, index) => {
          const isSelected = tab.value === selectedValue;
          return (
            <button
              key={tab.value}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={tabId(tab)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId(tab)}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className={['zyrn-tabs__tab', isSelected ? 'zyrn-tabs__tab--selected' : ''].filter(Boolean).join(' ')}
              onClick={() => selectValue(tab.value)}
              onKeyDown={(event) => {
                const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
                const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
                if (event.key === previousKey) {
                  event.preventDefault();
                  moveSelection(index, -1);
                } else if (event.key === nextKey) {
                  event.preventDefault();
                  moveSelection(index, 1);
                } else if (event.key === 'Home') {
                  event.preventDefault();
                  moveSelection(index, 'start');
                } else if (event.key === 'End') {
                  event.preventDefault();
                  moveSelection(index, 'end');
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {selectedTab && (
        <div
          id={panelId(selectedTab)}
          className="zyrn-tabs__panel"
          role="tabpanel"
          aria-labelledby={tabId(selectedTab)}
          tabIndex={0}
          data-index={selectedIndex}
        >
          {selectedTab.content}
        </div>
      )}
    </div>
  );
});

ZyrnTabs.displayName = 'ZyrnTabs';

export default ZyrnTabs;
