# GitHub Setup Instructions

## Option 1: Using GitHub Web Interface (Recommended)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `trading-backtester` (or your preferred name)
   - Description: "Algorithmic Trading Backtester - Visualize trading strategy performance"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code:**
   After creating the repository, run these commands in your terminal:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trading-backtester.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your actual GitHub username.

## Option 2: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh auth login
gh repo create trading-backtester --public --source=. --remote=origin --push
```

## Verify Your Repository

After pushing, visit your repository URL:
`https://github.com/YOUR_USERNAME/trading-backtester`

You should see all your files including:
- README.md
- app/ folder with components
- package.json
- and more...

## Next Steps

Once pushed to GitHub, you can:
1. Enable GitHub Pages to deploy your app
2. Connect to Vercel for automatic deployments
3. Set up CI/CD workflows
4. Invite collaborators

---

**Note:** Make sure you have Git configured with your credentials:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

