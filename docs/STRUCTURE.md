smartquote/
├── .github/
│   ├── actions/
│   └── workflows/
│
├── .husky/
│   └── pre-commit/                                 # Lint-staged
│
├── docs/
│   ├── STRUCTURE.md
│   └── TEAM_GUIDE.md
│
├── src/
│   ├── client/
│   │   ├── main.tsx
│   │   ├── components/                             # Pure reusable UI elements; must not know about APIs, auths, or domain concepts
│   │   ├── config/                                 # Environment and config values only; no runtime logic
│   │   ├── features/                               # Feature scoped UI behaviour composed from components and hooks
│   │   ├── hooks/                                  # Thin adapters between UI and API layers. No business rules.
│   │   ├── lib/
│   │   │   ├── api/                                # Only place that knows endpoints in client
│   │   │   ├── storage/                            # Browser persistence tokens
│   │   │   └── utils/                              # Generic helpers only; if it knows about e.g. tickets, it doesn't belong here
│   │   ├── pages/                                  # Route level composition (no logic, only assemble features)
│   │   └── styles/                                 # Global styling and design tokens only; no component-specific styling
│   │
│   ├── lib/
│   │   ├── http/                                   # Enforce JSON shape. Controllers must only use this and never manually defines JSON shape.
│   │
│   ├── server/
│   │   ├── app.ts                                  # Server entry point. Imports all code from bootstrap files.
│   │   ├── bootstrap/                              # Application startup and dependency wiring, no where else creates services. Gets config from configs
│   │   ├── config/                                 # Environment and config values only; no runtime logic
│   │   ├── containers/                             # Construct controllers by injecting dependencies; no business behaviour
│   │   ├── controllers/
│   │   ├── daos/                                   # Database persistence/access only - no validation, permissions, or workflow rules
│   │   ├── database/                               # Connection, migrations, and schema definitions only.
│   │   ├── middleware/                             # Cross-cutting HTTP behaviour (auth, errors, logging), never business decisions.
│   │   ├── routes/                                 # Map URLs to controllers only - no logic allowed.
│   │   ├── services/                               # All business rules/workflows here; nothing else enforces domain behaviour. No HTTP here.
│   │   └── validators/                             # Input shape validation only; must not access database or services.
│   │
│   └── shared/
│       ├── constants/                              # Define all seed lookup table data here so frontend/backend stay in sync
│       ├── contracts/                              # Define all DTO types here so frontend/backend share to prevent drift
│
├── tests/
│
├── .dockerignore
├── .env.example
├── .env.local
├── .gitignore
├── .prettierignore
├── .prettiererc
├── CONTRIBUTING.md
├── docker-compose.yml
├── DockerFile.dev
├── DockerFile.prod
├── eslint.config.js
├── index.html
├── knexfile.ts
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
