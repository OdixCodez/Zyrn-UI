import { defineConfig } from 'tsup';

const componentEntries = {
  alert: 'src/components/Alert/index.ts',
  'alert-dialog': 'src/components/AlertDialog/index.ts',
  badge: 'src/components/Badge/index.ts',
  button: 'src/components/Button/index.ts',
  card: 'src/components/Card/index.ts',
  checkbox: 'src/components/Checkbox/index.ts',
  container: 'src/components/Container/index.ts',
  'context-menu': 'src/components/ContextMenu/index.ts',
  drawer: 'src/components/Drawer/index.ts',
  dropdown: 'src/components/Dropdown/index.ts',
  'empty-state': 'src/components/EmptyState/index.ts',
  field: 'src/components/Field/index.ts',
  grid: 'src/components/Grid/index.ts',
  inline: 'src/components/Inline/index.ts',
  input: 'src/components/Input/index.ts',
  modal: 'src/components/Modal/index.ts',
  popover: 'src/components/Popover/index.ts',
  progress: 'src/components/Progress/index.ts',
  'radio-group': 'src/components/RadioGroup/index.ts',
  'segmented-control': 'src/components/SegmentedControl/index.ts',
  select: 'src/components/Select/index.ts',
  separator: 'src/components/Separator/index.ts',
  skeleton: 'src/components/Skeleton/index.ts',
  stack: 'src/components/Stack/index.ts',
  switch: 'src/components/Switch/index.ts',
  tabs: 'src/components/Tabs/index.ts',
  textarea: 'src/components/Textarea/index.ts',
  toast: 'src/components/Toast/index.ts',
  tooltip: 'src/components/Tooltip/index.ts',
  'visually-hidden': 'src/components/VisuallyHidden/index.ts',
};

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    ...componentEntries,
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
});
