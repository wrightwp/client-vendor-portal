/**
 * Computes Levenshtein Distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates string similarity ratio between 0.0 and 1.0 (0% to 100%).
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = (str1 || "").trim().toLowerCase();
  const s2 = (str2 || "").trim().toLowerCase();

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;

  const distance = levenshteinDistance(s1, s2);
  return 1 - distance / maxLength;
}

/**
 * Calculates Token / Word Set similarity (Jaccard similarity) for multi-word company names.
 */
export function tokenSimilarity(str1: string, str2: string): number {
  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1);

  const tokens1 = new Set(tokenize(str1));
  const tokens2 = new Set(tokenize(str2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return intersection.size / union.size;
}

/**
 * Evaluates duplicate similarity score (0.0 to 1.0) and reason for Clients/Vendors.
 * Triggers match if overall similarity is >= 80% (0.80).
 */
export function evaluateFuzzyMatch(
  input: { name: string; taxId: string; npiNumber?: string },
  existing: { name: string; taxId: string; npiNumber?: string }
): { isMatch: boolean; score: number; reason: string | null } {
  const cleanInputTaxId = (input.taxId || "").replace(/[^a-zA-Z0-9]/g, "");
  const cleanExistingTaxId = (existing.taxId || "").replace(/[^a-zA-Z0-9]/g, "");

  const cleanInputNpi = (input.npiNumber || "").replace(/[^a-zA-Z0-9]/g, "");
  const cleanExistingNpi = (existing.npiNumber || "").replace(/[^a-zA-Z0-9]/g, "");

  // 1. Check Tax ID
  if (cleanInputTaxId && cleanExistingTaxId) {
    if (cleanInputTaxId === cleanExistingTaxId) {
      return { isMatch: true, score: 1.0, reason: "Exact Tax ID Match" };
    }
    const taxSim = stringSimilarity(cleanInputTaxId, cleanExistingTaxId);
    if (taxSim >= 0.8) {
      return {
        isMatch: true,
        score: taxSim,
        reason: `Tax ID Similarity: ${Math.round(taxSim * 100)}% ("${input.taxId}" vs "${existing.taxId}")`,
      };
    }
  }

  // 2. Check NPI Number (if provided)
  if (cleanInputNpi && cleanExistingNpi) {
    if (cleanInputNpi === cleanExistingNpi) {
      return { isMatch: true, score: 1.0, reason: "Exact NPI Match" };
    }
    const npiSim = stringSimilarity(cleanInputNpi, cleanExistingNpi);
    if (npiSim >= 0.8) {
      return {
        isMatch: true,
        score: npiSim,
        reason: `NPI Similarity: ${Math.round(npiSim * 100)}% ("${input.npiNumber}" vs "${existing.npiNumber}")`,
      };
    }
  }

  // 3. Check Name Similarity (Levenshtein + Token Similarity)
  if (input.name && existing.name) {
    const nameStrSim = stringSimilarity(input.name, existing.name);
    const nameTokenSim = tokenSimilarity(input.name, existing.name);
    const bestNameScore = Math.max(nameStrSim, nameTokenSim);

    if (bestNameScore >= 0.8) {
      return {
        isMatch: true,
        score: bestNameScore,
        reason: `Name Similarity: ${Math.round(bestNameScore * 100)}% ("${input.name}" vs "${existing.name}")`,
      };
    }
  }

  return { isMatch: false, score: 0, reason: null };
}
