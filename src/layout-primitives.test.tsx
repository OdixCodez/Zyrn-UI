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


describe('ZyrnStack', () => {
  it('uses sensible default rhythm and supports overriding gap, alignment, divider, native props, and inline styles', () => {
    const { rerender } = render(
      <ZyrnStack data-testid="stack" style={{ backgroundColor: 'rgb(1, 2, 3)' }}>
        <span>First</span>
        <span>Second</span>
      </ZyrnStack>,
    );

    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('zyrn-stack--gap-4', 'zyrn-stack--align-stretch');
    expect(stack).not.toHaveClass('zyrn-stack--divider');
    expect(stack).toHaveStyle({ backgroundColor: 'rgb(1, 2, 3)' });

    rerender(
      <ZyrnStack as="ol" aria-label="Deployment sequence" data-testid="stack" gap={0} align="end" divider>
        <li>Prepare</li>
        <li>Deploy</li>
      </ZyrnStack>,
    );

    const sequence = screen.getByRole('list', { name: 'Deployment sequence' });
    expect(sequence).toHaveClass('zyrn-stack--gap-0', 'zyrn-stack--align-end', 'zyrn-stack--divider');
    const items = screen.getAllByRole('listitem');
    expect(sequence).toContainElement(items[0]);
    expect(sequence).toContainElement(items[1]);
    expect(items[0]).toHaveTextContent('Prepare');
    expect(items[1]).toHaveTextContent('Deploy');
  });
});

describe('ZyrnGrid', () => {
  it('forwards its ref and preserves custom element semantics, props, and responsive sizing in both auto-fit and fixed modes', () => {
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
      <ZyrnGrid
        ref={ref}
        as="section"
        aria-label="Release cards"
        data-testid="responsive-grid"
        minItemWidth="21ch"
        gap={8}
        style={{ backgroundColor: 'rgb(4, 5, 6)' }}
      >
        <article>Runtime</article>
        <article>Signals</article>
      </ZyrnGrid>,
    );

    const grid = screen.getByRole('region', { name: 'Release cards' });
    expect(ref.current).toBe(grid);
    expect(grid).toHaveClass('zyrn-grid--auto', 'zyrn-grid--gap-8');
    expect(grid).toHaveStyle({
      backgroundColor: 'rgb(4, 5, 6)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(21ch, 100%), 1fr))',
    });

    rerender(
      <ZyrnGrid as="section" aria-label="Release cards" data-testid="responsive-grid" columns={12} gap={0}>
        <article>Runtime</article>
      </ZyrnGrid>,
    );

    const fixedGrid = screen.getByRole('region', { name: 'Release cards' });
    expect(fixedGrid).toHaveClass('zyrn-grid--columns-12', 'zyrn-grid--gap-0');
    expect(fixedGrid).toHaveStyle({ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' });
  });
});

describe('ZyrnStack accessibility audit', () => {
  it('has no detectable axe violations as a labelled semantic list layout', async () => {
    const { container } = render(
      <ZyrnStack as="ol" aria-label="Release sequence" divider>
        <li>Validate package</li>
        <li>Publish release</li>
      </ZyrnStack>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});

describe('ZyrnGrid accessibility audit', () => {
  it('has no detectable axe violations as a labelled semantic content region', async () => {
    const { container } = render(
      <ZyrnGrid as="section" aria-label="System status cards" columns={2}>
        <article><h2>Runtime</h2><p>Nominal</p></article>
        <article><h2>Signals</h2><p>Observed</p></article>
      </ZyrnGrid>,
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
