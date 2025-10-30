# FinanceBot: AI-Powered Personal Finance Assistant

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
- [ ] CI/CD pipeline setup (10 points)
- [x] Docker containerization (10 points - complete)
- [x] Developer type helping (5 points)

Features:
- [x] Initialize Git repository with .gitignore
- [x] React + TypeScript + Vite frontend boilerplate
- [x] FastAPI backend boilerplate
- [x] Dockerfile for frontend (multi-stage build)
- [x] Dockerfile for backend
- [x] docker-compose.yml for local development
- [ ] GitHub Actions workflow file
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
- [ ] Deployed in production (15 points - complete)

Features:
- [ ] Keycloak realm configuration
- [ ] Keycloak client setup
- [ ] Frontend: Login/logout flows
- [ ] Frontend: Token management and refresh
- [ ] Backend: Keycloak token validation
- [ ] Kubernetes manifests (Deployment, Service, Ingress)
- [ ] Kubernetes ConfigMaps for environment variables
- [ ] Kubernetes Secrets for API keys
- [ ] Deploy to class Kubernetes cluster
- [ ] Verify public URL accessibility
- [ ] Health check endpoints (/health)

**Delivered:**

Rubric Items:


Features:


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
- [ ] Zustand store for auth state
- [ ] Zustand store for expenses state
- [ ] Zustand store for budgets state

**Delivered:**

Rubric Items:


Features:


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


Features:


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


Features:


---

#### Nov 15 (Check-in 6)

**Estimates:**

Rubric items:
- [ ] Structured output validated with Zod (5 points)
- [ ] Agentic loop (5 points)
- [ ] LLM decisions persisted (5 points)
- [ ] Function 1: Add Expense (2.5 points)

Features:
- [ ] Snow College AI Server API integration
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


Features:


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


Features:


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


Features:


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


Features:


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
