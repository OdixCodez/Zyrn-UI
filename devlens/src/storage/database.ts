import type {
  FocusProfile,
  FocusSession,
  ResearchSession,
  SavedComponent,
  Snippet,
  UserScript,
} from '../types';

const DATABASE_NAME = 'devlens';
const DATABASE_VERSION = 1;

type StoreName = 'snippets' | 'components' | 'scripts' | 'focusProfiles' | 'researchSessions' | 'meta';

export interface DevLensBackup {
  version: 1;
  exportedAt: string;
  snippets: Snippet[];
  components: SavedComponent[];
  scripts: UserScript[];
  focusProfiles: FocusProfile[];
  researchSessions: ResearchSession[];
  settings?: unknown;
  focusSession?: FocusSession | null;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local DevLens storage.'));
    request.onupgradeneeded = () => {
      const database = request.result;
      const stores: StoreName[] = ['snippets', 'components', 'scripts', 'focusProfiles', 'researchSessions', 'meta'];
      for (const store of stores) {
        if (!database.objectStoreNames.contains(store)) {
          database.createObjectStore(store, { keyPath: 'id' });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function transaction<T>(store: StoreName, mode: IDBTransactionMode, run: (objectStore: IDBObjectStore) => IDBRequest<any>): Promise<T> {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const request = run(database.transaction(store, mode).objectStore(store));
    request.onerror = () => reject(request.error ?? new Error(`Unable to access ${store}.`));
    request.onsuccess = () => resolve(request.result as T);
  }).finally(() => database.close());
}

export const localDatabase = {
  async list<T>(store: Exclude<StoreName, 'meta'>): Promise<T[]> {
    return transaction<T[]>(store, 'readonly', (objectStore) => objectStore.getAll());
  },
  async get<T>(store: StoreName, id: string): Promise<T | undefined> {
    return transaction<T | undefined>(store, 'readonly', (objectStore) => objectStore.get(id));
  },
  async put<T extends { id: string }>(store: StoreName, value: T): Promise<T> {
    await transaction<IDBValidKey>(store, 'readwrite', (objectStore) => objectStore.put(value));
    return value;
  },
  async delete(store: StoreName, id: string): Promise<void> {
    await transaction<undefined>(store, 'readwrite', (objectStore) => objectStore.delete(id));
  },
  async clear(store: StoreName): Promise<void> {
    await transaction<undefined>(store, 'readwrite', (objectStore) => objectStore.clear());
  },
  async exportAll(settings?: unknown, focusSession?: FocusSession | null): Promise<DevLensBackup> {
    const [snippets, components, scripts, focusProfiles, researchSessions] = await Promise.all([
      this.list<Snippet>('snippets'),
      this.list<SavedComponent>('components'),
      this.list<UserScript>('scripts'),
      this.list<FocusProfile>('focusProfiles'),
      this.list<ResearchSession>('researchSessions'),
    ]);
    return { version: 1, exportedAt: new Date().toISOString(), snippets, components, scripts, focusProfiles, researchSessions, settings, focusSession };
  },
  async importAll(backup: DevLensBackup): Promise<void> {
    if (backup.version !== 1) throw new Error('This backup format is not supported.');
    await Promise.all([
      ...backup.snippets.map((item) => this.put('snippets', item)),
      ...backup.components.map((item) => this.put('components', item)),
      ...backup.scripts.map((item) => this.put('scripts', item)),
      ...backup.focusProfiles.map((item) => this.put('focusProfiles', item)),
      ...backup.researchSessions.map((item) => this.put('researchSessions', item)),
    ]);
  },
};
