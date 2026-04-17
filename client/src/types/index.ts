export type RiskBucket = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
export type AppState = 'Idle' | 'Processing' | 'Ready' | 'Error';

export interface Company {
  id: string;
  name: string;
  sector: string;
  turnover: number;
  status: AppState;
  riskScore: number;
  riskBucket: RiskBucket;
  lastUpdated: string;
}

export interface AgentEvent {
  event_type: string;
  company_id: string;
  payload: Record<string, any>;
}
