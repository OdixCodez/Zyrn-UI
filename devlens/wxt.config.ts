import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'DevLens',
    description: 'A local-first developer workspace for inspecting, experimenting with, and researching the web.',
    permissions: [
      'activeTab',
      'alarms',
      'scripting',
      'storage',
    ],
    optional_permissions: ['tabs'],
    optional_host_permissions: ['*://*/*'],
    action: {
      default_title: 'Open DevLens',
    },
    commands: {
      inspect_current_page: {
        suggested_key: { default: 'Ctrl+Shift+I', mac: 'MacCtrl+Shift+I' },
        description: 'Toggle DevLens inspector for the active page',
      },
      open_playground: {
        suggested_key: { default: 'Ctrl+Shift+P', mac: 'MacCtrl+Shift+P' },
        description: 'Open DevLens playground',
      },
      toggle_focus: {
        suggested_key: { default: 'Ctrl+Shift+F', mac: 'MacCtrl+Shift+F' },
        description: 'Toggle the active DevLens focus session',
      },
    },
    browser_specific_settings: browser === 'firefox'
      ? { gecko: { id: 'devlens@local.dev', strict_min_version: '140.0', data_collection_permissions: { required: ['none'] } } }
      : undefined,
  }),
});
