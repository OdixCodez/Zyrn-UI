import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ZyrnButton, ZyrnCard, ZyrnInput } from './index';

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
