# Push This Site to GitHub & Use in VS Code

## Part 1: Folder on your PC (you already have it)

Your project is already in a folder on your PC:
- **Path:** `c:\Users\aayus\OneDrive\Desktop\FUTURE_FS_03`

**To open it in VS Code:**
1. Open **VS Code**
2. **File → Open Folder** (or `Ctrl+K Ctrl+O`)
3. Go to `C:\Users\aayus\OneDrive\Desktop\FUTURE_FS_03` and click **Select Folder**

You can work in this folder normally. Once you push to GitHub, this same folder will be your "local repo" connected to GitHub.

---

## Part 2: Push to GitHub

### Step 1: Create a new repo on GitHub

1. Go to **https://github.com** and sign in
2. Click the **+** (top right) → **New repository**
3. Fill in:
   - **Repository name:** e.g. `the-roasted-bean` or `cafe-website`
   - **Description:** (optional) e.g. "Local café website - Task 3"
   - Leave **Public** selected
   - **Do not** check "Add a README" or "Add .gitignore" (you already have them)
4. Click **Create repository**

### Step 2: Connect your folder to GitHub and push

Open **Terminal** in VS Code (**Terminal → New Terminal** or `` Ctrl+` ``). Make sure you're in the project folder, then run these commands **one by one**.

**If you haven’t run any git commands yet in this folder:**

```bash
git init
git add .
git commit -m "Initial commit: The Roasted Bean café website"
```

**Then add your GitHub repo and push** (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your real GitHub username and repo name):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:** If your username is `aayus` and repo name is `the-roasted-bean`:

```bash
git remote add origin https://github.com/aayus/the-roasted-bean.git
git branch -M main
git push -u origin main
```

GitHub may ask you to sign in (browser or token). After a successful push, your site files will be on GitHub.

---

## Part 3: Later – open the project from another PC or clone

If you want this project in **another folder** (e.g. on another PC):

1. On GitHub, open your repo and copy the repo URL (e.g. `https://github.com/aayus/the-roasted-bean.git`)
2. In VS Code: **File → Clone Repository** → paste the URL → choose a folder on your PC
3. That new folder will be a copy of the project, linked to the same GitHub repo

---

## Quick reference

| Goal                         | Action |
|-----------------------------|--------|
| Open project in VS Code     | File → Open Folder → `FUTURE_FS_03` |
| Create GitHub repo          | github.com → New repository (no README/.gitignore) |
| First-time push from this PC| `git init` → `git add .` → `git commit -m "..."` → `git remote add origin ...` → `git push -u origin main` |
| Push changes later          | `git add .` → `git commit -m "Your message"` → `git push` |
