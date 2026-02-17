# FiscalCore

**FiscalCore** is a full-stack financial modeling platform that simulates U.S. tax liability and enables scenario-based planning.

It combines a modular Python backend computation engine with a modern TypeScript frontend dashboard to deliver real-time tax breakdowns and comparative financial analysis.

FiscalCore is designed to demonstrate production-ready backend architecture, clean API design, domain-driven financial modeling, full-stack integration, and deployment discipline.

This project is not a tax filing tool. It is a financial computation and modeling engine.

---

## System Architecture

Frontend (Next.js + TypeScript)
↓
REST API (FastAPI)
↓
Service Layer
↓
Domain Tax Engine (Strategy Pattern)
↓
PostgreSQL (Persistence Layer)


### Backend
- Python 3.12+
- FastAPI
- Pydantic for schema validation
- SQLAlchemy (ORM)
- PostgreSQL
- Pytest
- Docker

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Charting library for tax visualization

### Infrastructure
- Docker and Docker Compose
- GitHub Actions for continuous integration
- Environment-based configuration

---

## Current Features (v0.1)

### Backend
- Federal income tax engine (single filer)
- Progressive bracket calculation
- Standard deduction handling
- Effective and marginal rate computation
- REST endpoint: `POST /calculate`
- Unit test coverage for tax logic
- Dockerized service

### Frontend
- Income input form
- Filing status selector
- Real-time API integration
- Tax breakdown dashboard
- Visualization of tax vs income curve

---

## Example Flow

1. User enters salary and filing status in the dashboard.
2. Frontend sends request to `/calculate`.
3. Backend applies the federal tax strategy.
4. Taxable income, total tax, and rates are returned.
5. Dashboard updates instantly with numeric and visual breakdown.

---

## Roadmap

### Backend Expansion
- Multi-state strategies
- Self-employment tax module
- Retirement contribution modeling
- Scenario comparison engine
- Monte Carlo simulation module
- Authentication and user accounts
- Saved scenarios with persistence

### Frontend Expansion
- Scenario comparison interface
- Contribution impact sliders
- Year-over-year comparison
- Responsive mobile layout
- User account dashboard

---

## Testing

Backend:
- Unit tests for bracket boundaries
- Deterministic financial outputs
- Edge-case validation

Frontend (planned):
- Component testing
- API integration tests

Run backend tests:

```bash
cd backend
pytest
Local Development
Start full stack:

docker-compose up --build
Services:

API: http://localhost:8000/docs

Frontend: http://localhost:3000

Engineering Focus
FiscalCore demonstrates:

Strategy pattern for extensible rules

Strict input validation

Layered backend design

Separation of concerns

Containerized full-stack deployment

CI-driven development

The project is structured to evolve into a production-grade financial SaaS platform.

