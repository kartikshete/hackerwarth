interface FinancialData {
  bankSummary?: {
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    avgMonthlyBalance: number;
    overdraftDays: number;
  };
  ratios?: {
    currentRatio: number;
    debtToEbitda: number;
    profitMargin: number;
  };
}

export function computeRiskScore(data: FinancialData, sector: string) {
  let score = 500; // Base score (Neutral)

  // 1. Financial Ratios (30%) - 300 points max
  if (data.ratios) {
    // Current Ratio (Higher is better)
    if (data.ratios.currentRatio > 2.0) score += 100;
    else if (data.ratios.currentRatio > 1.2) score += 50;
    else score -= 50;

    // Debt to EBITDA (Lower is better)
    if (data.ratios.debtToEbitda < 3) score += 100;
    else if (data.ratios.debtToEbitda < 5) score += 50;
    else score -= 100;

    // Profit Margin
    if (data.ratios.profitMargin > 0.15) score += 100;
    else if (data.ratios.profitMargin > 0.05) score += 50;
  }

  // 2. Bank Statement behavior (30%) - 300 points max
  if (data.bankSummary) {
    // Stability of balance
    if (data.bankSummary.avgMonthlyBalance > data.bankSummary.totalOutflow * 0.2) score += 100;
    
    // Overdrafts (Heavy penalty)
    if (data.bankSummary.overdraftDays === 0) score += 100;
    else if (data.bankSummary.overdraftDays > 5) score -= 200;
    else score -= 50;

    // Net Cash Flow
    if (data.bankSummary.netCashFlow > 0) score += 100;
  }

  // 3. Sector risk (20%) - 200 points
  const riskySectors = ["Real Estate", "Venture", "Construction"];
  const stableSectors = ["Utilities", "Healthcare", "Government"];

  if (stableSectors.includes(sector)) score += 100;
  else if (riskySectors.includes(sector)) score -= 100;

  // Cap score
  return Math.min(Math.max(score, 0), 1000);
}

export function detectAnomalies(data: FinancialData) {
  const anomalies = {
    cashFlowStress: false,
    paymentDelays: false,
    unusualTransactions: false
  };

  if (data.bankSummary && data.ratios) {
    // Cash flow stress: negative net flow + low current ratio
    if (data.bankSummary.netCashFlow < 0 && data.ratios.currentRatio < 1.2) {
      anomalies.cashFlowStress = true;
    }

    // Payment delays: if overdraft days exist
    if (data.bankSummary.overdraftDays > 2) {
      anomalies.paymentDelays = true;
    }
    
    // Unusual transactions: Mock check for demo
    if (data.bankSummary.totalOutflow > data.bankSummary.totalInflow * 1.5) {
      anomalies.unusualTransactions = true;
    }
  }

  return anomalies;
}

export function getRiskBucket(score: number): "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" {
  if (score >= 801) return "LOW";
  if (score >= 601) return "MEDIUM";
  if (score >= 401) return "HIGH";
  return "VERY_HIGH";
}
