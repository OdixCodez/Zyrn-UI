import { createRef } from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ZyrnSkeleton } from './index';

describe('ZyrnSkeleton', () => {
  it('is always hidden from assistive technology and renders the requested number of text lines', () => {
    const { container } = render(<ZyrnSkeleton variant="text" lines={4} />);

    const skeleton = container.querySelector('.zyrn-skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.zyrn-skeleton__line')).toHaveLength(4);
  });

  it('supports circle and rectangle geometry through typed dimensions', () => {
    const { container, rerender } = render(<ZyrnSkeleton variant="circle" width={48} height={36} />);
    const circle = container.querySelector('.zyrn-skeleton');
    expect(circle).toHaveClass('zyrn-skeleton--circle');
    expect(circle).toHaveStyle({ '--zyrn-skeleton-width': '48px', '--zyrn-skeleton-height': '36px' });

    rerender(<ZyrnSkeleton variant="rect" width="16rem" height="9rem" />);
    const rectangle = container.querySelector('.zyrn-skeleton');
    expect(rectangle).toHaveClass('zyrn-skeleton--rect');
    expect(rectangle).toHaveStyle({ '--zyrn-skeleton-width': '16rem', '--zyrn-skeleton-height': '9rem' });
  });

  it('allows motion to be disabled and forwards the root ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ZyrnSkeleton ref={ref} animate={false} />);

    expect(container.querySelector('.zyrn-skeleton')).toHaveClass('zyrn-skeleton--static');
    expect(ref.current).toHaveClass('zyrn-skeleton');
  });

  it('has no detectable axe violations as a decorative loading placeholder', async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Loading deployment data">
        <ZyrnSkeleton variant="text" lines={3} />
        <ZyrnSkeleton variant="circle" width={32} />
      </section>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
