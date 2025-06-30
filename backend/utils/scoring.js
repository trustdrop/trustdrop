// Fonction de scoring IA comportemental simple
export function computeRiskScore(nom, email, adresse) {
  let score = 15; // score faible par défaut

  // Email jetable
  if (/@(yopmail|tempmail|mailinator|discard|fake|guerrillamail)\./i.test(email)) {
    score = 85;
  }

  // Nom suspect
  if (!nom || nom.length < 3 || /test|fake|toto|admin/i.test(nom)) {
    score = Math.max(score, 70);
  }

  // Adresse suspecte
  if (/fake|123 test|bidon|nowhere|null/i.test(adresse)) {
    score = Math.max(score, 85);
  }

  return score;
} 