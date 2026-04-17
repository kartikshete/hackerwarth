# 🏛️ Aether Credit: System Architecture

## Overview
Aether Credit is built as an event-driven, multi-agent system using Next.js 15. The core intelligence is distributed across autonomous micro-agents coordinated by a central orchestrator.

## 🤖 The 5-Layer Agent Pipeline

### 1. Data Collection Agent
- **Target**: MCA21, Bank Statements, GST filings.
- **Role**: Validates and archives raw ingestions.

### 2. Financial Parsing Agent
- **Target**: Balance Sheets, P&L.
- **Logic**: Extracts EBITDA, Revenue, Ratios (Current Ratio, Debt-to-Equity).

### 3. Legal Intelligence Agent
- **Target**: Court registries, NCLT.
- **Role**: Scans for negative legal signals and litigation.

### 4. Behavioral Risk Agent
- **Target**: Bank transaction patterns (e-CAS).
- **Role**: Detects circular trading, cash-withdrawals, and EWS signals.

### 5. Synthesis Agent (The Brain)
- **Role**: Aggregates all lower-level agent scores into a final ranking and generates the XAI (Explainable AI) dossier.

## 🔌 API Flow
Events are broadcasted to the **Coordinator Agent** (`/api/agents/coordinator`), which triggers the next agent in the sequence based on the completion of the previous task.
