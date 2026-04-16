# 🏛️ Institute Management System (LMS) - Architecture

This document outlines the complete architecture, technology stack, and data flow of the IAT LMS.

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, CSS3 (Vanilla), Axios, React Router 6 |
| **Backend** | Java 17, Spring Boot 3.2.4, Spring Security, Hibernate/JPA |
| **Database** | MySQL 8.0 |
| **Security** | JWT (Stateless), BCrypt Hashing |
| **Export Tools** | Apache POI (Excel), iText (PDF) |

---

## 🗺️ System Overview

```mermaid
graph TD
    User((User/Client)) -->|React App| Frontend[Frontend: Localhost:3000]
    Frontend -->|JWT Auth Header| API_Gateway[Spring Boot API: Localhost:8080]
    
    subgraph "Backend Layers"
        API_Gateway --> Controllers[Rest Controllers]
        Controllers --> Services[Business Logic Services]
        Services --> Repositories[JPA Data Access]
    end
    
    Repositories --> Database[(MySQL: lms_db)]
    
    subgraph "Security"
        JWTAuth[JWT Filter] -.-> Controllers
        RBAC[Role Based Access Control] -.-> Services
    end
```

---

## 🔐 Authentication & Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant B as Spring Boot Backend
    participant D as MySQL

    U->>F: Enter Email/Password
    F->>B: POST /api/auth/login
    B->>D: Find User & Verify BCrypt
    D-->>B: User Record Found
    B-->>F: Return JWT + User Info
    F->>F: Store Token in LocalStorage
    
    Note over F,B: Subsequent Requests
    F->>B: GET /api/batches (Include Bearer Token)
    B->>B: Validate Token Signature
    B-->>F: Return Batch Data
```

---

## 👥 Role-Based Access Control (RBAC)

| Module | Admin | Sales Head | Trainer Head | Trainer | Student |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **User Mgmt** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leads** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Batch Creation** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Enroll Student** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Gen. Syllabus** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Syllabus Status**| ✅ | ❌ | ✅ | ✅ | ❌ |
| **Attendance** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **View Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📦 Core Business Modules

### 1. Lead Management Lifecycle
**SEO** adds Leads → **Sales Head** assigns to **Sales Employee** → **Student** is created upon payment.

### 2. Academic Module
**Courses** define the curriculum → **Batches** are instances of courses with a **Trainer** → **Syllabus** is auto-generated based on batch start/end dates.

### 3. Student Hub
Students track their **Attendance**, pay **Fees** (in installments), raise **Queries**, and view **Placement** opportunities.

---

## 🗄️ Database Schema Relationships

```mermaid
erDiagram
    users ||--o{ leads : "manages"
    roles ||--o{ users : "assigns"
    courses ||--o{ batches : "categorizes"
    users ||--o{ batches : "trains"
    batches ||--|{ batch_students : "contains"
    students ||--|{ batch_students : "enrolled_in"
    batches ||--o{ syllabus : "has"
    students ||--o{ payments : "makes"
    syllabus ||--o{ attendance : "tracks"
```
