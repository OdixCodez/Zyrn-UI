import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import './Dropdown.css';

export type ZyrnDropdownAlign = 'start' | 'end';

interface ZyrnDropdownContextValue {
  close: () => void;
}

const ZyrnDropdownContext = createContext<ZyrnDropdownContextValue | null>(null);

function getMenuItems(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
}

export interface ZyrnDropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
  align?: ZyrnDropdownAlign;
  className?: string;
  disabled?: boolean;
}

export const ZyrnDropdown = React.forwardRef<HTMLDivElement, ZyrnDropdownProps>(function ZyrnDropdown(
  {
    label,
    children,
    align = 'start',
    className = '',
    disabled = false,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = () => setOpen(false);
  const focusMenuItem = (position: 'first' | 'last') => {
    const menu = menuRef.current;
    if (!menu) return;
    const items = getMenuItems(menu);
    (position === 'first' ? items[0] : items[items.length - 1])?.focus();
  };

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <ZyrnDropdownContext.Provider value={{ close }}>
      <div ref={setRefs} className={['zyrn-dropdown', `zyrn-dropdown--${align}`, className].filter(Boolean).join(' ')}>
        <button
          ref={triggerRef}
          type="button"
          className="zyrn-dropdown__trigger"
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
              window.requestAnimationFrame(() => focusMenuItem(event.key === 'ArrowDown' ? 'first' : 'last'));
            }
          }}
        >
          <span>{label}</span>
          <span className="zyrn-dropdown__chevron" aria-hidden="true" />
        </button>

        {open && (
          <div
            ref={menuRef}
            id={menuId}
            className="zyrn-dropdown__menu"
            role="menu"
            aria-orientation="vertical"
            onKeyDown={(event) => {
              const menu = menuRef.current;
              if (!menu) return;
              const items = getMenuItems(menu);
              const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

              if (event.key === 'Escape') {
                event.preventDefault();
                close();
                triggerRef.current?.focus();
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                items[(currentIndex + 1 + items.length) % items.length]?.focus();
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                items[(currentIndex - 1 + items.length) % items.length]?.focus();
              } else if (event.key === 'Home') {
                event.preventDefault();
                items[0]?.focus();
              } else if (event.key === 'End') {
                event.preventDefault();
                items[items.length - 1]?.focus();
              }
            }}
          >
            {children}
          </div>
        )}
      </div>
    </ZyrnDropdownContext.Provider>
  );
});

ZyrnDropdown.displayName = 'ZyrnDropdown';

export interface ZyrnDropdownItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode;
  description?: React.ReactNode;
  onSelect?: () => void;
}

export const ZyrnDropdownItem = React.forwardRef<HTMLButtonElement, ZyrnDropdownItemProps>(function ZyrnDropdownItem(
  { children, description, onSelect, className = '', disabled, onClick, ...rest },
  ref,
) {
  const context = useContext(ZyrnDropdownContext);

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      className={['zyrn-dropdown__item', className].filter(Boolean).join(' ')}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          onSelect?.();
          context?.close();
        }
      }}
      {...rest}
    >
      <span className="zyrn-dropdown__item-label">{children}</span>
      {description && <span className="zyrn-dropdown__item-description">{description}</span>}
    </button>
  );
});

ZyrnDropdownItem.displayName = 'ZyrnDropdownItem';

export default ZyrnDropdown;
