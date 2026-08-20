import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  ZyrnAlertDialog,
  ZyrnContextMenu,
  ZyrnDrawer,
  ZyrnPopover,
} from './index';

describe('ZyrnPopover', () => {
  it('links its trigger, opens as a labelled dialog, and dismisses on Escape and outside pointer interaction', () => {
    function PopoverFixture() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <ZyrnPopover open={open} onOpenChange={setOpen} title="Runtime details" trigger={<button type="button">Inspect runtime</button>}>
            Runtime nominal.
          </ZyrnPopover>
          <button type="button">Outside target</button>
        </>
      );
    }

    render(<PopoverFixture />);
    const trigger = screen.getByRole('button', { name: 'Inspect runtime' });
    fireEvent.click(trigger);
    const popover = screen.getByRole('dialog', { name: 'Runtime details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(popover).toHaveTextContent('Runtime nominal.');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Runtime details' })).not.toBeInTheDocument();

    fireEvent.click(trigger);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside target' }));
    expect(screen.queryByRole('dialog', { name: 'Runtime details' })).not.toBeInTheDocument();
  });
});

describe('ZyrnAlertDialog', () => {
  it('uses alert-dialog semantics, keeps overlay clicks non-dismissive, and supports explicit cancel and confirm paths', () => {
    const onConfirm = vi.fn();
    function AlertFixture() {
      const [open, setOpen] = useState(true);
      return <ZyrnAlertDialog open={open} onOpenChange={setOpen} title="Purge release" description="This action cannot be undone." onConfirm={onConfirm} confirmLabel="Purge">Remove all archived records.</ZyrnAlertDialog>;
    }

    render(<AlertFixture />);
    const dialog = screen.getByRole('alertdialog', { name: 'Purge release' });
    expect(dialog).toHaveAttribute('aria-describedby');
    fireEvent.mouseDown(dialog.parentElement!);
    expect(screen.getByRole('alertdialog', { name: 'Purge release' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Purge/ }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog', { name: 'Purge release' })).not.toBeInTheDocument();
  });

  it('closes through the explicit cancel action without calling confirm', () => {
    const onConfirm = vi.fn();
    function AlertFixture() {
      const [open, setOpen] = useState(true);
      return <ZyrnAlertDialog open={open} onOpenChange={setOpen} title="Discard draft" onConfirm={onConfirm}>Discard the current draft?</ZyrnAlertDialog>;
    }

    render(<AlertFixture />);
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog', { name: 'Discard draft' })).not.toBeInTheDocument();
  });
});

describe('ZyrnDrawer', () => {
  it('opens as a labelled modal dialog, traps focus, and closes through Escape with focus restoration', async () => {
    function DrawerFixture() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open settings</button>
          <ZyrnDrawer open={open} onOpenChange={setOpen} title="System settings" description="Configure runtime behavior.">
            <button type="button">Save settings</button>
          </ZyrnDrawer>
        </>
      );
    }

    render(<DrawerFixture />);
    const trigger = screen.getByRole('button', { name: 'Open settings' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'System settings' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'System settings' })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

describe('ZyrnContextMenu', () => {
  it('opens through a context click, focuses the first enabled item, supports keyboard navigation, and calls selection handlers', async () => {
    const onInspect = vi.fn();
    render(
      <ZyrnContextMenu
        trigger={<button type="button">Runtime panel</button>}
        items={[
          { label: 'Inspect', shortcut: 'I', onSelect: onInspect },
          { label: 'Disabled operation', disabled: true },
          { label: 'Archive', shortcut: 'A' },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Runtime panel' });
    fireEvent.contextMenu(trigger, { clientX: 120, clientY: 80 });
    const menu = screen.getByRole('menu', { name: 'Context menu' });
    expect(menu).toHaveStyle({ top: '80px', left: '120px' });
    const inspect = screen.getByRole('menuitem', { name: 'Inspect I' });
    await waitFor(() => expect(inspect).toHaveFocus());

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Archive A' })).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(inspect).toHaveFocus();
    fireEvent.click(inspect);
    expect(onInspect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('Overlay completion accessibility audit', () => {
  it('has no detectable axe violations for representative Popover and ContextMenu structures', async () => {
    const { container } = render(
      <main aria-label="Overlay accessibility fixture">
        <ZyrnPopover open onOpenChange={() => {}} title="Runtime details" trigger={<button type="button">Inspect runtime</button>}>
          Runtime nominal.
        </ZyrnPopover>
        <ZyrnContextMenu trigger={<button type="button">Runtime panel</button>} items={[{ label: 'Inspect' }]} />
      </main>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
