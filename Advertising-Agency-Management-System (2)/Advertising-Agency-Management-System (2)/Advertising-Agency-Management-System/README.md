# AdFlow - Advertising Agency Management System

![AdFlow Enterprise](docs/Architecture-Diagram.png)

> **Enterprise Multi-Tier Advertising Agency Management Platform**  
> Developed for **BrightWave Advertising (Pvt) Ltd**  
> **Course:** SE2030 Software Engineering | **Group:** Y2-S1-MLB-B4G1-03

---

## 📌 Overview

**AdFlow** is a comprehensive, production-ready enterprise management system specifically tailored for digital, 3D, and ATL/BTL advertising agencies. It standardizes client onboarding, campaign lifecycle management, internal creative workflows (Kanban), multi-version media libraries, client review pipelines, and financial ledgering into a unified cloud-native architecture.

---

## 🏗️ Architecture & Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.3 (Java 17 LTS)
- **Security:** Spring Security 6 + JJWT (Stateless JSON Web Token Authentication & Role-Based Access Control)
- **Persistence:** Spring Data JPA / Hibernate ORM
- **Database:** MySQL 8.x / InnoDB (Relational normalization with foreign key cascading)
- **Validation:** Jakarta Bean Validation (Hibernate Validator)
- **Build Tool:** Apache Maven 3.9+ (includes `mvnw` wrapper)

### Frontend
- **Templating & Presentation:** Thymeleaf 3 + Modern HTML5 / CSS3
- **Styling:** Custom CSS3 Glassmorphic Design System (Variables, Flexbox/Grid, Micro-animations)
- **JavaScript:** Vanilla ES6+ Modular Client Architecture (`api-client.js`, domain API clients, UI module controllers)
- **Responsive Design:** Mobile-first layout with desktop dashboard optimization

---

## 👥 Assigned Modules & Engineering Team

| Module | Assigned Member | Role | Registration No. | Key Deliverables |
|:---|:---|:---|:---|:---|
| **1. Appointments** | Rathnayaka R.M.H.R | Client Relations Officer | `IT25101858` | Scheduling, 8-5 working hours check, double-booking guard |
| **2. Campaigns** | Mendiya J.L.P.S | Marketing Manager | `IT25102708` | Campaign creation, budget validation, uniqueness rules |
| **3. Tasks & Workflow** | Wickramanayaka A.W.H.D | Creative Team Lead | `IT25103706` | Interactive Kanban lifecycle, priority levels, assignment |
| **4. Client Feedback** | Yashika J. | Creative Staff | `IT25101800` | Rating 1-5, client-only editing constraint, review audit |
| **5. Creative Assets** | Navodi V.G.C | Creative Staff | `IT25103678` | Multipart media upload, version auto-increment, categorizer |
| **6. Invoicing & Finance** | Gamage M.I.I.K | Finance Executive | `IT25100872` | Tax calculation (VAT 8%), line items breakdown, payment tracking |

---

## 🚀 Quick Start Guide

### 1. Database Setup
1. Start your local **MySQL Server** (port 3306).
2. Execute the combined SQL setup script in your MySQL client (MySQL Workbench, phpMyAdmin, or CLI):
   ```sql
   source database/advertising_agency.sql;
   ```
   *(Alternatively, execute `database/schema.sql` followed by `database/seed-data.sql`)*.

3. Verify connection settings in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/adflow_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=password
   ```

### 2. Running the Application
Using the Maven Wrapper:
- **Windows:**
  ```cmd
  mvnw.cmd spring-boot:run
  ```
- **Linux / macOS:**
  ```bash
  ./mvnw spring-boot:run
  ```

Or open directly in **IntelliJ IDEA / Eclipse / VS Code** as a Maven project and run `AdFlowApplication.java`.

### 3. Accessing the System
- **Web Portal:** [http://localhost:8080/](http://localhost:8080/)
- **API Base:** [http://localhost:8080/api/](http://localhost:8080/api/)
- **Swagger / API Docs:** Refer to [docs/API-Documentation.md](docs/API-Documentation.md)

---

## 🔑 Login Credentials

Refer to [LOGIN_CREDENTIALS.txt](LOGIN_CREDENTIALS.txt) for ready-to-use testing accounts:
- **System Administrator:** `admin@brightwave.lk` / `Admin@123`
- **Appointment Manager:** `appointments@brightwave.lk` / `Appoint@123`
- **Campaign Manager:** `campaigns@brightwave.lk` / `Campaign@123`
- **Task & Project Manager:** `projects@brightwave.lk` / `Project@123`
- **Creative Asset Manager:** `assets@brightwave.lk` / `Assets@123`
- **Finance & Billing Executive:** `billing@brightwave.lk` / `Billing@123`
- **Client Account:** `client@dialog.lk` / `password123`

---

## 📄 License & Academic Integrity
This project is submitted for the partial fulfillment of the requirements for SE2030 Software Engineering. All rights reserved by BrightWave Advertising (Pvt) Ltd and Sri Lanka Institute of Information Technology (SLIIT).
