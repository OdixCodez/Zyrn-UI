import { createRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  ZyrnCheckbox,
  ZyrnRadioGroup,
  ZyrnSegmentedControl,
  ZyrnSwitch,
} from './index';

describe('ZyrnCheckbox', () => {
  it('forwards its ref and links the native control to visible label, description, and error text', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <ZyrnCheckbox
        ref={ref}
        label="Accept operating rules"
        kanji="承認"
        description="Required before deployment."
        error="Approval is required."
        required
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /accept operating rules/i });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription(/required before deployment.*approval is required/i);
    expect(screen.getByRole('alert')).toHaveTextContent('Approval is required.');
  });

  it('supports uncontrolled, controlled, disabled, and indeterminate checkbox states', () => {
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);
      return <ZyrnCheckbox label="Controlled approval" checked={checked} onChange={(event) => setChecked(event.target.checked)} />;
    }

    const { rerender } = render(
      <>
        <ZyrnCheckbox label="Uncontrolled approval" defaultChecked />
        <ZyrnCheckbox label="Partial approval" indeterminate />
        <ZyrnCheckbox label="Locked approval" disabled />
        <ControlledCheckbox />
      </>,
    );

    expect(screen.getByRole('checkbox', { name: 'Uncontrolled approval' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Partial approval' })).toBePartiallyChecked();
    expect(screen.getByRole('checkbox', { name: 'Partial approval' })).toHaveAttribute('aria-checked', 'mixed');

    const locked = screen.getByRole('checkbox', { name: 'Locked approval' });
    expect(locked).toBeDisabled();

    const controlled = screen.getByRole('checkbox', { name: 'Controlled approval' });
    fireEvent.click(controlled);
    expect(controlled).toBeChecked();

    rerender(<ZyrnCheckbox label="Partial approval" indeterminate={false} />);
    expect(screen.getByRole('checkbox', { name: 'Partial approval' })).not.toBePartiallyChecked();
  });
});

describe('ZyrnSwitch', () => {
  it('exposes switch semantics and associates helper and error messages with the native control', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <ZyrnSwitch
        ref={ref}
        label="Telemetry stream"
        description="Sends real-time diagnostic signals."
        error="Telemetry is required for this mode."
        required
      />,
    );

    const switchControl = screen.getByRole('switch', { name: 'Telemetry stream' });
    expect(ref.current).toBe(switchControl);
    expect(switchControl).toBeRequired();
    expect(switchControl).toHaveAttribute('aria-invalid', 'true');
    expect(switchControl).toHaveAccessibleDescription(/sends real-time diagnostic signals.*telemetry is required/i);
    expect(screen.getByRole('alert')).toHaveTextContent('Telemetry is required for this mode.');
  });

  it('updates controlled switch state and preserves disabled state', () => {
    function ControlledSwitch() {
      const [checked, setChecked] = useState(false);
      return <ZyrnSwitch label="Controlled telemetry" checked={checked} onChange={(event) => setChecked(event.target.checked)} />;
    }

    render(
      <>
        <ZyrnSwitch label="Default telemetry" defaultChecked />
        <ZyrnSwitch label="Locked telemetry" disabled defaultChecked />
        <ControlledSwitch />
      </>,
    );

    expect(screen.getByRole('switch', { name: 'Default telemetry' })).toBeChecked();
    const locked = screen.getByRole('switch', { name: 'Locked telemetry' });
    expect(locked).toBeChecked();
    expect(locked).toBeDisabled();

    const controlled = screen.getByRole('switch', { name: 'Controlled telemetry' });
    fireEvent.click(controlled);
    expect(controlled).toBeChecked();
  });
});

describe('ZyrnRadioGroup', () => {
  const options = [
    { value: 'stable', label: 'Stable', description: 'Recommended production channel.' },
    { value: 'edge', label: 'Edge', description: 'Early access channel.' },
    { value: 'locked', label: 'Locked', disabled: true },
  ];

  it('provides a labelled native radio group with group-level feedback and disabled options', () => {
    render(
      <ZyrnRadioGroup
        label="Release channel"
        description="Choose one channel for this deployment."
        error="A channel is required."
        required
        defaultValue="stable"
        options={options}
      />,
    );

    const group = screen.getByRole('group', { name: 'Release channel' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription(/choose one channel.*a channel is required/i);
    expect(screen.getByRole('radio', { name: /stable/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /stable/i })).toBeRequired();
    expect(screen.getByRole('radio', { name: /locked/i })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('A channel is required.');
  });

  it('supports controlled and uncontrolled value changes without selecting a disabled option', () => {
    const onValueChange = vi.fn();
    function ControlledRadioGroup() {
      const [value, setValue] = useState('stable');
      return <ZyrnRadioGroup label="Controlled channel" value={value} onValueChange={setValue} options={options} />;
    }

    render(
      <>
        <ZyrnRadioGroup label="Uncontrolled channel" defaultValue="stable" onValueChange={onValueChange} options={options} />
        <ControlledRadioGroup />
      </>,
    );

    fireEvent.click(screen.getAllByRole('radio', { name: /edge/i })[0]);
    expect(screen.getAllByRole('radio', { name: /edge/i })[0]).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('edge');

    const locked = screen.getAllByRole('radio', { name: /locked/i })[0];
    expect(locked).toBeDisabled();

    const controlledEdge = screen.getAllByRole('radio', { name: /edge/i })[1];
    fireEvent.click(controlledEdge);
    expect(controlledEdge).toBeChecked();
  });
});

describe('ZyrnSegmentedControl', () => {
  const options = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'locked', label: 'Locked', disabled: true },
    { value: 'spacious', label: 'Spacious' },
  ];

  it('uses a labelled radio-group pattern with feedback associations and disabled options', () => {
    render(
      <ZyrnSegmentedControl
        label="Interface density"
        description="Set the information density."
        error="Choose a density."
        defaultValue="normal"
        options={options}
      />,
    );

    const group = screen.getByRole('radiogroup', { name: 'Interface density' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription(/set the information density.*choose a density/i);
    expect(screen.getByRole('radio', { name: 'Normal' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Normal' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Locked' })).toBeDisabled();
  });

  it('supports controlled updates and keyboard navigation that skips disabled segments', async () => {
    const onValueChange = vi.fn();
    function ControlledSegmentedControl() {
      const [value, setValue] = useState('normal');
      return <ZyrnSegmentedControl label="Controlled density" value={value} onValueChange={setValue} options={options} />;
    }

    render(
      <>
        <ZyrnSegmentedControl label="Uncontrolled density" defaultValue="normal" onValueChange={onValueChange} options={options} />
        <ControlledSegmentedControl />
      </>,
    );

    const uncontrolledNormal = screen.getAllByRole('radio', { name: 'Normal' })[0];
    uncontrolledNormal.focus();
    fireEvent.keyDown(uncontrolledNormal, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getAllByRole('radio', { name: 'Spacious' })[0]).toHaveAttribute('aria-checked', 'true'));
    expect(screen.getAllByRole('radio', { name: 'Spacious' })[0]).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith('spacious');

    const uncontrolledSpacious = screen.getAllByRole('radio', { name: 'Spacious' })[0];
    fireEvent.keyDown(uncontrolledSpacious, { key: 'Home' });
    await waitFor(() => expect(screen.getAllByRole('radio', { name: 'Compact' })[0]).toHaveAttribute('aria-checked', 'true'));

    const controlledSpacious = screen.getAllByRole('radio', { name: 'Spacious' })[1];
    fireEvent.click(controlledSpacious);
    expect(controlledSpacious).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Selection-control accessibility audit', () => {
  it('has no detectable axe violations across a representative selection form', async () => {
    const { container } = render(
      <main aria-label="Selection control accessibility fixture">
        <ZyrnCheckbox label="Accept operating rules" description="Required before deployment." />
        <ZyrnSwitch label="Telemetry stream" description="Sends diagnostic signals." />
        <ZyrnRadioGroup label="Release channel" defaultValue="stable" options={[
          { value: 'stable', label: 'Stable' },
          { value: 'edge', label: 'Edge' },
        ]} />
        <ZyrnSegmentedControl label="Interface density" defaultValue="normal" options={[
          { value: 'compact', label: 'Compact' },
          { value: 'normal', label: 'Normal' },
        ]} />
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
