import { useEffect, useMemo, useState } from "react";
import { contrastLevel } from "./contrast";
import { buildGraphic, encodeMatrix, graphicToSvg, type MatrixResult } from "./qr-engine";
import { buildPayload, isPayloadEmpty } from "./payload";
import { effectiveEcc, type QrState } from "./state";

export function useQrModel(state: QrState) {
  const payload = useMemo(() => buildPayload(state), [state]);
  const empty = isPayloadEmpty(state);
  const ecc = effectiveEcc(state);
  const [matrix, setMatrix] = useState<MatrixResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (empty) {
      setMatrix(null);
      setError("empty");
      return;
    }
    void encodeMatrix(payload, state).then((res) => {
      if (cancelled) return;
      if ("error" in res) {
        setError(res.error);
        setMatrix(null);
      } else {
        setError(null);
        setMatrix(res);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [payload, ecc, empty, state.logoEnabled, state.logoDataUrl]);

  const graphic = useMemo(
    () => (matrix ? buildGraphic(matrix, state) : null),
    [matrix, state],
  );
  const svg = useMemo(
    () => (graphic ? graphicToSvg(graphic, state) : ""),
    [graphic, state],
  );
  const contrast = contrastLevel(state.foregroundColor, state.backgroundColor);

  return { payload, empty, error, matrix, graphic, svg, contrast };
}
