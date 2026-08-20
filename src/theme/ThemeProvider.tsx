import React, { createContext, useContext, useMemo, useState } from 'react';

export type ZyrnTheme = 'ink' | 'paper';

export interface ZyrnThemeContextValue {
  theme: ZyrnTheme;
  setTheme: (theme: ZyrnTheme) => void;
  toggleTheme: () => void;
}

export interface ZyrnThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTheme?: ZyrnTheme;
  children: React.ReactNode;
}

const ZyrnThemeContext = createContext<ZyrnThemeContextValue | null>(null);

export function useZyrnTheme(): ZyrnThemeContextValue {
  const context = useContext(ZyrnThemeContext);

  if (!context) {
    throw new Error('useZyrnTheme must be used inside a ZyrnThemeProvider.');
  }

  return context;
}

export const ZyrnThemeProvider = React.forwardRef<HTMLDivElement, ZyrnThemeProviderProps>(function ZyrnThemeProvider(
  {
    defaultTheme = 'ink',
    children,
    className = '',
    ...rest
  },
  ref,
) {
  const [theme, setTheme] = useState<ZyrnTheme>(defaultTheme);
  const value = useMemo<ZyrnThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => current === 'ink' ? 'paper' : 'ink'),
  }), [theme]);

  return (
    <ZyrnThemeContext.Provider value={value}>
      <div ref={ref} data-theme={theme} className={['zyrn-theme-provider', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </div>
    </ZyrnThemeContext.Provider>
  );
});

ZyrnThemeProvider.displayName = 'ZyrnThemeProvider';

export default ZyrnThemeProvider;
