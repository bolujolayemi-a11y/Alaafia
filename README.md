# Alaafia 🌿

Alaafia is a warm, deeply knowledgeable, and professional AI-powered health information companion built specifically to address public health challenges, local lifestyle habits, and nutritional realities within Nigeria. 

The name **Alaafia** comes from the Yoruba word representing peace, complete wellness, and good health. This platform translates complex medical terminology into clear, accessible, and culturally-aware insights, helping users understand their physical well-being and confidently navigate local healthcare systems.

> 🚨 **Disclaimer:** Alaafia is strictly an educational information resource. It does not provide medical diagnoses, prescribe treatments, or replace the clinical judgment of qualified healthcare professionals.

---

## ✨ Features

- **Culturally Informed Health Insights:** Tailored to understand local Nigerian foods (e.g., dodo, instant noodles, pounded yam), regional health challenges, and common traditional habits.
- **Pre-flight Emergency Triaging:** Built-in client-side guardrails that instantly flag critical medical red flags (e.g., chest pain, severe bleeding) and guide users to immediate professional emergency services.
- **Persistent Conversational Threads:** Lightweight, relational chat log streaming powered by Appwrite, allowing users to safely revisit, review, or clear their recent consultation history.
- **Minimalist, Accessible UI:** Formulated around a polished interface utilizing clean font hierarchies, responsive layouts for fluid mobile use, and an integrated show/hide credential utility.
- **Privacy-First Data Architecture:** Fully autonomous chat management that permits users to securely drop or purge individual conversation threads instantly from the active database infrastructure.

---

## 🛠️ Tech Stack

- **Frontend Core:** React.js (Functional components, hooks, custom state lifecycle routing)
- **Styling Architecture:** Clean inline styles mapping to unified design tokens (Minimalist color tokens, Outfits & Cormorant Garamond typography)
- **Backend-as-a-Service (BaaS):** Appwrite (User Account Authentication, Relational Document Databases, Session persistence cookie tracking)
- **AI Inference Pipeline:** Unified Routing Service Engine (Groq API Node Integration / Custom Medical Model Context Layer)

---

## 📂 Project Architecture

```text
src/
├── components/
│   ├── AboutPage.jsx        # Background framework and educational scope notice
│   ├── AuthPage.jsx         # Secure semantic entry form with credential show/hide toggle
│   ├── ChatPage.jsx         # Core layout managing the messaging stream and sidebar navigation
│   ├── LandingPage.jsx      # High-conversion presentation display showing interactive side-by-side mockups
│   └── PrivacyPage.jsx      # Transparency statement details regarding data usage autonomy
├── services/
│   ├── aiService.js         # Core integration point connecting conversation state history to the LLM node
│   └── api.js               # Fortified Appwrite backend SDK queries and connection handlers
├── App.jsx                  # Main router managing dynamic view swapping and persistent session tracking
├── appwrite.js              # Initialized Appwrite Client configuration singleton
├── config.jsx               # Centralized style palette variables, custom buttons, and professional system prompt
└── main.jsx                 # Application entry mount point

```

---

## ⚙️ Appwrite Database Schema Setup

To support the lazy-instantiation relational streaming, configure two collections within your Appwrite Database project (`DB_ID`):

### 1. `conversations` Collection

* **`user_id`** (String): Stores the owner's Appwrite User account ID reference.
* **`title`** (String): Captures the first 40 characters of the initial query string to serve as the sidebar header title.

### 2. `messages` Collection (`MSG_ID`)

* **`conversation_id`** (String): Required index mapping the message bubble back to its parent conversation thread.
* **`role`** (String): Identifies the origin node (`"user"` or `"assistant"`).
* **`content`** (String / Text): Houses the actual body layout text copy string.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/alaafia.git](https://github.com/yourusername/alaafia.git)
cd alaafia

```

### 2. Install dependencies

```bash
npm install

```

### 3. Environment Variables Configuration

Create a `.env` file or update your key values directly inside `src/appwrite.js` and `src/services/api.js` using your project credentials:

```text
VITE_APPWRITE_ENDPOINT=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)
VITE_APPWRITE_PROJECT_ID=your_project_id

```

### 4. Run the development server

```bash
npm run dev

```

The application will open locally at `http://localhost:5173`.

---

## 👥 Author

* **Boluwatife Jolayemi** - *Frontend Engineer & Lead Developer*

---

## 📄 License

This project is built for educational public health communication purposes. All safe educational frameworks are maintained under strict private operational design guidelines.

```

```