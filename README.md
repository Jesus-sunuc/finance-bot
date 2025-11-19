# FinanceBot: AI-Powered Personal Finance Assistant

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Git

### Running with Hot Reload (Development)

The project uses separate Docker configurations for development and production:

- **Development**: `Dockerfile.dev` files with hot reload enabled
- **Production**: `Dockerfile` files with optimized builds for Kubernetes

#### Start the development environment:

```bash
docker-compose up --build
```

This will start:
- **Frontend** (React + Vite): http://localhost:8080 with hot reload
- **Backend** (FastAPI): http://localhost:8000 with auto-reload
- **Database** (PostgreSQL): localhost:5432

#### Making changes:

- **Frontend**: Edit files in `client/src/` - changes will auto-refresh in browser
- **Backend**: Edit files in `api/src/` - FastAPI will auto-reload the server
- **Database schema**: Changes to `api/schema.sql` require recreating the database volume

#### Stopping the environment:

```bash
docker-compose down
```

#### Rebuild after dependency changes:

```bash
docker-compose up --build
```

---

# Feature List

### **Core Features**
- Context-aware multi-turn conversations
- Structured output validation (Zod schemas)
- Agentic loop until task completion
- Automatic expense categorization
- Receipt OCR scanning (computer vision)
- Bidirectional sync with Notion databases
- Transaction search and filtering
- Real-time updates between UI and Notion
- Shared workspace for class
- JWT-based authentication
- Protected routes (auth required)
- Session persistence

#### User Interface (10+ Pages)
1. **Landing Page** (public)
2. **Dashboard** (protected) - Overview widgets
3. **Chat Interface** (protected) - Main AI interaction
4. **Expenses Page** (protected) - Transaction list
5. **Budgets Page** (protected) - Budget management
6. **Reports Page** (protected) - Analytics & charts
7. **Receipt Scanner** (protected) - Upload & OCR
9. **Profile Page** (protected) - Account details
10. **Admin Panel** (protected) - Agent logs
11. **Analytics Page** (protected) - Spending trends


#### Developer Experience
- TypeScript for type safety
- **3+ Reusable Form Components:**
  1. CurrencyInput (formatted numbers)
  2. DatePicker (calendar selection)
  3. CategorySelect (dropdown with icons)
- **2+ Reusable Layouts:**
  1. PublicLayout (minimal, centered)
  2. DashboardLayout (sidebar + header + main)
- Error boundaries + API error handling
- Toast notifications
- Mobile responsive (3+ breakpoints)

#### CI/CD Pipeline
- Docker + Kubernetes deployment
- Automated testing (pytest + vitest)
- Automated linting (eslint + black)
- Build fails on errors

---

### **The 4 Custom Agent Functions**

#### **Function 1: Add Expense (Autonomous)**
- **Action:** Parse natural language → create Notion entry
- **Example:** *"I spent $45.50 on groceries at Walmart yesterday"*
- **Behavior:** 
  - Extracts amount, category, merchant, date
  - Validates with Zod schema
  - Auto-saves to Notion
  - No confirmation needed for this

#### **Function 2: Generate Budget Report (Confirmation + UI Update)**
- **Action:** Analyze spending → generate PDF report
- **Example:** *"Show me my spending report for this month"*
- **Behavior:**
  - Queries Notion for expenses
  - **Asks confirmation:** *"Generate PDF and email it?"*
  - **UI Update:** Navigates to `/reports` page, shows download button

#### **Function 3: Delete Transaction (Requires Confirmation)**
- **Action:** Find and remove expense
- **Example:** *"Delete my last Starbucks purchase"*
- **Behavior:**
  - Searches for matching transaction
  - **Shows modal:** *"Delete $6.50 Starbucks from Oct 23?"*
  - Only deletes after explicit confirmation

#### **Function 4: Set Budget Goal (Autonomous + UI Update)**
- **Action:** Create/update monthly budget limits
- **Example:** *"Set my dining budget to $400 this month"*
- **Behavior:**
  - Updates Notion budget entry
  - **UI Update:** Sidebar slides out with progress bar
  - Dashboard widget refreshes automatically

---

### **Additional Task: Working with Pictures** 

**Receipt Scanner with Computer Vision**

- Drag-and-drop or camera upload
- Use `gemma3-27b` (vision model) to extract:
  - Merchant name, date, amount, items
- Auto-populate expense form (user can edit)
- Store receipt image in Notion
- Fallback to Tesseract.js if AI unavailable


---

## 3. New Technologies & Learning Requirements

### **AI/ML Integration**
- **Vision Language Models** - Image preprocessing, OCR from receipts, multimodal prompts

### **Notion API**
- **Notion SDK** - Database CRUD, property types, rate limiting
- **Bidirectional Sync** - Polling vs webhooks, conflict resolution, caching

### **Backend (Python)**
- **FastAPI** - Async patterns, Pydantic validation, background tasks

### **Frontend**
- **Chart Libraries** - recharts for spending visualizations


---
---

## Project Schedule

### Week 1: Infrastructure, Deployment & Authentication

#### Oct 29 (Check-in 1)

**Estimates:**

Rubric items:
- [x] CI/CD pipeline setup (10 points)
- [x] Docker containerization (10 points - complete)
- [x] Developer type helping (5 points)

Features:
- [x] Initialize Git repository with .gitignore
- [x] React + TypeScript + Vite frontend boilerplate
- [x] FastAPI backend boilerplate
- [x] Dockerfile for frontend (multi-stage build)
- [x] Dockerfile for backend
- [x] docker-compose.yml for local development
- [x] GitHub Actions workflow file
- [x] Linting setup (ESLint, Black, mypy, Prettier)

**Delivered:**

Rubric Items:
- [x] Docker containerization (10 points)
- [x] Developer type helping (5 points) - TypeScript with strict type checking

Features:
- [x] Initialize Git repository with .gitignore
- [x] React 19.1.0 + TypeScript + Vite 7.0.4 frontend boilerplate
- [x] FastAPI backend boilerplate
- [x] Dockerfile for frontend (multi-stage build with nginx)
- [x] Dockerfile for backend (Python 3.11)
- [x] docker-compose.yml for local development (client + api + postgres)
- [x] Linting setup (ESLint configured, frontend linting operational)


---

#### Nov 1 (Check-in 2)

**Estimates:**

Rubric items:
- [x] Deployed in production (15 points - complete)

Features:
- [x] Keycloak realm configuration
- [x] Keycloak client setup
- [x] Frontend: Login/logout flows
- [x] Frontend: Token management and refresh
- [x] Kubernetes manifests (Deployment, Service, Ingress)
- [x] Kubernetes ConfigMaps for environment variables
- [x] Kubernetes Secrets for API keys
- [x] Deploy to class Kubernetes cluster
- [x] Verify public URL accessibility

**Delivered:**

Rubric Items:
- [x] CI/CD pipeline setup (10 points) - GitHub Actions for frontend and backend Docker builds
- [x] Deployed in production (15 points) - Live at https://finance-jesus.duckdns.org
- [x] Docker containerization (10 points) - Multi-stage builds with optimization

Features:
- [x] GitHub Actions workflows (prod-api.yml, prod-client.yml, deploy-kube.yml)
- [x] Automated Docker image builds and pushes to Docker Hub
- [x] Self-hosted runner configuration
- [x] Keycloak OIDC authentication integration
- [x] React OIDC context with token management
- [x] Login/logout flows with protected routes
- [x] Kubernetes deployment manifests (finance-api, finance-client, finance-db)
- [x] Kubernetes services (ClusterIP)
- [x] Kubernetes ingresses with TLS (Let's Encrypt)
- [x] Database initialization with ConfigMap and Job
- [x] DuckDNS domain configuration (finance-jesus.duckdns.org)
- [x] Production deployment on class Kubernetes cluster
- [x] NavBar component with navigation and user display
- [x] About page
- [x] Home page with finance data display


---

### Week 2: Core Pages & State Management

#### Nov 5 (Check-in 3)

**Estimates:**

Rubric items:
- [ ] 10+ pages/views with router (10 points)
- [ ] 2+ reusable layout components (5 points)
- [ ] Global state management (5 points)

Features:
- [ ] React Router setup with all routes
- [ ] Landing page
- [ ] Dashboard page (placeholder)
- [ ] Chat interface page (placeholder)
- [ ] Expenses page (placeholder)
- [ ] Budgets page (placeholder)
- [ ] Reports page (placeholder)
- [ ] Receipt scanner page (placeholder)
- [ ] Settings page (placeholder)
- [ ] Profile page (placeholder)
- [ ] Admin panel page (placeholder)
- [ ] Analytics page (placeholder)
- [ ] PublicLayout component
- [ ] DashboardLayout component (with sidebar + header)

**Delivered:**

Rubric Items:
- [x] 10+ pages/views with router (10 points) - 12 pages total with React Router
- [x] 2+ reusable layout components (5 points) - PublicLayout and AuthenticatedLayout with sidebar
- [x] Global state management (5 points) - React Query for server state, React OIDC Context for auth

Features:
- [x] React Router setup with all routes (12 routes)
- [x] Landing page (public, with hero and features)
- [x] Dashboard page (stats overview with quick metrics)
- [x] Chat interface page (AI chat placeholder)
- [x] Expenses page (transaction list with filters)
- [x] Budgets page (budget cards and progress bars)
- [x] Reports page (report types with generation options)
- [x] Receipt Scanner page (OCR upload with instructions)
- [x] Settings page (account, notifications, preferences)
- [x] Profile page (user info and account actions)
- [x] Admin panel page (agent logs table)
- [x] Analytics page (charts and AI insights)
- [x] About page (existing)
- [x] PublicLayout component (minimal layout for landing)
- [x] AuthenticatedLayout component (collapsible sidebar with 10 nav items, header with user info)
- [x] React Query for server state management (already implemented)
- [x] React OIDC Context for authentication state


---

#### Nov 8 (Check-in 4)

**Estimates:**

Rubric items:
- [ ] Toasts/notifications (5 points)
- [ ] Error handling - render errors (5 points)
- [ ] 3+ reusable form components (5 points)
- [ ] Data persisted on server (5 points)

Features:
- [ ] react-hot-toast integration
- [ ] Toast notifications on all pages
- [ ] Error boundary component
- [ ] CurrencyInput component
- [ ] DatePicker component
- [ ] CategorySelect component
- [ ] PostgreSQL database setup in docker-compose
- [ ] Database connection in FastAPI

**Delivered:**

Rubric Items:
- [x] Toasts/notifications (5 points) - react-hot-toast with success/error notifications
- [x] Error handling - render errors (5 points) - ErrorBoundary with QueryErrorResetBoundary
- [x] Data persisted on server (5 points) - PostgreSQL database operational

Features:
- [x] react-hot-toast integration (configured in main.tsx)
- [x] Toast notifications on mutations (create/update/delete expenses)
- [x] Error boundary component (LoadingAndErrorHandling.tsx)
- [x] Global Suspense with loading spinner
- [x] PostgreSQL database setup in docker-compose
- [x] Database connection in FastAPI (already operational from Check-in 2)


---

### Week 3: Notion Integration & AI Agent Core

#### Nov 12 (Check-in 5)

**Estimates:**

Rubric items:
- [ ] Network calls - read data (5 points)
- [ ] Network calls - write data (5 points)
- [ ] Data persisted on server (5 points - Notion)

Features:
- [ ] Notion API integration setup
- [ ] Notion Expenses database schema
- [ ] Notion Budgets database schema
- [ ] Backend: GET /api/expenses endpoint
- [ ] Backend: GET /api/budgets endpoint
- [ ] Backend: POST /api/expenses endpoint
- [ ] Backend: PUT /api/budgets endpoint
- [ ] Notion service class for CRUD operations
- [ ] Expenses page connected to real data
- [ ] Budgets page connected to real data
- [ ] Axios setup with interceptors

**Delivered:**

Rubric Items:
- [x] Network calls - read data (5 points) - GET /api/expenses with React Query
- [x] Network calls - write data (5 points) - POST/PUT/DELETE /api/expenses with mutations
- [x] Data persisted on server (5 points - Notion) - Full CRUD to Notion databases

Features:
- [x] Notion API integration setup (notion-client with API key and database IDs)
- [x] Notion Expenses database schema (Amount, Category, Merchant, Date, Description)
- [x] Backend: GET /api/expenses endpoint (with filtering for valid expenses)
- [x] Backend: GET /api/expenses/{id} endpoint
- [x] Backend: POST /api/expenses endpoint (dynamic property matching)
- [x] Backend: PUT /api/expenses/{id} endpoint
- [x] Backend: DELETE /api/expenses/{id} endpoint (soft delete/archive)
- [x] Notion service class for CRUD operations (NotionService with error handling)
- [x] Error handling decorator for consistent API responses
- [x] Expenses page connected to real data (full CRUD UI with modal forms)
- [x] Axios setup with interceptors (snake/camel case conversion, date parsing, auth tokens)
- [x] TypeScript models for type safety (Expense, ExpenseCreate, ExpenseUpdate)
- [x] React Query hooks (useExpensesQuery, useCreateExpense, useUpdateExpense, useDeleteExpense)


---

#### Nov 15 (Check-in 6)

**Estimates:**

Rubric items:
- [ ] Structured output validated with Zod (5 points)
- [ ] Agentic loop (5 points)
- [ ] LLM decisions persisted (5 points)
- [ ] Function 1: Add Expense (2.5 points)

Features:
- [ ] Zod schemas for all AI outputs
- [ ] Agent loop state machine (planning → acting → observing)
- [ ] Agent decision log table in PostgreSQL
- [ ] Add Expense function implementation
- [ ] Natural language parser for expenses
- [ ] POST /api/agent/chat endpoint
- [ ] POST /api/agent/add-expense endpoint
- [ ] Chat interface connected to backend
- [ ] Display agent reasoning in chat UI

**Delivered:**

Rubric Items:
- [x] Structured output validated with Pydantic (5 points) - ExpenseParseResult, AgentDecision, ChatResponse with field validation
- [x] Agentic loop (5 points) - State machine: Planning → Acting → Observing → Completed
- [x] LLM decisions persisted (5 points) - agent_decision_log table in PostgreSQL with all reasoning
- [x] Function 1: Add Expense (2.5 points) - Natural language expense parser with 99% confidence

Features:
- [x] Pydantic models for structured validation (Python equivalent of Zod)
- [x] Agent loop state machine implementation in AgentService
- [x] agent_decision_log PostgreSQL table (user_message, agent_state, llm_reasoning, action_taken, result, created_at)
- [x] Add Expense function with natural language parsing (gpt-oss-120b model)
- [x] Natural language parser extracts: amount, category, merchant, date, description, confidence
- [x] POST /api/agent/chat endpoint (processes messages through agentic loop)
- [x] POST /api/agent/add-expense endpoint (parses text and creates Notion entry)
- [x] GET /api/agent/decisions endpoint (retrieves decision history)
- [x] Chat interface connected to backend with React Query hooks
- [x] Display agent reasoning and state in chat UI
- [x] AgentHooks.ts with useSendMessage, useAddExpenseFromText, useAgentDecisions
- [x] Scanner page (AI Expense Parser) with natural language input and success feedback
- [x] Environment configuration for custom AI endpoint (OPENAI_BASE_URL, AI_TOKEN support)


---

### Week 4: Remaining AI Functions

#### Nov 19 (Check-in 7)

**Estimates:**

Rubric items:
- [ ] Function 2: Generate Report (2.5 points)
- [ ] Function 3: Delete Transaction (2.5 points)
- [ ] 1+ confirmation required (5 points)
- [ ] 1+ auto-adjust UI (5 points)

Features:
- [ ] Generate Budget Report function
- [ ] PDF generation for reports
- [ ] Confirmation modal component (reusable)
- [ ] Delete Transaction function
- [ ] Transaction search logic
- [ ] POST /api/agent/generate-report endpoint
- [ ] DELETE /api/agent/delete-transaction endpoint
- [ ] Auto-navigate to /reports on report generation
- [ ] Report download functionality
- [ ] Admin panel showing all agent decisions

**Delivered:**

Rubric Items:
- [x] Function 2: Generate Report (2.5 points) - Fully implemented with agent endpoint
- [x] Function 3: Delete Transaction (2.5 points) - Implemented with search and confirmation
- [x] 1+ confirmation required (5 points) - Reusable ConfirmationModal component
- [x] 1+ auto-adjust UI (5 points) - Auto-navigation to /reports page after generation

Features:
- [x] Generate Budget Report function - Implemented with spending analytics
- [x] Report data generation - Category breakdown, totals, transaction counts
- [x] Confirmation modal component (reusable) - ConfirmationModal with variants (danger/warning/info)
- [x] Delete Transaction function - Full implementation with search logic
- [x] Transaction search logic - Searches by merchant, category, amount, description
- [x] POST /api/agent/generate-report endpoint - Returns structured report data
- [x] POST /api/agent/delete-transaction endpoint - Handles single/multiple match scenarios
- [x] Auto-navigate to /reports on report generation - navigate_to field in response
- [x] Report display functionality - Visual category breakdown with progress bars
- [x] Admin panel showing all agent decisions - Real-time display with statistics
- [x] Agent decision statistics - Success rate, total requests, error tracking
- [x] Multiple match handling for delete - Requires user confirmation when ambiguous
- [x] Chat integration with navigation - Auto-redirects after agent actions


---

#### Nov 22 (Check-in 8)

**Estimates:**

Rubric items:
- [ ] Function 4: Set Budget Goal (2.5 points)
- [ ] 1+ autonomous action (5 points)
- [ ] Error handling - API errors (5 points)

Features:
- [ ] Set Budget Goal function implementation
- [ ] POST /api/agent/set-budget endpoint
- [ ] Budget progress sidebar component
- [ ] Sidebar slide-in/out animations
- [ ] Dashboard budget widget with real-time updates
- [ ] Axios interceptors for error handling
- [ ] Retry logic for failed requests
- [ ] User-friendly error messages
- [ ] Loading spinners on all async operations
- [ ] Disabled button states

**Delivered:**

Rubric Items:
- [x] Function 4: Set Budget Goal (2.5 points) - Fully implemented with AI parsing
- [x] 1+ autonomous action (5 points) - Budget progress sidebar auto-displays
- [x] Error handling - API errors (5 points) - Comprehensive error handling with retries

Features:
- [x] Set Budget Goal function implementation - Natural language parsing via LLM
- [x] POST /api/agent/set-budget endpoint - Creates or updates budgets
- [x] Budget model system - BudgetCreate, BudgetUpdate, Budget Pydantic models
- [x] GET /api/budgets endpoints - Full CRUD operations for budgets
- [x] Budget progress sidebar component - Slide-in animation with progress bars
- [x] Sidebar slide-in/out animations - Smooth transitions with backdrop
- [x] Dashboard budget widget with real-time updates - Shows top 3 budgets
- [x] Budget statistics cards - Total spent, budget remaining, transactions, total budget
- [x] Color-coded progress indicators - Green (<70%), yellow (<90%), red (≥90%)
- [x] Axios interceptors for error handling - Request timeout and retry logic
- [x] Retry logic for failed requests - Exponential backoff (1s, 2s, 4s)
- [x] User-friendly error messages - Toast notifications for success/error
- [x] Toast notification system - react-hot-toast integration
- [x] Enhanced error messages - Detailed error handling with type extraction
- [x] 30-second request timeout - Prevents hanging requests
- [x] Notion budgets database integration - Category, Amount, Period, Spent, Start Date
- [x] Budget parsing with confidence scores - LLM extracts budget details
- [x] Create/update budget logic - Checks for existing budgets before creating
- [x] Budget sidebar triggers on SET_BUDGET action - Auto-displays after budget creation
- [x] Dashboard real-time budget display - React Query auto-refresh

Example Usage:
```
User: "Set my dining budget to $400 this month"
Agent: Parses budget details → Creates/updates budget → Shows sidebar → Updates dashboard
```

---

### Week 5: Receipt Scanner & Mobile Polish

#### Nov 25 (Check-in 9)

**Estimates:**

Rubric items:
- [ ] Working with pictures - upload (5 points)
- [ ] Working with pictures - OCR (5 points)

Features:
- [ ] Receipt upload component
- [ ] POST /api/receipts/upload endpoint
- [ ] gemma3-27b vision model integration
- [ ] OCR text extraction from receipts
- [ ] Structured data extraction (merchant, amount, date)
- [ ] Auto-populate expense form from OCR
- [ ] Image storage in Notion as attachment

**Delivered:**

Rubric Items:
- [x] Working with pictures - upload (5 points) - File upload with preview and multipart/form-data
- [x] Working with pictures - OCR (5 points) - gemma3-27b vision model for receipt text extraction

Features:
- [x] Receipt upload component with drag-and-drop UI
- [x] POST /api/receipts/upload endpoint - Extract data without saving
- [x] POST /api/receipts/upload-and-save endpoint - Extract and auto-save to Notion
- [x] gemma3-27b vision model integration (multimodal LLM for image understanding)
- [x] OCR text extraction from receipts (merchant, amount, date, category, items)
- [x] Structured data extraction with confidence scores
- [x] Image preview before upload
- [x] Dual-mode interface: Receipt Upload (OCR) + Text Description tabs
- [x] Real-time extracted data display with confidence meter
- [x] Extract data preview mode (validate before saving)
- [x] Direct save mode (extract and save in one step)
- [x] React Query hooks: useUploadReceipt, useUploadAndSaveReceipt
- [x] Receipt router with FastAPI file handling
- [x] python-multipart dependency for multipart/form-data support
- [x] Base64 image encoding for API transmission
- [x] Toast notifications for upload success/failure
- [x] Responsive design with mobile-friendly upload interface

Example Usage:
```
User: [Uploads Starbucks receipt photo]
AI Vision (gemma3-27b): Extracts → Merchant: "Starbucks", Amount: $6.50, Category: "Dining", Items: ["Latte", "Croissant"]
System: Shows confidence score (95%) → User can preview or save directly
```

---

#### Dec 3 (Check-in 10)

**Estimates:**

Rubric items:
- [ ] Mobile responsive (5 points)
- [ ] Organized experience (5 points)

Features:
- [ ] Mobile-first responsive design for all pages
- [ ] Dashboard: widgets stack vertically on mobile
- [ ] Expenses page: table → card view on mobile
- [ ] Chat interface: full-screen on mobile
- [ ] Hamburger menu for mobile navigation
- [ ] Touch-friendly buttons (larger tap targets)
- [ ] CSS animations for page transitions
- [ ] Smooth sidebar animations
- [ ] Chart responsiveness

**Delivered:**

Rubric Items:


Features:


---

### Week 6: Testing & Buffer

#### Dec 6 (Check-in 11 - FINAL)

**Estimates:**

Rubric items:
- [ ] CI/CD - unit tests (5 points)
- [ ] Final verification (146 points total)

Features:
- [ ] Backend unit tests (pytest)
  - [ ] Auth flow tests
  - [ ] Notion API tests
  - [ ] Agent function tests
- [ ] Frontend unit tests (vitest)
  - [ ] Component tests
  - [ ] Store tests
- [ ] >80% test coverage
- [ ] Tests integrated in GitHub Actions
- [ ] Bug fixes
- [ ] Documentation

**Delivered:**

Rubric Items:


Features:


---

## Point Distribution by Week

| Week | Check-ins | Estimated Points | Cumulative |
|------|-----------|------------------|------------|
| 1 | Oct 29, Nov 1 | 40 points | 40 |
| 2 | Nov 5, Nov 8 | 30 points | 70 |
| 3 | Nov 12, Nov 15 | 27.5 points | 97.5 |
| 4 | Nov 19, Nov 22 | 25 points | 122.5 |
| 5 | Nov 25, Dec 3 | 20 points | 142.5 |
| 6 | Dec 6 | 3.5 points (buffer) | 146 |

**Total: 146 points**
