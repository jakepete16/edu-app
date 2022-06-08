import React, { Context, createContext, useEffect, useState } from "react";

/*
this page accepts data units and inserts their props into the background loader. according to the number of pages specified in the main index.ts, the loaderProvider will
load the specific data units onto the map, regardless of if the current page is chosen
*/

interface BackgroundLoaderContextValues<I> {
  items: I[];
  isLoading: boolean;
}

export function createBackgroundLoaderContext<I>(): Context<BackgroundLoaderContextValues<I>> {
  return createContext<BackgroundLoaderContextValues<I>>({
    isLoading: false,
    items: [],
  });
}

interface BackgroundLoaderProviderProps<I> {
  children: React.ReactNode;
  numPages?: number;
  fetchFn: (page: number) => Promise<I[]>;
  context: Context<BackgroundLoaderContextValues<I>>;
}

/**
 * A reusable context that loads data when the app is first loaded. Useful for
 * paginated async data that takes a long time to load.
 */
export function BackgroundLoaderProvider<I>({
  children,
  numPages,
  fetchFn,
  context,
}: BackgroundLoaderProviderProps<I>): JSX.Element {
  const [items, setItems] = useState<I[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData(page: number) {
      return fetchFn(page);
    }

    const num = numPages ?? 1;

    setIsLoading(true);
    for (let i = 0; i < num; i++) {
      setIsLoading(true);
      fetchData(i)
        .then(data => {
          setItems(itms => [...itms, ...data]);
        })
        .finally(() => {
          if (i === num - 1) setIsLoading(false);
        });
    }
  }, [numPages, fetchFn]);

  return <context.Provider value={{ isLoading, items }}>{children}</context.Provider>;
}
