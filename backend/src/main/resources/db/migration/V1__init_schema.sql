-- Flyway Migration: V1__init_schema.sql
-- ADHIKAAR AI Civic Platform PostgreSQL Schema

-- 1. Roles & Users
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    gender VARCHAR(30),
    state VARCHAR(100),
    district VARCHAR(100),
    occupation VARCHAR(100),
    annual_income NUMERIC(14, 2),
    education_level VARCHAR(100),
    has_landholding BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scheme Providers & Categories
CREATE TABLE IF NOT EXISTS scheme_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    label_en VARCHAR(100) NOT NULL,
    label_te VARCHAR(100),
    icon VARCHAR(50),
    description TEXT
);

CREATE TABLE IF NOT EXISTS scheme_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    provider_type VARCHAR(50) NOT NULL, -- GOVERNMENT, NGO
    jurisdiction VARCHAR(100), -- TELANGANA, CENTRAL, ALL_INDIA
    website_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Schemes & Sources
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    name_te VARCHAR(300),
    provider_id BIGINT REFERENCES scheme_providers(id),
    category_id BIGINT REFERENCES scheme_categories(id),
    description TEXT NOT NULL,
    official_url VARCHAR(500),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    verified_at DATE,
    deadline_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheme_benefits (
    id BIGSERIAL PRIMARY KEY,
    scheme_id VARCHAR(100) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    benefit_text TEXT NOT NULL,
    benefit_text_te TEXT,
    order_index INT DEFAULT 0
);

-- 5. Eligibility Rules & Versions
CREATE TABLE IF NOT EXISTS rule_versions (
    id BIGSERIAL PRIMARY KEY,
    version_tag VARCHAR(50) NOT NULL UNIQUE,
    effective_from DATE NOT NULL,
    published_by VARCHAR(100),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS eligibility_rules (
    id BIGSERIAL PRIMARY KEY,
    scheme_id VARCHAR(100) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    rule_version_id BIGINT REFERENCES rule_versions(id),
    min_age INT,
    max_age INT,
    income_ceiling NUMERIC(14, 2),
    applicable_states TEXT, -- Comma-separated or ALL
    applicable_occupations TEXT,
    requires_landholding BOOLEAN DEFAULT FALSE,
    additional_criteria TEXT
);

-- 6. Document Requirements
CREATE TABLE IF NOT EXISTS document_requirements (
    id VARCHAR(100) PRIMARY KEY,
    scheme_id VARCHAR(100) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE
);

-- 7. User Document Readiness & Preflight
CREATE TABLE IF NOT EXISTS user_document_readiness (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_requirement_id VARCHAR(100) NOT NULL REFERENCES document_requirements(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- READY, MISSING, NEEDS_UPDATE, OPTIONAL
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, document_requirement_id)
);

-- 8. Saved Schemes
CREATE TABLE IF NOT EXISTS saved_schemes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheme_id VARCHAR(100) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, scheme_id)
);

-- 9. Application Journeys & History
CREATE TABLE IF NOT EXISTS application_journeys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheme_id VARCHAR(100) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    current_status VARCHAR(50) NOT NULL, -- NOT_STARTED, PREPARING, READY_TO_APPLY, SUBMITTED_BY_USER, FOLLOW_UP_NEEDED, COMPLETED
    application_reference VARCHAR(150),
    next_recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_status_history (
    id BIGSERIAL PRIMARY KEY,
    journey_id BIGINT NOT NULL REFERENCES application_journeys(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    label VARCHAR(150),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- UPDATE, ALERT, INFO
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    email_alerts BOOLEAN DEFAULT TRUE,
    sms_alerts BOOLEAN DEFAULT TRUE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Assistant Conversations
CREATE TABLE IF NOT EXISTS assistant_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    sender VARCHAR(20) NOT NULL, -- user, assistant
    message_text TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Admin Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100),
    target_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Roles Seeding
INSERT INTO roles (name, description) VALUES 
('ROLE_USER', 'Standard Citizen User'),
('ROLE_ADMIN', 'Civic Platform Administrator')
ON CONFLICT (name) DO NOTHING;

-- Initial Rule Version
INSERT INTO rule_versions (version_tag, effective_from, published_by, notes) VALUES
('2026.11-v1.4', '2026-11-01', 'Telangana Civic Verification Board', 'Current verified ruleset')
ON CONFLICT (version_tag) DO NOTHING;

