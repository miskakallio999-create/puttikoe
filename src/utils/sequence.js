export const DISTANCES = [6, 9, 12, 15, 18];
export const PUTTS_PER_DISTANCE = 5;
export const TOTAL_PUTTS = DISTANCES.length * PUTTS_PER_DISTANCE;

/**
 * Arpoo 25 putin järjestyksen niin, että jokainen etäisyys esiintyy
 * tasan PUTTS_PER_DISTANCE kertaa.
 *
 * Toteutus: rakennetaan lista, jossa jokainen etäisyys on mukana
 * täsmälleen 5 kertaa, ja sekoitetaan se Fisher–Yates-algoritmilla.
 * Tämä takaa saman lopputuloksen kuin "arvo aina jäljellä olevista
 * etäisyyksistä" -menetelmä, mutta on yksinkertaisempi ja täysin
 * tasajakautunut ilman vinoumaa kierroksen loppupäässä.
 */
export function generatePuttSequence(
  distances = DISTANCES,
  perDistance = PUTTS_PER_DISTANCE
) {
  const sequence = [];
  distances.forEach((distance) => {
    for (let i = 0; i < perDistance; i++) {
      sequence.push(distance);
    }
  });

  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  return sequence;
}

/** Laskee kokonaispisteet: SUMMA(onnistunut putti × etäisyys metreinä) */
export function calculateScore(attempts) {
  return attempts.reduce(
    (sum, attempt) => sum + (attempt.made ? attempt.distance : 0),
    0
  );
}

/** Rakentaa etäisyyskohtaisen erittelyn { "6m": { made, total }, ... } */
export function buildBreakdown(attempts, distances = DISTANCES) {
  const breakdown = {};
  distances.forEach((d) => {
    breakdown[`${d}m`] = { made: 0, total: 0 };
  });
  attempts.forEach(({ distance, made }) => {
    const key = `${distance}m`;
    if (!breakdown[key]) breakdown[key] = { made: 0, total: 0 };
    breakdown[key].total += 1;
    if (made) breakdown[key].made += 1;
  });
  return breakdown;
}

export function calculateAccuracy(attempts) {
  if (attempts.length === 0) return 0;
  const made = attempts.filter((a) => a.made).length;
  return Math.round((made / attempts.length) * 1000) / 10; // 1 desimaali
}
