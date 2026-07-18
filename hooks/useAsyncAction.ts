import { useCallback, useState } from 'react';

/**
 * Simple async action helper for placeholder screens / future mutations.
 */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        const next = err instanceof Error ? err : new Error('Action failed');
        setError(next);
        throw next;
      } finally {
        setIsLoading(false);
      }
    },
    [action],
  );

  return { run, isLoading, error };
}
