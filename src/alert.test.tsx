import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ZyrnAlert } from './index';

describe('ZyrnAlert', () => {
  it('uses polite status semantics by default and renders a hidden decorative marker', () => {
    render(<ZyrnAlert title="Deployment queued">The release will begin shortly.</ZyrnAlert>);

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Deployment queued');
    expect(alert).toHaveTextContent('The release will begin shortly.');
    expect(alert.querySelector('.zyrn-alert__marker')).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses assertive alert semantics for danger and lets callers override announcement behavior', () => {
    const { rerender } = render(<ZyrnAlert title="Deployment blocked" variant="danger" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Deployment blocked');

    rerender(<ZyrnAlert title="Historical record" role="none" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Historical record')).toBeInTheDocument();
  });

  it('renders an optional explicitly-labelled native dismiss button', () => {
    const onDismiss = vi.fn();
    render(<ZyrnAlert title="Review required" onDismiss={onDismiss} dismissLabel="Dismiss review warning" />);

    const dismiss = screen.getByRole('button', { name: 'Dismiss review warning' });
    expect(dismiss).toHaveAttribute('type', 'button');
    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('forwards its ref to the alert root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ZyrnAlert ref={ref} title="Runtime nominal" />);
    expect(ref.current).toHaveClass('zyrn-alert');
  });

  it('has no detectable axe violations for a dismissible inline alert', async () => {
    const { container } = render(
      <ZyrnAlert variant="warning" title="Review required" onDismiss={() => {}}>
        Verify the release notes before continuing.
      </ZyrnAlert>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
