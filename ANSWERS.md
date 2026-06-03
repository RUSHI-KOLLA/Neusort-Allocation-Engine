# Answers

## 1.
I would replace the in-memory array with a persistent relational database like PostgreSQL to handle concurrent transactions safely (ACID properties are crucial for order management). I'd introduce an ORM (like Prisma or TypeORM) to create an `OrdersRepository` data access layer. The `OrdersService` methods would be refactored to be asynchronous and call the database repository. This ensures data persistence across server restarts, scalability for thousands of orders, and safer concurrent read/writes.

## 2.
Returning `{ error: string }` with a 200 OK status code violates REST semantics, making it harder for clients to handle errors automatically via HTTP status codes. It also creates an ambiguous return type (`Order | { error: string }`). For a production API, I would throw a `NotFoundException` in NestJS (resulting in a standard 404 HTTP status) if the order isn't found. I'd use a global exception filter to standardize the error response format and use Swagger/OpenAPI to clearly document expected successful and error response schemas.

## 3.
I would abstract the API calls into a dedicated service layer or, better yet, use a data-fetching library like React Query (TanStack Query) or SWR. These libraries handle caching, loading states, background refetching, and pagination automatically, significantly reducing the boilerplate currently in `useEffect`. Additionally, I'd manage global UI state (like filters and pagination) using a state manager (e.g., Zustand or Context API) instead of bloating `App.tsx`, and extract fetching logic into custom hooks (e.g., `useOrders`) to separate concerns.

## 4.
The current domain model is missing crucial operational fields. `Order` needs a payment status, total amount, customer details (phone, address), and expected delivery date. `Garment` needs specific services applied (e.g., dry clean, steam press), price, defect notes, and assigned staff. I would evolve the model by separating concerns: splitting `Order` into distinct `Order`, `Payment`, and `Customer` entities, and adding a `GarmentProcessingLog` table to track detailed state changes (who updated what and when) rather than relying on a single string enum.

## 5.
AI-generated code often misses critical non-functional requirements such as robust error handling, edge cases (e.g., null values, empty arrays), security (injection, input validation), and scalability (like using an in-memory array). To mitigate these risks, I would enforce strict TypeScript typing (avoiding `any`), implement comprehensive unit and integration tests (using Jest), use linters (ESLint), and mandate thorough human code reviews focusing on business logic and security. Additionally, I would add strict input validation using tools like `class-validator` in NestJS.

## 6.
I would introduce Server-Sent Events (SSE) or WebSockets. Since a dashboard typically requires one-way real-time updates (server broadcasting to client), SSE is simpler to implement over standard HTTP and scales easily. If two-way real-time interaction is ever needed, WebSockets (via a NestJS Gateway and Socket.io) would be preferred. Tradeoffs to consider include increased server resource usage (keeping connections open), deployment complexity (load balancing WebSockets requires sticky sessions or a Redis adapter), and the need to implement fallback polling mechanisms for unstable networks.
