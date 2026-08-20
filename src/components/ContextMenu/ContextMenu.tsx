import React, { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { useZyrnDismissableLayer } from '../Overlay/overlayUtils';
import './ContextMenu.css';

export interface ZyrnContextMenuItem {
  label: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ZyrnContextMenuProps {
  trigger: React.ReactElement;
  items: ZyrnContextMenuItem[];
  label?: string;
  className?: string;
}

function getEnabledMenuItems(menu: HTMLElement | null) {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
}

export function ZyrnContextMenu({ trigger, items, label = 'Context menu', className = '' }: ZyrnContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const close = () => setOpen(false);
  useZyrnDismissableLayer(open, rootRef, close, { restoreFocusTo: triggerRef });

  useEffect(() => {
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => getEnabledMenuItems(menuRef.current)[0]?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const triggerElement = Children.only(trigger);
  if (!isValidElement<React.HTMLAttributes<HTMLElement>>(triggerElement)) return null;

  const openAt = (x: number, y: number) => {
    setPosition({ x, y });
    setOpen(true);
  };

  return (
    <div ref={rootRef} className={['zyrn-context-menu', className].filter(Boolean).join(' ')}>
      {cloneElement(triggerElement, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onContextMenu?.(event);
          if (!event.defaultPrevented) {
            event.preventDefault();
            triggerRef.current = event.currentTarget;
            openAt(event.clientX, event.clientY);
          }
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          triggerElement.props.onKeyDown?.(event);
          if (!event.defaultPrevented && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
            event.preventDefault();
            triggerRef.current = event.currentTarget;
            const bounds = event.currentTarget.getBoundingClientRect();
            openAt(bounds.left + 8, bounds.top + 8);
          }
        },
      })}
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          className="zyrn-context-menu__menu"
          role="menu"
          aria-label={label}
          style={{ top: position.y, left: position.x }}
          onKeyDown={(event) => {
            const enabledItems = getEnabledMenuItems(menuRef.current);
            const activeIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === 'Escape') {
              event.preventDefault();
              close();
              triggerRef.current?.focus();
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              enabledItems[(activeIndex + 1 + enabledItems.length) % enabledItems.length]?.focus();
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              enabledItems[(activeIndex - 1 + enabledItems.length) % enabledItems.length]?.focus();
            } else if (event.key === 'Home') {
              event.preventDefault();
              enabledItems[0]?.focus();
            } else if (event.key === 'End') {
              event.preventDefault();
              enabledItems[enabledItems.length - 1]?.focus();
            }
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              role="menuitem"
              className="zyrn-context-menu__item"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect?.();
                close();
              }}
            >
              <span className="zyrn-context-menu__item-content">
                <span className="zyrn-context-menu__item-label">{item.label}</span>
                {item.description && <span className="zyrn-context-menu__item-description">{item.description}</span>}
              </span>
              {item.shortcut && <kbd className="zyrn-context-menu__shortcut">{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZyrnContextMenu;
