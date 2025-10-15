# Guide to Contributing

This document outlines our team’s shared values, workflows, and technical setup to ensure consistency and collaboration across all contributions.

---

## Team Norms and Values

We value:
- **Collaboration** — Open communication, transparency, and respect for all opinions.  
- **Consistency** — Follow agreed-upon coding style, commit messages, and documentation format.  
- **Accountability** — Each contributor is responsible for testing and reviewing their work.  
- **Learning & Improvement** — Every PR is a chance to learn and help others grow.  

Team agreements:
- Communicate blockers early in the group chat or weekly meetings.  
- Use clear, descriptive commit messages and pull request titles.  
- Review peers’ work constructively — focus on clarity, readability, and maintainability.  
- No direct pushes to the `main` branch — always use branches and PR reviews.  

---

## Git Workflow

We use a **feature-branch workflow** built around Pull Requests (PRs).

### 1. Clone the Repository

```bash
git https://github.com/agile-students-fall2025/4-final-tasklatte
cd 4-final-tasklatte
```

### 2. Create a New Branch

Branch naming conventions:

```text
feature/<short-description>     # for new features
fix/<short-description>         # for bug fixes
docs/<short-description>        # for documentation updates
```

Example:

```bash
git checkout -b feature/add-login-page
```

### 3. Commit Changes

Follow **Conventional Commits** format for clarity:

```text
feat: add login form validation
fix: correct null pointer in user model
docs: update setup instructions
```

### 4. Push and Open a Pull Request

```bash
git push origin feature/add-login-page
```

Then, go to GitHub → open a Pull Request into `main`.

**Every PR must:**

- Include a **brief summary** of the change and motivation.  
- Pass all tests before review.  
- Be reviewed and approved by at least **one teammate**.

---

## Rules for Contributing

### ✅ Do

- Keep PRs small and focused (ideally ≤ 300 lines).  
- Update documentation or comments when you change behavior.  
- Add tests for new features or major fixes.  
- Format code before committing (`prettier`, `black`, or project standard).  
- Follow naming conventions and consistent indentation.  

### 🚫 Don’t

- Merge directly into `main`.  
- Commit compiled or generated files (`node_modules/`, `__pycache__/`, etc.).  
- Push code containing credentials, API keys, or sensitive information.  
- Ignore linting or test failures.  

---

## Code Review and Approval Process

- Reviews focus on correctness, readability, and maintainability.  
- Use GitHub comments for suggestions, not personal feedback.  
- The author must respond to all comments before merging.  
- Use **Squash and Merge** to maintain a clean commit history.  
- Resolve merge conflicts locally before requesting approval.  

---

## Communication and Collaboration

- Use GitHub Issues for feature requests, bugs, and enhancements.  
- Tag team members or assign reviewers when submitting PRs.  
- Discuss major architectural decisions in the project channel before implementing.  
- Document all setup or configuration changes in `README.md`.  

---

## Project Setup Recap

1. Fork or clone the repository.  
2. Create a feature branch.  
3. Write clean, modular, and tested code.  
4. Commit with descriptive messages.  
5. Push changes and open a PR.  
6. Request at least one review before merging.  

---

## Contributor Code of Conduct

By participating, you agree to uphold our standards of respect and inclusion.  
Treat all contributors with kindness and professionalism — we are here to build together.

---

## Questions or Support

If you have any questions:

- Tag your teammates in the issue or PR discussion.  
- Post in the team chat for quick help.  
- For setup issues, check the `README.md` troubleshooting section.  

---

_This `CONTRIBUTING.md` defines our shared workflow and collaboration rules.  
Please read and follow it carefully before making your first contribution._

