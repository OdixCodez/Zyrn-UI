import { createRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ZyrnBadge,
  ZyrnButton,
  ZyrnCard,
  ZyrnDropdown,
  ZyrnDropdownItem,
  ZyrnInput,
  ZyrnModal,
  ZyrnSelect,
  ZyrnTextarea,
  ZyrnThemeProvider,
  ZyrnToastProvider,
  useZyrnToast,
  useZyrnTheme,
} from './index';

describe('ZyrnButton', () => {
  it('forwards its ref, uses a safe default type, and renders React-node children as its label', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <ZyrnButton ref={ref} kanji="実行" subText="cmd+enter">
        <strong>Execute</strong>
      </ZyrnButton>,
    );

    const button = screen.getByRole('button', { name: /execute.*実行.*cmd\+enter/i });
    expect(button).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(button);
  });

  it('preserves an explicitly supplied button type', () => {
    render(<ZyrnButton label="Send" type="submit" />);

    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });
});

describe('ZyrnInput', () => {
  it('uses a kanji-only label as the accessible input label and links helper text', () => {
    render(
      <ZyrnInput
        kanji="名前"
        required
        description="Use your legal name."
        error="This field is required."
      />,
    );

    const input = screen.getByLabelText('名前');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
  });
});

describe('ZyrnTextarea and ZyrnSelect', () => {
  it('shares field labels and described-by relationships across new controls', () => {
    render(
      <>
        <ZyrnTextarea label="Brief" kanji="概要" description="Keep it concise." error="Brief is required." />
        <ZyrnSelect label="Priority" kanji="優先" placeholder="Choose one">
          <option value="normal">Normal</option>
        </ZyrnSelect>
      </>,
    );

    const textarea = screen.getByLabelText('Brief');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Brief is required.')).toHaveAttribute('role', 'alert');
  });
});

describe('ZyrnBadge and ZyrnThemeProvider', () => {
  it('renders semantic badge content and toggles the scoped theme', async () => {
    function ThemeControl() {
      const { theme, toggleTheme } = useZyrnTheme();
      return <button type="button" onClick={toggleTheme}>{theme}</button>;
    }

    render(
      <ZyrnThemeProvider>
        <ZyrnBadge variant="success" kanji="稼働" dot>Ready</ZyrnBadge>
        <ThemeControl />
      </ZyrnThemeProvider>,
    );

    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('ink')).toBeInTheDocument();
    screen.getByRole('button', { name: 'ink' }).click();
    await waitFor(() => expect(screen.getByText('paper')).toBeInTheDocument());
  });
});

describe('ZyrnModal', () => {
  it('opens as a labelled dialog and closes on Escape', async () => {
    function ModalExample() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open modal</button>
          <ZyrnModal open={open} onOpenChange={setOpen} title="Discard draft" description="This action cannot be undone.">
            <button type="button">Keep editing</button>
          </ZyrnModal>
        </>
      );
    }

    render(<ModalExample />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    expect(screen.getByRole('dialog', { name: 'Discard draft' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('ZyrnDropdown', () => {
  it('opens a menu and closes after an enabled item is selected', async () => {
    const onSelect = vi.fn();
    render(
      <ZyrnDropdown label="Actions">
        <ZyrnDropdownItem onSelect={onSelect}>Archive</ZyrnDropdownItem>
      </ZyrnDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});

describe('ZyrnToastProvider', () => {
  it('renders and dismisses a notification through the toast hook', async () => {
    function ToastControl() {
      const { toast } = useZyrnToast();
      return <button type="button" onClick={() => toast({ title: 'Saved', description: 'Your draft is safe.', duration: 0 })}>Notify</button>;
    }

    render(
      <ZyrnToastProvider>
        <ToastControl />
      </ZyrnToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });
});

describe('ZyrnCard', () => {
  it('renders its optional header and variant class around supplied content', () => {
    render(
      <ZyrnCard titleText="System status" subText="v1.1.2" variant="parchment">
        <p>All systems operational.</p>
      </ZyrnCard>,
    );

    expect(screen.getByRole('heading', { name: 'System status' })).toBeInTheDocument();
    expect(screen.getByText('All systems operational.').parentElement).toHaveClass('zyrn-card-body');
    expect(screen.getByText('System status').closest('.zyrn-card')).toHaveClass('zyrn-card--parchment');
  });
});
