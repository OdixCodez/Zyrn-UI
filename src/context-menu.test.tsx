import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ZyrnContextMenu } from './index';

const menuItems = [
  { label: 'Inspect', shortcut: 'I' },
  { label: 'Disabled operation', disabled: true },
  { label: 'Archive', shortcut: 'A' },
];

describe('ZyrnContextMenu accessibility contract', () => {
  it('links the trigger and menu with the expected ARIA attributes and opens at the pointer location', async () => {
    render(<ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={menuItems} label="Runtime operations" />);

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.contextMenu(trigger, { clientX: 120, clientY: 80 });
    const menu = screen.getByRole('menu', { name: 'Runtime operations' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(menu).toHaveStyle({ top: '80px', left: '120px' });
    expect(screen.getByRole('menuitem', { name: 'Disabled operation' })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Inspect I' })).toHaveFocus());
  });

  it.each([
    ['ContextMenu', {}],
    ['F10', { shiftKey: true }],
  ])('opens through the %s keyboard path and focuses the first enabled item', async (key, modifiers) => {
    render(<ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={menuItems} />);

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key, ...modifiers });

    expect(screen.getByRole('menu', { name: 'Context menu' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Inspect I' })).toHaveFocus());
  });

  it('supports ArrowUp, ArrowDown, Home, and End navigation while skipping disabled items', async () => {
    render(<ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={menuItems} />);

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    fireEvent.contextMenu(trigger, { clientX: 0, clientY: 0 });
    const menu = screen.getByRole('menu');
    const inspect = screen.getByRole('menuitem', { name: 'Inspect I' });
    const archive = screen.getByRole('menuitem', { name: 'Archive A' });
    await waitFor(() => expect(inspect).toHaveFocus());

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(archive).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(inspect).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(archive).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(inspect).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'End' });
    expect(archive).toHaveFocus();
  });

  it('closes on Escape and outside pointer interaction, restores trigger focus, and resets ARIA state', async () => {
    render(
      <>
        <ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={menuItems} />
        <button type="button">Outside target</button>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    trigger.focus();
    fireEvent.contextMenu(trigger, { clientX: 0, clientY: 0 });
    const menu = screen.getByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Inspect I' })).toHaveFocus());
    fireEvent.keyDown(menu, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.contextMenu(trigger, { clientX: 0, clientY: 0 });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside target' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('calls an enabled selection handler, then closes and restores focus to the trigger', async () => {
    const onInspect = vi.fn();
    render(
      <ZyrnContextMenu
        trigger={<button type="button">Runtime panel</button>}
        items={[{ label: 'Inspect', onSelect: onInspect }]}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    trigger.focus();
    fireEvent.contextMenu(trigger, { clientX: 0, clientY: 0 });
    const inspect = screen.getByRole('menuitem', { name: 'Inspect' });
    await waitFor(() => expect(inspect).toHaveFocus());
    fireEvent.click(inspect);

    expect(onInspect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('has no detectable axe violations for the trigger and opened menu structure', async () => {
    const { container } = render(<ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={menuItems} />);

    fireEvent.contextMenu(screen.getByRole('button', { name: 'Runtime panel' }), { clientX: 0, clientY: 0 });
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    expect(results.violations).toHaveLength(0);
  });
});
