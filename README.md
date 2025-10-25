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