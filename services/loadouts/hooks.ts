import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchLoadouts } from "./api";
import { LoadoutsQueryParams, LoadoutsResponse } from "./types";

type UseLoadoutsResult = {
  data: LoadoutsResponse | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

function areParamsEqual(
  a?: LoadoutsQueryParams,
  b?: LoadoutsQueryParams
): boolean {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

export function useLoadouts(params?: LoadoutsQueryParams): UseLoadoutsResult {
  const [data, setData] = useState<LoadoutsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const paramsRef = useRef<LoadoutsQueryParams | undefined>(params);

  const stableParams = useMemo(() => params, [JSON.stringify(params ?? {})]);

  const load = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      try {
        if (mode === "initial") {
          setIsLoading(true);
        } else {
          setIsRefetching(true);
        }

        setError(null);

        const result = await fetchLoadouts(stableParams);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    },
    [stableParams]
  );

  useEffect(() => {
    if (!areParamsEqual(paramsRef.current, stableParams)) {
      paramsRef.current = stableParams;
    }

    load("initial");
  }, [stableParams, load]);

  const refetch = useCallback(async () => {
    await load("refresh");
  }, [load]);

  return {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
  };
}