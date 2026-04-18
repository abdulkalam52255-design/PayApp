# PayApp Sentinel: Clean Directory Tree

```
e:\PayApp Sentinel\
├── apps\
│   ├── web\                        <-- Canonical Unified Frontend (Next.js)
│   │   ├── app\                    <-- React Server Components
│   │   ├── components\             <-- Shared + Feature Components
│   │   ├── lib\                    <-- View-Models & Utilities
│   │   ├── public\
│   │   ├── .env.local              <-- Protected Secrets Merged
│   │   ├── package.json            <-- payapp-sentinel-web
│   │   └── tailwind.config.ts
│   └── worker\                     <-- Python Extractor & Rules Engine
│       ├── src\
│       ├── tests\
│       └── requirements.txt
├── docs\                           <-- Architecture & Runbooks
│   ├── ALPHA_VALIDATION_CHECKLIST.md
│   ├── CONTRACTS_V1.md
│   ├── MOCK_TO_LIVE_MIGRATION.md
│   ├── RUN_LOCAL.md
│   ├── FRONTEND_CONSOLIDATION_SUMMARY.md
│   └── CLEAN_DIRECTORY_TREE.md
├── fixtures\                       <-- QA Golden Packs
├── infra\                          <-- Supabase Setup
├── .git\
└── venv\                           <-- Worker Python Environment
```
