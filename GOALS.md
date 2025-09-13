# Timetable Scheduler — Microservices Architecture

**Short summary (Hindi):**
Ek scalable microservices design jo AI-driven timetable generation, multilingual website, chatbots, canteen module, classroom heatmap aur realtime features ko support kare. Neeche services, data flow, APIs, recommended tech stack, deployment aur roadmap diya hua hai.

---

## 1) High-level overview

* **Goal:** Teachers, subjects, number of periods, classes ka input leke AI engine se optimal timetable generate kare. Aage chalke canteen bookings, classroom heatmap (utilization), multilingual indexed website, aur chatbots add honge.
* **Principles:** loose coupling, single responsibility, event-driven for cross-service communication, autoscaling, RBAC/secure auth, observability.

---

## 2) Core microservices (each service = own repo, own DB where needed)

1. **API Gateway / Edge**

   * Responsibilities: Routing, authentication check (JWT/OIDC), rate-limiting, TLS termination, request logging.
   * Tech: Nginx/Traefik/Envoy or cloud API Gateway.

2. **Auth & User Service**

   * Responsibilities: Signup/login, roles (admin, teacher, student, canteen-staff), permissions, SSO/OIDC integration.
   * Tech: Keycloak or Auth0 or custom (FastAPI/Express + JWT + refresh tokens).
   * Data: Postgres for users & roles.

3. **Timetable Orchestrator (Core)**

   * Responsibilities: Accepts inputs (teachers, subjects, class groups, constraints), orchestrates AI service for scheduling, stores generated timetable, supports CRUD of constraints.
   * Tech: Python FastAPI or Node.js (Express/Nest). Uses an **async queue** to call Scheduler Worker.
   * DB: Postgres (relational suits constraints & joins).
   * API example:

     * `POST /timetables/generate` (payload: classes, periods, constraints)
     * `GET /timetables/{id}`

4. **Scheduler Worker / AI Engine**

   * Responsibilities: Runs the timetable algorithm — can be a heuristic solver (ILP/constraint solver) or LLM-assisted planner (LLM suggests assignment then validator resolves conflicts). Returns solutions and confidence.
   * Tech: Python (FastAPI or microservice) using OR-Tools / pulp / custom heuristic + optional LLM (Gemini/OpenAI) for complex constraints. Use GPU only if LLM heavy.
   * Input/Output via message queue (RabbitMQ/Kafka) or task queue (Celery/RQ/Bull).

5. **Data Service (Catalog)**

   * Responsibilities: Master data for teachers, subjects, rooms, periods, constraints, holidays.
   * DB: Postgres (main) + Redis cache for hot reads.

6. **Notifications Service**

   * Responsibilities: Email/SMS/push/webhook notifications for new timetables, canteen bookings, alerts.
   * Tech: Node or Python; integrate with SendGrid/SMTP, Twilio, FCM.

7. **Canteen Service** (future)

   * Responsibilities: Menu, pre-orders, balances, slot-based pickup to avoid queues; integrate with payments and notifications.
   * DB: Postgres + payments ledger.

8. **Heatmap / Analytics Service**

   * Responsibilities: Collect classroom usage, sensor data or booking logs, compute heatmaps (by hour/day/classroom) and expose visual data for frontend.
   * Input: Events ("class started", "class ended", manual check-ins), IoT sensor input (optional).
   * Tech: Batch + streaming (Kafka + consumer), compute in Python or Spark for large scale.
   * Data store: Time-series DB (InfluxDB) or OLAP (ClickHouse/BigQuery) + cache for UI.

9. **Chatbot / Conversational Agent Service**

   * Responsibilities: RAG-enabled chatbot over site docs, timetables, policies and FAQs. Provide teacher/student assistant.
   * Tech: Node/Python + LLM + vector DB (Pinecone/Weaviate/Milvus) for embeddings. Index PDFs/manuals.
   * API: `POST /chat/query` -> returns answer, sources, followups.

10. **Search & Indexing Service**

    * Responsibilities: Index all content (timetables, announcements, menus, FAQs) for multilingual search.
    * Tech: Elasticsearch or OpenSearch. Use language analyzers for i18n.

11. **Frontend (Website + Admin Panel)**

    * Responsibilities: Multilingual Next.js (React) website, admin dashboard for CRUD, visual heatmaps, canteen UI, timetable viewer.
    * Tech: Next.js (SSG/SSR for SEO), i18n with `next-i18next` or builtin. Use client-side websockets for realtime updates.

12. **Realtime / Socket Service**

    * Responsibilities: Push real-time timetable changes, notifications, collaborative edits.
    * Tech: Socket.IO / WebSocket server (can be part of API or separate).

13. **Monitoring & Observability**

    * Stack: Prometheus + Grafana, ELK/EFK for logs, Sentry for errors.

14. **CI / CD**

    * GitHub Actions / GitLab CI / CircleCI. Build images, run tests, push to registry, k8s deployment.

---

## 3) Communication patterns & events

* **Sync**: REST/gRPC for admin CRUD and most reads.
* **Async (recommended)**: Event bus for cross-service: Kafka or RabbitMQ.
* **Important events:**

  * `timetable.requested` -> payload includes constraints
  * `timetable.generated` -> timetable id + summary
  * `room.utilization.updated` -> heatmap service consumes
  * `canteen.order.placed`
  * `chat.index.updated` -> search/chatbot re-index

---

## 4) Data model (examples)

* **teachers** (Postgres): `id, name, subjects[], max_periods_per_day, unavailable_slots[], preferences`.
* **classes**: `id, name, year, size, required_subjects[]`.
* **rooms**: `id, name, capacity, resources`.
* **periods**: `id, start_time, end_time, day_index`.
* **timetables**: `id, school_id, generated_by, created_at, solution_json`.

Vector DB: documents for chatbot (source\_id, content, lang, embedding).

---

## 5) Scheduling approach (recommended phased)

1. **Phase 1 (MVP):** deterministic heuristic/greedy scheduler (fast) + admin overrides.
2. **Phase 2:** constraint solver (ILP / OR-Tools) to satisfy hard constraints.
3. **Phase 3:** LLM-assisted optimization for soft preferences, explainability (LLM suggests swaps and reasons).

Note: Always keep validator to ensure no hard constraint violated after LLM suggestion.

---

## 6) Multilingual website & indexing

* Use Next.js with i18n routing and `getStaticProps` for SEO pages.
* For dynamic content (timetable) use localized strings + fallback translations.
* Search: Elasticsearch with language analyzers; index `lang` field and use per-language analyzers.
* Chatbot: store lang metadata for each doc; when answering detect user lang and query relevant embeddings.

---

## 7) Security & privacy

* RBAC for actions (who can generate/approve timetables).
* Encrypt PII at rest; secure backups.
* Rate-limit public APIs. Sanitize inputs to all services.
* Audit logs for timetable changes.

---

## 8) Deployment & infra (suggested)

* Containerize every service (Docker).
* Orchestrate with Kubernetes (EKS/GKE/AKS) or Docker Swarm for smaller setups.
* Use managed Postgres (RDS/GCP SQL) + managed vector DB if possible.
* CDN (Cloudflare) for static assets and edge caching.
* Use Horizontal Pod Autoscaler (HPA) for worker & API scaling.

---

## 9) Observability & SLOs

* Track: request latency, job queue length, timetable generation duration, error rate.
* Alerts: long-running schedule jobs, queue backlog, failed index jobs.

---

## 10) Example API contracts (short)

* `POST /api/v1/timetables/generate`

  * body: `{ school_id, classes[], teachers[], rooms[], constraints[], options:{optimize_for: "compactness"} }`
  * returns: `{ job_id }`

* `GET /api/v1/timetables/{id}`

  * returns: `{ id, created_at, solution: [{class_id, period_id, teacher_id, room_id}], meta }`

* `POST /api/v1/canteen/orders`

  * body: `{ user_id, items:[{id,qty}], slot }`
  * returns: `{ order_id, status }`

* `POST /api/v1/chat/query`

  * body: `{ user_id, text, lang, context: {timetable_id?} }`
  * returns: `{ answer, sources[] }`

---

## 11) Roadmap (priority)

1. MVP: data model + API + simple greedy scheduler + admin UI + basic auth.
2. Add scheduled job worker + notifications + basic mobile-friendly frontend.
3. Integrate search & simple chatbot (RAG small docs).
4. Canteen module + realtime updates.
5. Heatmap & analytics (collect usage events) + visualization.
6. LLM-assisted improvements, explanations, multilingual scale.

---

## 12) Non-functional considerations

* **Latency:** schedule generation can be async — return job id and stream progress.
* **Throughput:** caching for timetables; store precomputed views.
* **Consistency:** strong for scheduling (avoid eventual inconsistencies for final published timetable).

---

## 13) Quick tech-stack cheat-sheet (one-line recommendations)

* Backend: Python FastAPI (scheduler/AI) + Node/Express for web APIs
* DB: Postgres + Redis
* Queue: RabbitMQ / Kafka
* Vector DB: Milvus / Pinecone
* Search: Elasticsearch/OpenSearch
* Frontend: Next.js (React) with i18n
* Auth: Keycloak / Auth0
* Infra: Docker + Kubernetes + CI/CD via GitHub Actions
* Monitoring: Prometheus + Grafana + ELK

---

## 14) Final notes / design tips

* Keep the scheduler stateless — all inputs pulled from Data Service.
* Use feature flags for rolling out LLM features.
* Add a validation & approval step before publishing timetable to students.
* Maintain an "override layer" so admins can do manual swaps which persist as exceptions.

---

Agar chaho to main isko diagram (architecture box+arrows) bana ke dunga ya ek starter `docker-compose.yml` / `k8s` manifests aur example code snippets bhi de sakta hoon. Batao kis cheez se start karna hai — backend MVP, admin UI, ya AI scheduler?
