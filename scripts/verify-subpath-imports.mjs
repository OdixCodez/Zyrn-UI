import { access } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const subpaths = {
  alert: 'ZyrnAlert',
  'alert-dialog': 'ZyrnAlertDialog',
  badge: 'ZyrnBadge',
  button: 'ZyrnButton',
  card: 'ZyrnCard',
  checkbox: 'ZyrnCheckbox',
  container: 'ZyrnContainer',
  'context-menu': 'ZyrnContextMenu',
  drawer: 'ZyrnDrawer',
  dropdown: 'ZyrnDropdown',
  'empty-state': 'ZyrnEmptyState',
  field: 'ZyrnField',
  grid: 'ZyrnGrid',
  inline: 'ZyrnInline',
  input: 'ZyrnInput',
  modal: 'ZyrnModal',
  popover: 'ZyrnPopover',
  progress: 'ZyrnProgress',
  'radio-group': 'ZyrnRadioGroup',
  'segmented-control': 'ZyrnSegmentedControl',
  select: 'ZyrnSelect',
  separator: 'ZyrnSeparator',
  skeleton: 'ZyrnSkeleton',
  stack: 'ZyrnStack',
  switch: 'ZyrnSwitch',
  tabs: 'ZyrnTabs',
  textarea: 'ZyrnTextarea',
  toast: 'ZyrnToast',
  tooltip: 'ZyrnTooltip',
  'visually-hidden': 'ZyrnVisuallyHidden',
};

for (const [subpath, expectedExport] of Object.entries(subpaths)) {
  const esmEntry = path.join(rootDir, 'dist', `${subpath}.mjs`);
  const cjsEntry = path.join(rootDir, 'dist', `${subpath}.js`);
  const declarationEntry = path.join(rootDir, 'dist', `${subpath}.d.ts`);
  await Promise.all([access(esmEntry), access(cjsEntry), access(declarationEntry)]);

  const esmModule = await import(`zyrn-ui/${subpath}`);
  const cjsModule = require(`zyrn-ui/${subpath}`);
  if (!(expectedExport in esmModule) || !(expectedExport in cjsModule)) {
    throw new Error(`Subpath zyrn-ui/${subpath} does not expose ${expectedExport} in both module formats.`);
  }
}

console.log(`Verified ${Object.keys(subpaths).length} Zyrn-UI component subpaths in ESM, CommonJS, and declaration output.`);
