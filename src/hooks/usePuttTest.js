import { useMemo, useState, useCallback } from "react";
import {
  generatePuttSequence,
  TOTAL_PUTTS,
  DISTANCES,
} from "../utils/sequence.js";

/**
 * Hallinnoi yhden puttitestin (25 puttia) tilaa: nykyinen etäisyys,
 * edistyminen, vastaushistoria ja "peruuta edellinen" -toiminto.
 */
export function usePuttTest() {
  const sequence = useMemo(() => generatePuttSequence(), []);
  const [attempts, setAttempts] = useState([]); // [{ distance, made }, ...]

  const currentIndex = attempts.length;
  const isFinished = currentIndex >= TOTAL_PUTTS;
  const currentDistance = isFinished ? null : sequence[currentIndex];

  const answer = useCallback(
    (made) => {
      if (isFinished) return;
      setAttempts((prev) => [...prev, { distance: sequence[currentIndex], made }]);
    },
    [isFinished, sequence, currentIndex]
  );

  const undoLast = useCallback(() => {
    setAttempts((prev) => prev.slice(0, -1));
  }, []);

  // Etäisyyskohtainen edistyminen "yhdellä silmäyksellä" -osiota varten
  const progressByDistance = useMemo(() => {
    const map = {};
    DISTANCES.forEach((d) => (map[d] = 0));
    attempts.forEach((a) => {
      map[a.distance] = (map[a.distance] || 0) + 1;
    });
    return map;
  }, [attempts]);

  return {
    sequence,
    attempts,
    currentIndex,
    totalPutts: TOTAL_PUTTS,
    currentDistance,
    isFinished,
    progressByDistance,
    answer,
    undoLast,
    canUndo: attempts.length > 0,
  };
}
