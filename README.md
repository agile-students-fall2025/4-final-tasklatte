# ☕ TaskLatte

## Product Vision Statement

**TaskLatte** is a wellness and productivity app that promotes balance between academics and personal life through the visualization of a cozy coffee shop.  
It’s not just another to-do list — it’s a **smart scheduling companion** that adapts to your habits, productivity, and energy levels, helping you manage your workload while preventing burnout.

---

### Live Demo
The deployed version of our application is available at:

🔗 **http://167.172.18.57/**

This instance reflects the latest merged changes from the main branch.

## Team
| Name | GitHub |
|------|---------|
| **Susan Thao** | [@susan-t](https://github.com/susan-t)
| **Muhammad Abyan Ahmed** | [@mabyan22](https://github.com/mabyan22)
| **Valeria Chang** | [@ValeriaChang](https://github.com/ValeriaChang) |
| **Mandy Mao** | [@manrongm](https://github.com/manrongm) | 
| **Yasmine Ksiyer** | [@yasminek27](https://github.com/yasminek27) | 

**Sprint 0**

- **Muhammad Abyan Ahmed (Product Owner)**

- **Valeria Chang (Scrum Matser)**

**Sprint 1**

- **Susan Thao (Product Owner)**

- **Mandy Mao (Scrum Master)**

**Sprint 2**

- **Valeria Chang (Product Owner)**

- **Yasmine Ksiyer (Scrum Master)**

**Sprint 3**

- **Yasmine Ksiyer (Product Owner)**

- **Susan Thao (Scrum Master)**

**Sprint 4**

- **Mandy Mao (Product Owner)**

- **Muhammad Abyan Ahmed (Scrum Matser)**

---

## Project Overview

**TaskLatte** encourages healthy study habits and time management through adaptive scheduling and wellness reminders.  
While most existing tools like Google Calendar or Notion provide static lists, **TaskLatte** uses AI-driven adjustments and visual metaphors to make time management personal, dynamic, and engaging.

### Why TaskLatte?

Students today often struggle with:
- Balancing multiple classes, deadlines, and personal time.
- Overcommitting and burning out due to poor time management.
- Relying on static calendars that don’t adapt to real productivity.

**TaskLatte** solves this by generating a **personalized study and wellness plan** that evolves with you.  
Your calendar becomes a café — a visual representation of your workload — where tasks, breaks, and priorities blend together seamlessly.

---

## For Whom

**TaskLatte is designed for university students** who want to stay organized while maintaining wellness.

If you are:
- Taking multiple classes or working part-time  
- Prone to procrastination or burnout  
- Looking to integrate rest and self-care into your schedule  
- Already using tools like Google Calendar or Notion, but wanting something more adaptive  

Then **TaskLatte** is the perfect companion to help you study smarter, not harder.

---

## How It Works

### From the user’s perspective:

1. **Input setup:**  
   Users enter their class schedules, recurring events, and upcoming deadlines (assignments, exams, projects), along with estimated completion times.

2. **Smart scheduling:**  
   The system auto-generates a daily and weekly schedule that includes study sessions and wellness breaks using adaptive algorithms.

3. **Adaptive learning:**  
   Over time, TaskLatte learns user productivity patterns — when they focus best, how long tasks take — and adjusts schedules accordingly.

4. **Daily blends:**  
   Users receive “daily blends” summarizing tasks, goals, and wellness reminders.

5. **Café visualization:**  
   The coffee shop UI changes based on workload — from calm mornings to busy rush hours — providing a creative visualization of balance and stress levels.

---

## Deployment & Live Demo

**Live Application:** **[http://167.172.18.57](http://167.172.18.57)**

### Extra Credit Implementation
We have successfully implemented a full **CI/CD Pipeline** using GitHub Actions to automate our testing and deployment process.

* **Continuous Integration (CI):**
    * Every Pull Request automatically triggers a workflow that installs dependencies and runs our full test suite (`npm test`).
    * The workflow also attempts a production build (`npm run build`) to ensure no syntax or compilation errors exist.
    * **Result:** Broken code is blocked from being merged into the main branch.

* **Continuous Deployment (CD):**
    * When code is successfully merged into the `main` branch, a second workflow is triggered.
    * This workflow securely logs into our Digital Ocean droplet via SSH, pulls the latest code, rebuilds the frontend, and restarts the backend services via PM2.
    * **Result:** Updates go live automatically without manual server intervention.

---

### Deployment Tech Stack
* **Hosting:** Digital Ocean Droplet (Ubuntu 24.04 LTS)
* **Web Server:** Nginx (Reverse Proxy)
* **Process Management:** PM2
* **Automation:** GitHub Actions
* **Security:** Environment variables stored in secure server-side `.env` files and injected into CI/CD via GitHub Secrets.

---

## Build Instructions

> *(These will be updated as the project reaches later stages of development.)*

### 1. Clone the repository
```bash
git clone https://github.com/agile-students-fall2025/4-final-tasklatte
cd 4-final-tasklatte/front-end # to start frontend
cd 4-final-tasklatte/back-end # to start backend
```

### 2. Install dependencies (for both folders)
```bash
npm install
```

### 3. Run locally (for both folders)
```bash
npm start
```
---

## 🤝 How to Contribute

- Read our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Additional Resources

- [Proposal Document](https://github.com/agile-students-fall2025/1-project-proposal-sleep/blob/main/README.md)
- [Wireframes](https://www.figma.com/design/PSvBhg3W6DRRxdASL4Bamq/Tasklatte?node-id=0-1&t=CjTC0cJKEBsTICyp-1)
- [App Map](https://drive.google.com/file/d/1PRT98SwQDq7Cg2TRRQ7L4PUbS1O74H0Z/view?usp=sharing)
- [Contributing Guide](./CONTRIBUTING.md)

---

## 🌿 License & Acknowledgements

This project is open-source under the [MIT License](./LICENSE).  
We thank NYU and our instructors for guidance, and all contributors who help TaskLatte brew better study habits for everyone.

---