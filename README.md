# Sepsis: Killer T Cell Chronicles

Hey Jacques and Makayla! This is the game we're building together. This guide will walk you through everything you need to get set up and start contributing — no experience required.

---

## What is this game?

A mobile platformer where you play as a Killer T Cell fighting bacterial infections across 6 levels of the human body. It's built in **React Native** using **Expo Go**, which means you can run it directly on your phone without any complicated setup.

---

## Part 1 — The Tools You Need

You'll need four things installed on your computer:

### 1. Git
Git is the software that tracks changes to code and lets multiple people work on the same project without overwriting each other.

- **Mac:** Open Terminal and type `git --version`. If it prompts you to install, click Install.
- **Windows:** Download from [git-scm.com](https://git-scm.com) and run the installer (keep all the defaults).

### 2. Node.js
This is what runs JavaScript code on your computer (needed to run the game locally).

- Download the **LTS version** from [nodejs.org](https://nodejs.org)
- Run the installer and keep all defaults.
- To check it worked, open Terminal/Command Prompt and type `node --version`. You should see a version number.

### 3. Visual Studio Code (VSCode)
This is the code editor — the app you'll write code in.

- Download from [code.visualstudio.com](https://code.visualstudio.com)
- Run the installer.
- Open it. It looks like a dark text editor with a sidebar.

### 4. Claude Code (inside VSCode)
Claude Code is an AI assistant that lives inside VSCode and can write, explain, and fix code for you. It's how we'll build most of the game.

- Open VSCode.
- Click the **Extensions** icon in the left sidebar (it looks like four squares).
- Search for **Claude Code** and click Install.
- Once installed, you'll see a Claude icon in the sidebar. Click it and sign in with an Anthropic account (ask Mick for access if you don't have one).

### 5. Expo Go (on your phone)
This is the app that lets you run the game on your phone instantly.

- **iPhone:** Search "Expo Go" in the App Store and install it.
- **Android:** Search "Expo Go" in the Google Play Store and install it.

---

## Part 2 — GitHub: What It Is and How It Works

### The basic idea

Imagine the code is a shared Google Doc, but for software. GitHub is where the "master copy" of the code lives online. Your computer has its own local copy. When you make changes, you **push** them up to GitHub so everyone can see them. When someone else makes changes, you **pull** them down to your computer.

```
GitHub (the shared online copy)
    ↑ push your changes up
    ↓ pull other people's changes down
Your computer (your local copy)
```

### Setting up a GitHub account

1. Go to [github.com](https://github.com) and click **Sign up**.
2. Create a username, add your email, set a password.
3. Tell Mick your username so he can add you as a collaborator on the repo.
4. You'll get an email invite — accept it.

### Signing Git into your computer

Open Terminal (Mac) or Command Prompt (Windows) and run these two lines, replacing the details with your own:

```
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## Part 3 — Getting the Code onto Your Computer

This is called **cloning** the repo. You only do this once.

1. Open Terminal / Command Prompt.
2. Navigate to where you want to keep the project. For example, to put it on your Desktop:
   ```
   cd Desktop
   ```
3. Clone the repo:
   ```
   git clone https://github.com/fournaan/sepsis-game.git
   ```
4. Move into the project folder:
   ```
   cd sepsis-game
   ```
5. Install the project's dependencies (the packages the game needs to run):
   ```
   npm install
   ```
   This will take a minute and you'll see a lot of text scroll by — that's normal.

6. Open the project in VSCode:
   ```
   code .
   ```
   (The dot means "open this folder".)

---

## Part 4 — Running the Game on Your Phone

1. Make sure your phone and computer are on the **same Wi-Fi network**.

2. In Terminal (inside the `sepsis-game` folder), run:
   ```
   npx expo start
   ```

3. A QR code will appear in the terminal.

4. **iPhone:** Open the Camera app and point it at the QR code. Tap the Expo Go link that appears.
   **Android:** Open the Expo Go app, tap **Scan QR code**, and scan it.

5. The game will load on your phone in a few seconds. Every time you save a code change, the game will automatically refresh on your phone.

To stop the server, press `Ctrl + C` in the terminal.

---

## Part 5 — How to Pull and Push Code

### Before you start working each day — Pull

Always pull first to make sure you have the latest version of the code before you start making changes:

```
git pull
```

If there are new changes from Mick or anyone else, they'll download automatically.

### After you make changes — Commit and Push

When you've made some changes and want to save them to GitHub:

**Step 1: Check what you changed**
```
git status
```
This shows you a list of files you've changed (in red = not saved yet).

**Step 2: Stage your changes (tell Git which files to save)**
```
git add .
```
The dot means "all changed files". You can also add specific files: `git add screens/HomeScreen.jsx`

**Step 3: Commit — give your changes a description**
```
git commit -m "Add jump sound effect to level 1"
```
The message in quotes should briefly describe what you did. Keep it short and clear.

**Step 4: Push to GitHub**
```
git push
```

That's it — your changes are now on GitHub and everyone can see them.

### The daily workflow in summary

```
git pull              ← get latest code (do this first every day)
  ... make changes ...
git status            ← check what you changed
git add .             ← stage everything
git commit -m "..."   ← describe what you did
git push              ← send it to GitHub
```

---

## Part 6 — Using Claude Code to Help Build the Game

Claude Code is your AI coding partner inside VSCode. You don't need to know how to write code to use it — you just describe what you want in plain English.

### Opening Claude Code

- Click the Claude icon in the VSCode left sidebar.
- A chat panel opens on the right side.

### Examples of things you can ask it

- "Add a sound effect when the player jumps"
- "Make the background colour of the home screen dark purple"
- "Add a new enemy to Level 2 called Strep Pneumoniae with a blue colour"
- "Explain what this code does" (then paste in some code)
- "Fix this error" (then paste in the error message)

Claude Code can read all the files in the project, write new code, and explain anything that's confusing. If something breaks, just tell it what happened and it'll fix it.

### Important: always pull before asking Claude to make changes

If you haven't pulled the latest code, Claude might edit an old version of a file. Always `git pull` first.

---

## Part 7 — Project Structure (What's in Each Folder)

```
sepsis-game/
├── App.js                    ← The entry point — sets up navigation
├── app.json                  ← App name, icon, settings
├── package.json              ← List of packages the game uses
│
├── screens/                  ← Each screen of the app
│   ├── HomeScreen.jsx        ← Title screen
│   ├── LevelSelectScreen.jsx ← Choose a level
│   ├── GameScreen.jsx        ← The actual game (physics, enemies, etc.)
│   ├── ShopScreen.jsx        ← Buy antibiotics
│   ├── CollectablesScreen.jsx← Library: bacteria cards, hints, MCS reports
│   └── SettingsScreen.jsx    ← Settings and stats
│
├── shared/                   ← Code shared across all levels
│   ├── GameContext.js        ← Saves game state (antibodies, unlocks, etc.)
│   ├── gameData.js           ← All game content: antibiotics, enemies, hints
│   ├── components/           ← Reusable visual pieces
│   │   ├── HealthBar.jsx
│   │   ├── GameHUD.jsx       ← On-screen display during gameplay
│   │   └── renderers.jsx     ← How each entity is drawn on screen
│   └── systems/              ← Game logic
│       ├── physics.js        ← Gravity, jumping, movement
│       ├── collision.js      ← Hit detection
│       └── levelSystems.js   ← Level-specific mechanics (wind, peristalsis, etc.)
│
└── levels/                   ← Design notes for each level
    ├── level-1-skin/
    ├── level-2-respiratory/
    └── ... (through level 6)
```

**File types:**
- `.jsx` — React component files (visual things: screens, buttons, game objects)
- `.js` — JavaScript logic files (game systems, data, context)
- `.json` — Configuration and data files

---

## Part 8 — Common Problems

**"npx expo start" gives an error about node_modules**
Run `npm install` first, then try again.

**The QR code appears but my phone won't load the game**
Make sure your phone and laptop are on the same Wi-Fi. If you're on a network that blocks device-to-device traffic (like a university network), try your phone's hotspot instead.

**"git push" asks for a username and password**
GitHub no longer accepts passwords directly. You need a Personal Access Token:
1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click Generate new token, give it a name, tick the `repo` box, click Generate
3. Copy the token and use it as your password when Git asks

**"I made a mistake and want to undo my last commit"**
Ask Claude Code — tell it exactly what happened and it will help you safely undo it.

**The game crashes on my phone**
Check the terminal where `npx expo start` is running — the error message will be there. Copy it and paste it into Claude Code to get a fix.

---

## Quick Reference Card

| What you want to do | Command |
|---|---|
| Get latest code | `git pull` |
| See what you changed | `git status` |
| Stage all changes | `git add .` |
| Save a checkpoint | `git commit -m "your message"` |
| Upload to GitHub | `git push` |
| Start the game | `npx expo start` |
| Install packages | `npm install` |

---

If anything in this guide doesn't work or doesn't make sense, ask Mick or paste the error into Claude Code and describe what you were trying to do. Welcome to the team!
