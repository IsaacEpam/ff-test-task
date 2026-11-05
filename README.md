# How to run the project

1. Install dependencies:

```
npm install
```

2. Start a local PostgreSQL database and create a .env file in the project root:

```
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/DATABASE?sslmode=disable
```

> The sslmode=disable setting is intended for local development and not a production database.

3. Create the database table using the Drizzle config:

```
npx drizzle-kit push
```

4. Start the Nest application:

```
npm run start
```

5. With the server running, you can create sample flags or use the CLI:

```
./populate.sh
./flags-cli.mjs list
./flags-cli.mjs create new-dashboard true
```

> Both point to http://localhost:3000.

6. Run unit tests and E2E tests:

```
npm test
npm run test:e2e
```

# Assumptions
- Flags have a string ID, name, type, and boolean value.
- Flags can only have a boolean value.
- Single-tenant application.
- Small feature-flag service with modest read and write volume.
- Global flags. No partial rollouts or A/B testing. No user-specific targeting or evaluation rules.
- Single service app, other apps can access flags through the HTTP API rather than reading from the DB directly.

# Intentional tradeoffs

- Mocked HTTP tests which are fast and do not require PostgreSQL, however they do not prove that the database adapter work well together.
- The DTOs shown are TypeScript types, not runtime request validation.
- Omit changelog or historic updates for time.
- No GUI because of time.
- Use Nest.js for scalability and maintanability.
- PostgreSQL (relational DB), keep the system simple, centralized and writes durable. Rollout controls yet to be written.
- Eventual consistency: briefly stale reads are acceptable, the system cannot promise concurrent requests to see the new value.
- Consumers get a simple req-res HTTP interface, but they are responsible for network failures and they should decide how their applications behave when a flag cannot be fetched.

# If I had another day
- Dockerize app.
- GUI.
- Changelog.
- Repository-level caching, keep out the cache details from controllers.
- Runtime DTO validation.
- Database-backed integration tests against an isolated test database.