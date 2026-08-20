import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ZyrnSeparator, ZyrnTabs, ZyrnTooltip, type ZyrnTabItem } from './index';

const tabItems: ZyrnTabItem[] = [
  { value: 'runtime', label: 'Runtime', content: 'Runtime nominal.' },
  { value: 'signals', label: 'Signals', content: 'Signals monitored.' },
  { value: 'locked', label: 'Locked', content: 'Locked sequence.', disabled: true },
  { value: 'archive', label: 'Archive', content: 'Archive sealed.' },
];

afterEach(() => vi.useRealTimers());

describe('ZyrnTabs', () => {
  it('exposes labelled tab, tablist, and panel semantics for the active tab', () => {
    render(<ZyrnTabs label="System views" defaultValue="runtime" tabs={tabItems} />);

    expect(screen.getByRole('tablist', { name: 'System views' })).toHaveAttribute('aria-orientation', 'horizontal');
    const runtimeTab = screen.getByRole('tab', { name: 'Runtime' });
    const panel = screen.getByRole('tabpanel', { name: 'Runtime' });
    expect(runtimeTab).toHaveAttribute('aria-selected', 'true');
    expect(runtimeTab).toHaveAttribute('tabindex', '0');
    expect(panel).toHaveTextContent('Runtime nominal.');
    expect(panel).toHaveAttribute('aria-labelledby', runtimeTab.id);
    expect(screen.getByRole('tab', { name: 'Locked' })).toBeDisabled();
  });

  it('supports controlled selection and keyboard navigation that skips disabled tabs', async () => {
    const onValueChange = vi.fn();
    function ControlledTabs() {
      const [value, setValue] = useState('runtime');
      return <ZyrnTabs label="Controlled views" value={value} onValueChange={(nextValue) => { setValue(nextValue); onValueChange(nextValue); }} tabs={tabItems} />;
    }

    render(<ControlledTabs />);
    const runtimeTab = screen.getByRole('tab', { name: 'Runtime' });
    runtimeTab.focus();
    fireEvent.keyDown(runtimeTab, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Signals' })).toHaveAttribute('aria-selected', 'true'));
    expect(screen.getByRole('tab', { name: 'Signals' })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Signals' }), { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Archive' })).toHaveAttribute('aria-selected', 'true'));
    expect(onValueChange).toHaveBeenCalledWith('archive');

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Archive' }), { key: 'Home' });
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Runtime' })).toHaveAttribute('aria-selected', 'true'));
  });
});

describe('ZyrnTooltip', () => {
  it('opens immediately on focus, links the trigger through aria-describedby, and closes on Escape', () => {
    render(
      <ZyrnTooltip content="Keyboard shortcut: Shift + K">
        <button type="button">Protocol help</button>
      </ZyrnTooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Protocol help' });
    fireEvent.focus(trigger);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Keyboard shortcut: Shift + K');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('opens after its hover delay and preserves an existing aria-describedby value', () => {
    vi.useFakeTimers();
    render(
      <ZyrnTooltip content="Deployment policy" delayDuration={300}>
        <button type="button" aria-describedby="external-description">Hover policy</button>
      </ZyrnTooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover policy' });
    fireEvent.mouseEnter(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Deployment policy');
    expect(trigger.getAttribute('aria-describedby')).toContain('external-description');

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

describe('ZyrnSeparator', () => {
  it('renders decorative separators as hidden and labelled separators with semantic orientation', () => {
    const { rerender, container } = render(<ZyrnSeparator />);
    const decorative = container.firstElementChild;
    expect(decorative).toHaveAttribute('aria-hidden', 'true');
    expect(decorative).not.toHaveAttribute('role');

    rerender(<ZyrnSeparator orientation="vertical" weight="strong" label="Section boundary" />);
    const separator = screen.getByRole('separator', { name: 'Section boundary' });
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('zyrn-separator--strong');
  });
});

describe('Navigation primitive accessibility audit', () => {
  it('has no detectable axe violations for a representative navigation fixture', async () => {
    const { container } = render(
      <main aria-label="Navigation primitive accessibility fixture">
        <ZyrnTabs label="System views" defaultValue="runtime" tabs={tabItems.slice(0, 2)} />
        <ZyrnTooltip content="View protocol details"><button type="button">Protocol help</button></ZyrnTooltip>
        <ZyrnSeparator label="Navigation boundary" decorative={false} />
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
