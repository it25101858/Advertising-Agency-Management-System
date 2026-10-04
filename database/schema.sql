-- ============================================================================
-- AdFlow - Web-Based Advertising Agency Management System
-- Consolidated Full Database Script (Database Creation + Schema + Seed Data)
-- Target Database: MySQL 8.0+
-- Group: Y2-S1-MLB-B4G1-03
-- Company: BrightWave Advertising (Pvt) Ltd
-- ============================================================================

DROP DATABASE IF EXISTS adflow_db;
CREATE DATABASE adflow_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE adflow_db;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM(
        'CLIENT', 
        'CLIENT_RELATIONS_OFFICER', 
        'MARKETING_MANAGER', 
        'CREATIVE_TEAM_LEAD', 
        'CREATIVE_STAFF', 
        'FINANCE_EXECUTIVE', 
        'MANAGING_DIRECTOR', 
        'SYSTEM_ADMIN'
    ) NOT NULL DEFAULT 'CLIENT',
    phone VARCHAR(20),
    company_name VARCHAR(100),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. CAMPAIGNS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE campaigns (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(150) NOT NULL,
    client_id INT NOT NULL,
    manager_id INT NOT NULL,
    budget DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    spent_amount DECIMAL(12, 2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    objective TEXT,
    creative_brief TEXT,
    status ENUM('UPCOMING', 'ACTIVE', 'IN_REVIEW', 'COMPLETED', 'ARCHIVED') DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_camp_dates (start_date, end_date),
    INDEX idx_camp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. APPOINTMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    assigned_staff_id INT NOT NULL,
    campaign_id INT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    purpose VARCHAR(200) NOT NULL,
    meeting_type ENUM('IN_PERSON', 'VIRTUAL_CALL', 'PHONE_CALL') DEFAULT 'VIRTUAL_CALL',
    status ENUM('SCHEDULED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE SET NULL,
    INDEX idx_meeting_slot (assigned_staff_id, client_id, meeting_date, meeting_time, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. TASKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    assigned_to_id INT NOT NULL,
    created_by_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    status ENUM('TODO', 'IN_PROGRESS', 'NEEDS_REVIEW', 'COMPLETED') DEFAULT 'TODO',
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_task_kanban (status, priority, deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. CREATIVE ASSETS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE creative_assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    uploaded_by_id INT NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    file_type VARCHAR(150) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_kb INT DEFAULT 0,
    tags VARCHAR(255),
    category ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'COPYWRITING', 'OTHER') DEFAULT 'IMAGE',
    version VARCHAR(20) DEFAULT 'v1.0',
    approval_status ENUM('PENDING', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_asset_category (category, approval_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. CLIENT FEEDBACK TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    task_id INT NULL,
    asset_id INT NULL,
    client_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT NOT NULL,
    status ENUM('SUBMITTED', 'ADDRESSED', 'RESOLVED', 'APPROVED') DEFAULT 'SUBMITTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE SET NULL,
    FOREIGN KEY (asset_id) REFERENCES creative_assets(asset_id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_feedback_rating (rating, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. INVOICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    campaign_id INT NOT NULL,
    client_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 8.00,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('DRAFT', 'SENT', 'OVERDUE', 'PAID', 'VOID') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_invoice_status (status, due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. INVOICE LINE ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE invoice_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    description VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA INSERTIONS
-- ============================================================================

INSERT INTO users (user_id, full_name, email, password_hash, role, phone, company_name) VALUES
(1, 'Kasun Perera', 'client@dialog.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'CLIENT', '+94771234567', 'Dialog Axiata PLC'),
(2, 'Rathnayaka R.M.H.R', 'appointments@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'CLIENT_RELATIONS_OFFICER', '+94712345678', 'BrightWave Advertising'),
(3, 'Mendiya J.L.P.S', 'campaigns@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'MARKETING_MANAGER', '+94703456789', 'BrightWave Advertising'),
(4, 'Wickramanayaka A.W.H.D', 'projects@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'CREATIVE_TEAM_LEAD', '+94764567890', 'BrightWave Advertising'),
(5, 'Navodi V.G.C', 'assets@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'CREATIVE_STAFF', '+94755678901', 'BrightWave Advertising'),
(6, 'Yashika J.', 'feedback@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'CREATIVE_STAFF', '+94786789012', 'BrightWave Advertising'),
(7, 'Gamage M.I.I.K', 'billing@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'FINANCE_EXECUTIVE', '+94727890123', 'BrightWave Advertising'),
(8, 'Dilshan Silva', 'md@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'MANAGING_DIRECTOR', '+94718901234', 'BrightWave Advertising'),
(9, 'System Administrator', 'admin@brightwave.lk', '$2a$10$wK1WwZkW.R7bQoQfKqH40eD6w/E6F5G8H7I9J0K1L2M3N4O5P6Q7R', 'SYSTEM_ADMIN', '+94112345678', 'BrightWave Advertising');

INSERT INTO campaigns (campaign_id, campaign_name, client_id, manager_id, budget, spent_amount, start_date, end_date, objective, creative_brief, status) VALUES
(1, '5G Mega Launch 2026', 1, 3, 2500000.00, 1200000.00, '2026-03-01', '2026-06-30', 'Drive nationwide 5G adoption among youth and corporate customers.', 'Focus on ultra-fast speeds, vibrant 3D visuals, and islandwide billboard push.', 'ACTIVE'),
(2, 'Avurudu Festive Promo', 1, 3, 1500000.00, 300000.00, '2026-03-15', '2026-04-20', 'Promote special seasonal reload cashbacks and device discounts.', 'Cultural blend of traditional Avurudu colors with futuristic mobile tech imagery.', 'UPCOMING');

INSERT INTO appointments (appointment_id, client_id, assigned_staff_id, campaign_id, meeting_date, meeting_time, purpose, meeting_type, status, notes) VALUES
(1, 1, 2, 1, '2026-03-05', '10:00:00', 'Initial 5G Campaign Briefing & Strategy Alignment', 'VIRTUAL_CALL', 'COMPLETED', 'Client agreed on key deliverables and TV commercial timeline.'),
(2, 1, 2, 2, '2026-03-12', '14:30:00', 'Avurudu Creative Artwork Approval Session', 'IN_PERSON', 'SCHEDULED', 'Meeting at BrightWave HQ Boardroom with Marketing Director.');

INSERT INTO tasks (task_id, campaign_id, assigned_to_id, created_by_id, title, description, priority, status, deadline) VALUES
(1, 1, 5, 4, '3D Billboard Animation Design', 'Create high-res 3D video loop for Lotus Tower LED display', 'URGENT', 'IN_PROGRESS', '2026-03-18'),
(2, 1, 6, 4, 'Radio Jingle Copywriting', 'Draft 30-second energetic Sinhala and English radio ad scripts', 'HIGH', 'NEEDS_REVIEW', '2026-03-14'),
(3, 2, 5, 4, 'Social Media Banner Sets', 'Design Instagram and Facebook carousel templates for cashback promo', 'MEDIUM', 'TODO', '2026-03-25');

INSERT INTO creative_assets (asset_id, campaign_id, uploaded_by_id, file_name, file_type, file_url, file_size_kb, tags, category, version, approval_status) VALUES
(1, 1, 5, '5G_LotusTower_Mockup_v1.png', 'image/png', '/static/images/portfolio/portfolio-1.jpg', 4500, '5G, Billboard, 3D, Mockup', 'IMAGE', 'v1.0', 'PENDING'),
(2, 1, 6, 'Radio_Script_5G_v2.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '/static/images/portfolio/portfolio-2.jpg', 320, 'Radio, Jingle, Copy, Sinhala', 'COPYWRITING', 'v2.0', 'APPROVED');

INSERT INTO feedback (feedback_id, campaign_id, task_id, asset_id, client_id, rating, comments, status) VALUES
(1, 1, 2, 2, 1, 5, 'Radio script tagline is very catchy! Minor tweak requested for tone on line 4.', 'RESOLVED'),
(2, 1, 1, 1, 1, 4, 'Color palette looks modern, but please make the 5G speed badge bigger.', 'SUBMITTED');

INSERT INTO invoices (invoice_id, invoice_number, campaign_id, client_id, issue_date, due_date, tax_rate, subtotal, tax_amount, total_amount, paid_amount, status) VALUES
(1, 'INV-2026-001', 1, 1, '2026-03-01', '2026-03-31', 8.00, 1000000.00, 80000.00, 1080000.00, 1080000.00, 'PAID'),
(2, 'INV-2026-002', 1, 1, '2026-03-10', '2026-04-10', 8.00, 500000.00, 40000.00, 540000.00, 0.00, 'SENT');

INSERT INTO invoice_items (item_id, invoice_id, description, quantity, unit_price, line_total) VALUES
(1, 1, '3D Concept Design & Storyboarding', 1, 400000.00, 400000.00),
(2, 1, 'TV & Digital Media Production Phase 1', 1, 600000.00, 600000.00),
(3, 2, 'Outdoor Billboard Slot Reservation & Printing', 2, 250000.00, 500000.00);

INSERT INTO notifications (notification_id, user_id, title, message, category, is_read) VALUES
(1, 1, 'Appointment Reminder', 'You have an upcoming meeting on 2026-03-12 at 14:30.', 'APPOINTMENT', FALSE),
(2, 4, 'New Feedback Submitted', 'Client Kasun Perera submitted feedback on 5G Lotus Tower Mockup.', 'FEEDBACK', FALSE);
