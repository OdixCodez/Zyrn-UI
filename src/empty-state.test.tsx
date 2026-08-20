import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ZyrnEmptyState } from './index';

describe('ZyrnEmptyState', () => {
  it('creates a labelled semantic region with the requested heading hierarchy and descriptive content', () => {
    render(
      <ZyrnEmptyState
        title="No deployment records"
        description="Create a release to begin tracking deployment history."
        headingLevel={3}
      />,
    );

    expect(screen.getByRole('region', { name: 'No deployment records' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No deployment records', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Create a release to begin tracking deployment history.')).toBeInTheDocument();
  });

  it('keeps decorative marks hidden from assistive technology and exposes labelled primary and secondary actions', () => {
    const onCreate = vi.fn();
    const onLearn = vi.fn();
    const { container } = render(
      <ZyrnEmptyState
        title="No deployments"
        icon="!"
        stamp="空"
        primaryAction={{ label: 'Create release', onClick: onCreate }}
        secondaryAction={{ label: 'Read guide', onClick: onLearn, type: 'submit' }}
      />,
    );

    expect(container.querySelector('.zyrn-empty-state__mark')).toHaveAttribute('aria-hidden', 'true');
    const primary = screen.getByRole('button', { name: 'Create release' });
    const secondary = screen.getByRole('button', { name: 'Read guide' });
    expect(primary).toHaveAttribute('type', 'button');
    expect(secondary).toHaveAttribute('type', 'submit');
    fireEvent.click(primary);
    fireEvent.click(secondary);
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onLearn).toHaveBeenCalledTimes(1);
  });

  it('honors disabled action state and forwards the region ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <ZyrnEmptyState
        ref={ref}
        title="No access"
        primaryAction={{ label: 'Request access', disabled: true }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Request access' })).toBeDisabled();
    expect(ref.current).toHaveClass('zyrn-empty-state');
  });

  it('has no detectable axe violations with content and actions', async () => {
    const { container } = render(
      <ZyrnEmptyState
        title="No deployment records"
        description="Create a release to begin tracking deployment history."
        primaryAction={{ label: 'Create release' }}
        secondaryAction={{ label: 'Read the guide' }}
      />,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
