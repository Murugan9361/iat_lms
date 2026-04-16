-- ============================================================
--  INSTITUTE MANAGEMENT SYSTEM - COMPLETE MYSQL SCHEMA
--  Version: 1.0.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms_db;

-- ============================================================
-- 1. ROLES TABLE
-- ============================================================
CREATE TABLE roles (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL UNIQUE,  -- ADMIN, SUPER_ADMIN, SEO, SALES_HEAD, SALES_EMPLOYEE, TRAINER_HEAD, TRAINER, HR, PLACEMENT_HR, STUDENT
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. USERS TABLE
-- ============================================================
CREATE TABLE users (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,  -- BCrypt encrypted
    phone        VARCHAR(15),
    role_id      BIGINT NOT NULL,
    is_active    BOOLEAN DEFAULT TRUE,
    created_by   BIGINT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================
-- 3. COURSES TABLE
-- ============================================================
CREATE TABLE courses (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(150) NOT NULL,
    description  TEXT,
    duration_hours INT,
    is_active    BOOLEAN DEFAULT TRUE,
    created_by   BIGINT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================
-- 4. TRAINERS TABLE (extended profile for trainer role users)
-- ============================================================
CREATE TABLE trainers (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id             BIGINT NOT NULL UNIQUE,
    dob                 DATE,
    experience_type     ENUM('FRESHER','EXPERIENCED') DEFAULT 'FRESHER',
    employment_type     ENUM('FREELANCER','PERMANENT') DEFAULT 'PERMANENT',
    aadhar_number       VARCHAR(12),
    pan_number          VARCHAR(10),
    photo_url           VARCHAR(500),
    signature_url       VARCHAR(500),
    -- Experienced docs
    experience_cert_url VARCHAR(500),
    salary_slip_url     VARCHAR(500),
    -- Fresher docs
    college_cert_url    VARCHAR(500),
    course_cert_url     VARCHAR(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. LEADS TABLE
-- ============================================================
CREATE TABLE leads (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    phone         VARCHAR(15) NOT NULL,
    email         VARCHAR(150),
    source        ENUM('INSTAGRAM','WALK_IN','FACEBOOK','WEBSITE','REFERRAL','OTHER') DEFAULT 'WALK_IN',
    course_interest VARCHAR(150),
    status        ENUM('NEW','ASSIGNED','INTERESTED','FOLLOW_UP','CONVERTED','LOST') DEFAULT 'NEW',
    assigned_to   BIGINT,  -- sales employee user_id
    assigned_by   BIGINT,  -- sales head user_id
    created_by    BIGINT,  -- SEO user_id
    notes         TEXT,
    follow_up_date DATE,
    converted_at  TIMESTAMP,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================
-- 6. STUDENTS TABLE
-- ============================================================
CREATE TABLE students (
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id        VARCHAR(20) NOT NULL UNIQUE,  -- IAT0001, IAT0002...
    user_id           BIGINT NOT NULL UNIQUE,
    lead_id           BIGINT,
    -- Personal Details
    dob               DATE,
    gender            ENUM('MALE','FEMALE','OTHER'),
    aadhar_number     VARCHAR(12),
    photo_url         VARCHAR(500),
    -- Address
    address_line1     VARCHAR(255),
    address_line2     VARCHAR(255),
    city              VARCHAR(100),
    state             VARCHAR(100),
    pincode           VARCHAR(10),
    -- Emergency Contact
    emergency_contact_name  VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),
    -- Enrollment
    enrollment_date   DATE,
    enrollment_terms  TEXT,
    created_by        BIGINT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Auto-increment sequence for student_id
CREATE TABLE student_id_sequence (
    id  INT PRIMARY KEY AUTO_INCREMENT,
    dummy TINYINT DEFAULT 0
);

-- ============================================================
-- 7. BATCHES TABLE
-- ============================================================
CREATE TABLE batches (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_name   VARCHAR(150) NOT NULL UNIQUE,
    course_id    BIGINT NOT NULL,
    trainer_id   BIGINT,        -- references users.id (trainer role)
    batch_type   ENUM('WEEKDAY','WEEKEND') NOT NULL,
    timing       VARCHAR(50),   -- e.g., "10:00 AM - 11:30 AM"
    start_date   DATE NOT NULL,
    end_date     DATE NOT NULL,
    is_active    BOOLEAN DEFAULT TRUE,
    created_by   BIGINT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (trainer_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================
-- 8. BATCH_STUDENTS (enrollment junction)
-- ============================================================
CREATE TABLE batch_students (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_id   BIGINT NOT NULL,
    student_id BIGINT NOT NULL,  -- references students.id
    joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_batch_student (batch_id, student_id),
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. SYLLABUS TABLE
-- ============================================================
CREATE TABLE syllabus (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_id   BIGINT NOT NULL,
    date       DATE NOT NULL,
    topic      VARCHAR(255) NOT NULL,
    description TEXT,
    status     ENUM('PENDING','COMPLETED','SKIPPED') DEFAULT 'PENDING',
    day_number INT,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ============================================================
-- 10. ATTENDANCE TABLE
-- ============================================================
CREATE TABLE attendance (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_id     BIGINT NOT NULL,
    student_id   BIGINT NOT NULL,  -- references students.id
    syllabus_id  BIGINT NOT NULL,  -- attendance linked to syllabus day
    date         DATE NOT NULL,
    status       ENUM('PRESENT','ABSENT','LATE') DEFAULT 'ABSENT',
    marked_by    BIGINT,           -- trainer user_id
    remarks      VARCHAR(255),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attendance (batch_id, student_id, date),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (syllabus_id) REFERENCES syllabus(id),
    FOREIGN KEY (marked_by) REFERENCES users(id),
    -- CRITICAL: attendance only allowed if topic is completed
    CONSTRAINT chk_syllabus_status CHECK (TRUE)  -- enforced at application layer
);

-- ============================================================
-- 11. PAYMENTS TABLE
-- ============================================================
CREATE TABLE payments (
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id     BIGINT NOT NULL,
    batch_id       BIGINT,
    total_fees     DECIMAL(10,2) NOT NULL,
    paid_amount    DECIMAL(10,2) DEFAULT 0.00,
    pending_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - paid_amount) STORED,
    payment_date   DATE,
    payment_mode   ENUM('CASH','ONLINE','CHEQUE','UPI') DEFAULT 'CASH',
    transaction_ref VARCHAR(100),
    notes          TEXT,
    received_by    BIGINT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (received_by) REFERENCES users(id)
);

-- ============================================================
-- 12. PAYMENT_TRANSACTIONS (individual installments)
-- ============================================================
CREATE TABLE payment_transactions (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id   BIGINT NOT NULL,
    amount       DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode ENUM('CASH','ONLINE','CHEQUE','UPI') DEFAULT 'CASH',
    transaction_ref VARCHAR(100),
    received_by  BIGINT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(id)
);

-- ============================================================
-- 13. VALIDATION_TESTS (Weekly - every Friday)
-- ============================================================
CREATE TABLE validation_tests (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_id    BIGINT NOT NULL,
    student_id  BIGINT NOT NULL,
    test_date   DATE NOT NULL,  -- Should be a Friday
    week_number INT,
    marks       DECIMAL(5,2),
    max_marks   DECIMAL(5,2) DEFAULT 100,
    level       ENUM('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT 'BEGINNER',
    feedback    TEXT,
    conducted_by BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (conducted_by) REFERENCES users(id)
);

-- ============================================================
-- 14. MOCK_INTERVIEWS (Monthly)
-- ============================================================
CREATE TABLE mock_interviews (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    batch_id     BIGINT NOT NULL,
    student_id   BIGINT NOT NULL,
    interview_date DATE NOT NULL,
    month_number INT,
    score        DECIMAL(5,2),
    max_score    DECIMAL(5,2) DEFAULT 100,
    level        ENUM('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT 'BEGINNER',
    feedback     TEXT,
    conducted_by BIGINT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (conducted_by) REFERENCES users(id)
);

-- ============================================================
-- 15. PLACEMENTS TABLE
-- ============================================================
CREATE TABLE placements (
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id     BIGINT NOT NULL UNIQUE,
    company_name   VARCHAR(150),
    position       VARCHAR(150),
    interview_date DATE,
    result_status  ENUM('PASSED','IN_PROCESS','REJECTED') DEFAULT 'IN_PROCESS',
    package_lpa    DECIMAL(5,2),
    feedback       TEXT,
    placed_by      BIGINT,  -- placement HR user_id
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (placed_by) REFERENCES users(id)
);

-- ============================================================
-- 16. STUDENT_QUERIES TABLE
-- ============================================================
CREATE TABLE student_queries (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id  BIGINT NOT NULL,
    batch_id    BIGINT NOT NULL,
    query_text  TEXT NOT NULL,
    reply_text  TEXT,
    replied_by  BIGINT,  -- trainer user_id
    status      ENUM('OPEN','REPLIED','CLOSED') DEFAULT 'OPEN',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_at  TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (replied_by) REFERENCES users(id)
);

-- ============================================================
-- 17. REPORTS TABLE
-- ============================================================
CREATE TABLE reports (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type  ENUM('DAILY','WEEKLY','MONTHLY') DEFAULT 'DAILY',
    report_date  DATE NOT NULL,
    submitted_by BIGINT NOT NULL,
    approved_by  BIGINT,
    content      JSON,  -- flexible JSON content
    status       ENUM('DRAFT','SUBMITTED','REVIEWED','APPROVED') DEFAULT 'DRAFT',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- ============================================================
-- 18. TERMS_CONDITIONS TABLE
-- ============================================================
CREATE TABLE terms_conditions (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    title      VARCHAR(255) NOT NULL,
    content    TEXT NOT NULL,
    version    VARCHAR(20) DEFAULT '1.0',
    is_active  BOOLEAN DEFAULT TRUE,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Roles
INSERT INTO roles (name, description) VALUES
('ADMIN',           'Root Administrator'),
('SUPER_ADMIN',     'Super Administrator - Full Access'),
('SEO',             'Lead Generator / SEO Executive'),
('SALES_HEAD',      'Sales Head - Manages Sales Team'),
('SALES_EMPLOYEE',  'Sales Executive - Handles Leads'),
('TRAINER_HEAD',    'Trainer Head - Manages Training'),
('TRAINER',         'Trainer - Delivers Training'),
('HR',              'HR Manager'),
('PLACEMENT_HR',    'Placement Coordinator'),
('STUDENT',         'Student');

-- Admin User (password: Admin@123)
INSERT INTO users (name, email, password, phone, role_id, created_by) VALUES
('System Admin', 'admin@iat.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpMFf0.zXLu5sW',
 '9999999999', 1, NULL);

-- Terms & Conditions default
INSERT INTO terms_conditions (title, content, updated_by) VALUES
('Enrollment Terms & Conditions',
 'By enrolling in this institute, students agree to:\n1. Attend classes regularly.\n2. Complete assignments on time.\n3. Maintain discipline.\n4. Pay fees as per schedule.\n5. Follow institute policies.',
 1);
