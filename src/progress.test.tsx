import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ZyrnProgress } from './index';

describe('ZyrnProgress', () => {
  it('renders a labelled determinate progressbar with accessible values and description', () => {
    render(
      <ZyrnProgress
        label="Release upload"
        description="Uploading signed deployment assets."
        value={35}
      />,
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Release upload' });
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuenow', '35');
    expect(progressbar).toHaveAttribute('aria-valuetext', '35% complete');
    expect(progressbar).toHaveAttribute('aria-describedby');
    expect(screen.getByText('35% complete')).toHaveAttribute('aria-hidden', 'true');
  });

  it('clamps values inside the configured range and supports custom accessible value text', () => {
    const { rerender } = render(<ZyrnProgress label="Review" value={130} max={80} valueText="Final verification" />);
    expect(screen.getByRole('progressbar', { name: 'Review' })).toHaveAttribute('aria-valuenow', '80');
    expect(screen.getByRole('progressbar', { name: 'Review' })).toHaveAttribute('aria-valuetext', 'Final verification');

    rerender(<ZyrnProgress label="Review" value={-10} min={20} max={80} />);
    expect(screen.getByRole('progressbar', { name: 'Review' })).toHaveAttribute('aria-valuenow', '20');
  });

  it('treats non-finite values as indeterminate so invalid ARIA values and CSS widths are never emitted', () => {
    const { rerender } = render(<ZyrnProgress label="Release upload" value={Number.NaN} />);

    for (const invalidValue of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      rerender(<ZyrnProgress label="Release upload" value={invalidValue} />);
      const progressbar = screen.getByRole('progressbar', { name: 'Release upload' });
      expect(progressbar).toHaveClass('zyrn-progress__track--indeterminate');
      expect(progressbar).not.toHaveAttribute('aria-valuemin');
      expect(progressbar).not.toHaveAttribute('aria-valuemax');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
      expect(progressbar).toHaveAttribute('aria-valuetext', 'In progress');
      expect(progressbar.querySelector('.zyrn-progress__indicator')).not.toHaveAttribute('style');
    }
  });

  it('normalizes invalid ranges and blank value text to safe determinate defaults', () => {
    const { rerender } = render(<ZyrnProgress label="Review" value={50} min={Number.NaN} max={Number.POSITIVE_INFINITY} valueText="   " />);
    let progressbar = screen.getByRole('progressbar', { name: 'Review' });
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuetext', '50% complete');

    rerender(<ZyrnProgress label="Review" value={9} min={8} max={8} />);
    progressbar = screen.getByRole('progressbar', { name: 'Review' });
    expect(progressbar).toHaveAttribute('aria-valuemin', '8');
    expect(progressbar).toHaveAttribute('aria-valuemax', '9');
    expect(progressbar).toHaveAttribute('aria-valuenow', '9');
  });

  it('omits numeric ARIA values for indeterminate work while retaining an accessible activity description', () => {
    render(<ZyrnProgress label="Indexing records" description="This may take a moment." indeterminate />);

    const progressbar = screen.getByRole('progressbar', { name: 'Indexing records' });
    expect(progressbar).not.toHaveAttribute('aria-valuemin');
    expect(progressbar).not.toHaveAttribute('aria-valuemax');
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
    expect(progressbar).toHaveAttribute('aria-valuetext', 'In progress');
    expect(progressbar).toHaveClass('zyrn-progress__track--indeterminate');
    expect(screen.getByText('Working')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards its ref to the progress root and can hide visible progress text', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ZyrnProgress ref={ref} label="Synchronizing" value={50} showValue={false} />);

    expect(ref.current).toHaveClass('zyrn-progress');
    expect(screen.queryByText('50% complete')).not.toBeInTheDocument();
  });

  it('has no detectable axe violations for determinate and indeterminate states', async () => {
    const { container } = render(
      <>
        <ZyrnProgress label="Release upload" value={65} description="Uploading signed deployment assets." />
        <ZyrnProgress label="Indexing records" indeterminate />
      </>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
