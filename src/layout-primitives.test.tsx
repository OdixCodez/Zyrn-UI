import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  ZyrnContainer,
  ZyrnGrid,
  ZyrnInline,
  ZyrnStack,
  ZyrnVisuallyHidden,
} from './index';

describe('ZyrnStack and ZyrnInline', () => {
  it('applies tokenized spacing, layout options, semantic wrappers, and forwarded refs', () => {
    const stackRef = createRef<HTMLElement>();
    const inlineRef = createRef<HTMLElement>();
    render(
      <>
        <ZyrnStack ref={stackRef} as="section" aria-label="Deployment stages" gap={5} align="center" divider>
          <span>Prepare</span>
          <span>Deploy</span>
        </ZyrnStack>
        <ZyrnInline ref={inlineRef} as="nav" aria-label="Release actions" gap={2} justify="between" wrap={false}>
          <button type="button">Save</button>
          <button type="button">Deploy</button>
        </ZyrnInline>
      </>,
    );

    const stack = screen.getByRole('region', { name: 'Deployment stages' });
    const inline = screen.getByRole('navigation', { name: 'Release actions' });
    expect(stackRef.current).toBe(stack);
    expect(inlineRef.current).toBe(inline);
    expect(stack).toHaveClass('zyrn-stack--gap-5', 'zyrn-stack--align-center', 'zyrn-stack--divider');
    expect(inline).toHaveClass('zyrn-inline--gap-2', 'zyrn-inline--justify-between');
    expect(inline).not.toHaveClass('zyrn-inline--wrap');
  });
});

describe('ZyrnGrid and ZyrnContainer', () => {
  it('supports responsive auto-fit grids, fixed columns, and semantic containers', () => {
    const { rerender } = render(
      <ZyrnContainer as="main" size="xl" padding={6} aria-label="Release workspace">
        <ZyrnGrid data-testid="grid" minItemWidth="12rem" gap={3}>
          <div>One</div>
          <div>Two</div>
        </ZyrnGrid>
      </ZyrnContainer>,
    );

    const container = screen.getByRole('main', { name: 'Release workspace' });
    const grid = screen.getByTestId('grid');
    expect(container).toHaveClass('zyrn-container--xl', 'zyrn-container--padding-6');
    expect(grid).toHaveClass('zyrn-grid--auto', 'zyrn-grid--gap-3');
    expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(min(12rem, 100%), 1fr))' });

    rerender(<ZyrnGrid data-testid="grid" columns={3} gap={2}><div>One</div><div>Two</div><div>Three</div></ZyrnGrid>);
    expect(screen.getByTestId('grid')).toHaveClass('zyrn-grid--columns-3', 'zyrn-grid--gap-2');
    expect(screen.getByTestId('grid')).toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' });
  });
});

describe('ZyrnVisuallyHidden', () => {
  it('provides an accessible name for otherwise icon-only controls while preserving its visually hidden class', () => {
    render(
      <button type="button">
        <span aria-hidden="true">?</span>
        <ZyrnVisuallyHidden>Inspect system signal</ZyrnVisuallyHidden>
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Inspect system signal' })).toBeInTheDocument();
    expect(screen.getByText('Inspect system signal')).toHaveClass('zyrn-visually-hidden');
  });
});

describe('Layout primitive accessibility audit', () => {
  it('has no detectable axe violations for a representative composed layout', async () => {
    const { container } = render(
      <ZyrnContainer as="main" aria-label="Layout accessibility fixture">
        <ZyrnStack as="section" aria-label="Release summary" gap={4}>
          <ZyrnInline as="nav" aria-label="Release actions"><button type="button">Save</button></ZyrnInline>
          <ZyrnGrid columns={2}><div>Version</div><div>Status</div></ZyrnGrid>
          <button type="button"><ZyrnVisuallyHidden>Open diagnostics</ZyrnVisuallyHidden><span aria-hidden="true">!</span></button>
        </ZyrnStack>
      </ZyrnContainer>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
