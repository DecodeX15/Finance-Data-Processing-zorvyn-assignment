# Financial Service Management Backend

This project is my backend assignment for a finance management system.
It is built with Node.js, Express, MongoDB, and JWT authentication.

The API supports:
- user registration and login
- role based access (Viewer, Analyst, Admin)
- transaction CRUD operations
- dashboard style analytics (totals, categories, recent, monthly)

## 1. Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB with Mongoose
- Authentication: JWT
- Password Hashing: bcrypt
- Validation: Joi
- Security/Protection: express-rate-limit, CORS, input validation
- Dev Tools: nodemon, prettier

## 2. Project Structure

```
.
|-- app.js
|-- index.js
|-- src
|   |-- config
|   |   |-- index.db.js
|   |-- controllers
|   |   |-- user.controller.js
|   |   |-- transactions.controller.js
|   |-- middleware
|   |   |-- auth.middleware.js
|   |   |-- rolaccess.middlware.js
|   |   |-- validate.middleware.js
|   |-- models
|   |   |-- user.model.js
|   |   |-- transaction.model.js
|   |-- routes
|   |   |-- user.route.js
|   |   |-- transaction.route.js
|   |-- utils
|   |   |-- Apiresponse.js
|   |-- validators
|       |-- user.validator.js
|       |-- transaction.validator.js
```

## 3. Backend Architecture (Overall)

I followed a layered structure so each part has one clear responsibility.

### 3.1 Entry and Server Boot

- index.js loads environment variables and connects MongoDB.
- If DB connection succeeds, the app starts listening on PORT.
- If DB fails, startup is stopped.

### 3.2 App Configuration Layer

In app.js, global middleware is configured before routes:
- rate limiter: prevents API abuse
- CORS setup
- JSON and URL-encoded parser
- route mounting with versioned base paths

Mounted base routes:
- /api/zorkyn/v1/user
- /api/zorkyn/v1/transaction

### 3.3 Route Layer

Routes define API endpoints and middleware chain.
They do not contain business logic.

Example flow in route layer:
- validate input
- verify JWT
- verify role
- call controller function

### 3.4 Middleware Layer

There are 3 middleware groups:

1. Validation middleware
- validates request body using Joi
- strips unknown fields
- returns 400 for invalid payload

2. Authentication middleware
- reads Bearer token from Authorization header
- verifies JWT
- fetches user from DB
- blocks deactivated users
- attaches user object to req.user

3. Role access middleware
- requireAdmin: only Admin
- requireAnalyst: Admin + Analyst

### 3.5 Controller Layer

Controllers handle business logic and DB operations.

User controller responsibilities:
- create account with hashed password
- login and JWT generation
- change role (admin only)
- activate/deactivate users (admin only)
- fetch all users (admin only)

Transaction controller responsibilities:
- create transaction
- fetch single transaction
- fetch transactions with filter/search/date/pagination
- update transaction
- delete transaction
- dashboard summary aggregations

### 3.6 Model Layer (MongoDB Schemas)

User model:
- name, email, hashedPassword
- role enum: Viewer, Analyst, Admin
- isactive flag
- timestamps

Transaction model:
- amount, type (Income/Expense), category
- title, description
- createdBy reference to User
- timestamps

### 3.7 Validator Layer

Joi schemas are defined separately and used by middleware:
- create/login user schema
- create transaction schema

This keeps controllers cleaner and safer.

### 3.8 Utility Layer

Apiresponse.js standardizes response format.

Success response includes:
- success
- statusCode
- message
- data

Error response includes:
- success
- statusCode
- message

## 4. Request Lifecycle (How a call moves)

A typical protected endpoint follows this order:

1. Client sends request to route
2. Validation middleware checks payload
3. Auth middleware verifies token and user status
4. Role middleware checks access level
5. Controller runs business logic
6. Response utility formats output
7. Client receives consistent JSON response

## 5. Authentication and Authorization Model

Authentication:
- JWT token generated on signup/login
- token expected as Bearer token in Authorization header

Authorization (RBAC):
- Viewer: basic authenticated access (ex: dashboard summary)
- Analyst: can view transactions
- Admin: full control (user management + transaction write actions)

## 6. API Endpoints (Quick Map)

Base URL: http://localhost:1425

### User routes
- POST /api/zorkyn/v1/user/create
- POST /api/zorkyn/v1/user/login
- POST /api/zorkyn/v1/user/change-role (Admin)
- POST /api/zorkyn/v1/user/change-user-status (Admin)
- GET /api/zorkyn/v1/user/all-users (Admin)

### Transaction routes
- POST /api/zorkyn/v1/transaction/create-transaction (Admin)
- PUT /api/zorkyn/v1/transaction/update-transaction/:id (Admin)
- DELETE /api/zorkyn/v1/transaction/delete-transaction/:id (Admin)
- GET /api/zorkyn/v1/transaction/get-transaction/:id (Admin, Analyst)
- GET /api/zorkyn/v1/transaction/get-all-transactions (Admin, Analyst)
- GET /api/zorkyn/v1/transaction/dashboard-summary (All authenticated users)

## 7. Setup and Run

### 7.1 Install dependencies

npm install

### 7.2 Create .env file

Add these variables:

PORT=1425
MONGODB_URI=your_mongodb_connection_string
Authentication_for_jsonwebtoken=your_secret_key

### 7.3 Run development server

npm run dev

## 8. Sample Response Shape

Success:

{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}

Error:

{
  "success": false,
  "statusCode": 400,
  "message": "..."
}

## 9. Notes

- Role defaults to Viewer at user creation in controller logic.
- Global limiter is enabled for basic API protection.
- Transaction list supports pagination and filters.
- Dashboard summary is generated from MongoDB aggregation pipelines.

## 10. Scope and Future Improvements

If I continue this project, I would add:
- refresh token flow
- audit logging for admin actions
- stricter transaction ownership checks for update/delete
- unit and integration test suite
- API docs using Swagger/OpenAPI

---

Built as part of backend assignment work by Vaibhav Aryan.
