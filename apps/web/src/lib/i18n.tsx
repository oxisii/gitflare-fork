import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Dictionary ──────────────────────────────────────────────────────────────────

const en = {
  // App
  "app.name": "GitVex",

  // Navigation / User Menu
  "nav.signIn": "Sign In",
  "nav.signUp": "Sign Up",
  "nav.signOut": "Sign out",
  "nav.dashboard": "Dashboard",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.new": "New",
  "nav.code": "Code",
  "nav.commits": "Commits",
  "nav.issues": "Issues",
  "nav.pullRequests": "Pull Requests",

  // Sign In
  "signIn.title": "Welcome back",
  "signIn.description": "Login to your account to continue.",
  "signIn.email": "Email",
  "signIn.emailPlaceholder": "name@example.com",
  "signIn.password": "Password",
  "signIn.passwordPlaceholder": "At least 8 characters",
  "signIn.login": "Login",
  "signIn.needAccount": "Need an account? Sign Up",
  "signIn.success": "Sign in successful",
  "signIn.invalidEmail": "Invalid email address",
  "signIn.shortPassword": "Password must be at least 8 characters",

  // Sign Up
  "signUp.title": "Create an account",
  "signUp.description": "Sign up to get started with GitVex.",
  "signUp.name": "Name",
  "signUp.namePlaceholder": "Jane Doe",
  "signUp.username": "Username",
  "signUp.usernamePlaceholder": "janedoe",
  "signUp.email": "Email",
  "signUp.emailPlaceholder": "name@example.com",
  "signUp.password": "Password",
  "signUp.passwordPlaceholder": "At least 8 characters",
  "signUp.invalidEmail": "Invalid email address",
  "signUp.shortPassword": "Password must be at least 8 characters",
  "signUp.signUp": "Sign Up",
  "signUp.haveAccount": "Already have an account? Sign In",
  "signUp.success": "Sign up successful",
  "signUp.shortName": "Name must be at least 2 characters",
  "signUp.shortUsername": "Username must be at least 3 characters",

  // Homepage
  "home.title": "GitVex",
  "home.tagline": "Open source, serverless git hosting.",
  "home.description":
    "GitVex is a fully open-source serverless git hosting platform. No VMs, No Containers, Just Durable Objects.",
  "home.getStarted": "Get Started",
  "home.featuresTitle": "Features",
  "home.featureServerless": "Serverless",
  "home.featureServerlessDesc":
    "No servers to manage. GitVex runs on Cloudflare's global network.",
  "home.featureDurable": "Durable Objects",
  "home.featureDurableDesc":
    "Git repositories stored in SQLite via Durable Objects for reliability.",
  "home.featureOpenSource": "Open Source",
  "home.featureOpenSourceDesc":
    "100% open source. Self-host on your own Cloudflare account.",
  "home.featureFast": "Fast",
  "home.featureFastDesc": "Global edge network ensures low latency everywhere.",
  "home.startNow": "Start using GitVex today",
  "home.startNowDesc":
    "Create your account and start hosting repositories in minutes.",
  "home.createAccount": "Create Account",
  "home.footer": "GitVex. Built with Cloudflare Workers & Durable Objects.",
  "home.logo": "GitVex",
  "home.builtWith": "Built With",
  "home.giveStar": "Give a Star",
  "home.github": "GitHub",
  "home.techWorkers":
    "To handle Git smart HTTP protocol requests and hosting the web interface.",
  "home.techDO": "To store and manage Git repository data.",
  "home.techD1":
    "To store user data, repository metadata, issues, and other metadata.",
  "home.techAuth": "For handling authentication and authorization.",
  "home.techTanstack": "As a framework for building the web interface.",

  // Dashboard
  "dashboard.title": "Dashboard",
  "dashboard.welcome": "Welcome, {username}",
  "dashboard.yourRepositories": "Your Repositories",
  "dashboard.newRepo": "New Repository",
  "dashboard.noRepos": "No repositories found",
  "dashboard.noReposDesc": "Create your first repository to get started.",
  "dashboard.createRepo": "Create Repository",

  // New Repository
  "newRepo.title": "Create a new repository",
  "newRepo.owner": "Owner",
  "newRepo.repositoryName": "Repository name",
  "newRepo.repositoryNamePlaceholder": "my-repository",
  "newRepo.description": "Description (optional)",
  "newRepo.descriptionPlaceholder": "A short description of your repository",
  "newRepo.visibility": "Repository visibility",
  "newRepo.public": "Public",
  "newRepo.publicDesc": "Anyone can see this repository",
  "newRepo.private": "Private",
  "newRepo.privateDesc": "Only you can see this repository",
  "newRepo.initialize": "Initialize this repository with a README",
  "newRepo.create": "Create repository",
  "newRepo.creating": "Creating...",
  "newRepo.nameRequired": "Repository name is required",
  "newRepo.nameTooLong": "Repository name must be less than 100 characters",
  "newRepo.nameInvalid":
    "Repository name can only contain letters, numbers, hyphens, underscores, and periods",
  "newRepo.success": "Repository created successfully!",

  // User Settings
  "settings.title": "Settings",
  "settings.personalAccessTokens": "Personal Access Tokens",
  "settings.patComingSoon":
    "Personal Access Tokens are coming soon. They will allow you to authenticate with Git from the command line.",
  "settings.patDescription":
    "Personal Access Tokens allow you to authenticate with Git from the command line. They are also useful for CI/CD pipelines and other automated tools.",
  "settings.createToken": "Create Token",
  "settings.patName": "Token Name",
  "settings.patNamePlaceholder": "My Token",
  "settings.patExpires": "Expires",
  "settings.patLastUsed": "Last Used",
  "settings.patCreated": "Created",
  "settings.patNever": "Never",
  "settings.noTokens": "No tokens found",
  "settings.noTokensDesc": "Create a personal access token to get started.",
  "settings.delete": "Delete",
  "settings.confirmDelete": "Are you sure you want to delete this token?",
  "settings.tokenCreated": "Token created successfully!",
  "settings.tokenDeleted": "Token deleted successfully!",
  "settings.profileTab": "Profile",
  "settings.profileInfo": "Profile Information",
  "settings.name": "Name",
  "settings.username": "Username",
  "settings.email": "Email",
  "settings.usernameFixed": "Username cannot be changed",
  "settings.emailFixed": "Email cannot be changed",
  "settings.saveChanges": "Save Changes",
  "settings.profileUpdated": "Profile updated successfully",
  "settings.profileUpdateFailed": "Failed to update profile",
  "settings.nameMin": "Name must be at least 2 characters",
  "settings.createPatTitle": "Create Personal Access Token",
  "settings.createPatDesc":
    "Give your token a descriptive name to help you identify it later.",
  "settings.patPurpose": "What is this token for?",
  "settings.cancel": "Cancel",
  "settings.generateToken": "Generate Token",
  "settings.generatedToken": "Generated Token",
  "settings.copyNow":
    "Make sure to copy your personal access token now. You won't be able to see it again!",
  "settings.yourTokens": "Your Tokens",
  "settings.unnamedToken": "Unnamed Token",
  "settings.noTokenToCopy": "No token to copy",
  "settings.failedCreatePat": "Failed to create personal access token",
  "settings.failedDeletePat": "Failed to delete personal access token",
  "settings.tokenNameMin": "Token name must be at least 3 characters",
  "settings.tokenNameMax": "Token name must be at most 50 characters",

  // Profile
  "profile.repositories": "Repositories",
  "profile.noRepos": "No repositories found",

  // Repository tabs
  "repo.code": "Code",
  "repo.commits": "Commits",
  "repo.issues": "Issues",
  "repo.pullRequests": "Pull Requests",
  "repo.settings": "Settings",

  // Repository code view
  "repo.cloneRepo": "Clone this repository",
  "repo.cloneDesc": "Use Git to clone this repository to your local machine.",
  "repo.https": "HTTPS",
  "repo.copied": "Repository URL copied to clipboard",
  "repo.emptyRepo": "This repository is empty.",
  "repo.emptyRepoDesc":
    "Get started by pushing an existing repository or creating a new one.",
  "repo.note": "Note",
  "repo.privateRepoDesc":
    "This is a **private repository**. You'll need a Personal Access Token (PAT) to clone and push changes.",
  "repo.publicRepoDesc":
    "To push changes to this repository, you'll need a Personal Access Token (PAT).",
  "repo.createInSettings": "Settings > Personal Access Tokens",
  "repo.createNewRepo": "Create a new repository on the command line",
  "repo.pushExisting": "Push an existing repository from the command line",

  // Commits
  "commits.title": "Commits",
  "commits.commitsOn": "Commits on {date}",
  "commits.committed": "committed",
  "commits.noCommits": "No commits yet",
  "commits.noCommitsDesc": "This repository doesn't have any commits yet.",

  // Issues list
  "issues.title": "Issues",
  "issues.newIssue": "New Issue",
  "issues.noIssues": "No issues found for this repository.",
  "issues.createIssue": "Create Issue",
  "issues.opened": "opened",

  // Issue create / detail
  "issue.createTitle": "Create a new issue",
  "issue.title": "Add a title",
  "issue.titlePlaceholder": "Title",
  "issue.description": "Add a description (optional)",
  "issue.descriptionPlaceholder": "Type your description here...",
  "issue.cancel": "Cancel",
  "issue.create": "Create",
  "issue.titleRequired": "Title is required",
  "issue.titleTooLong": "Title must be less than 200 characters",
  "issue.descTooLong": "Description must be less than 10,000 characters",
  "issue.success": "Issue created successfully!",
  "issue.error": "Error",
  "issue.failedCreate": "Failed to create issue",
  "issue.comments": "Comments ({count})",
  "issue.noComments": "No comments yet. Be the first to comment!",
  "issue.addComment": "Add a comment...",
  "issue.comment": "Comment",
  "issue.close": "Close issue",
  "issue.reopen": "Reopen issue",
  "issue.open": "Open",
  "issue.closed": "Closed",
  "issue.created": "created",
  "issue.commented": "commented",
  "issue.noContent": "No content provided",

  // Pull Requests
  "pulls.todo": "TODO - Maybe I can't even implement this on time.",

  // Repository Settings
  "repoSettings.title": "Repository Settings",
  "repoSettings.pageDescription":
    "Manage your repository settings and visibility",
  "repoSettings.failedUpdate": "Failed to update repository",
  "repoSettings.repoName": "Repository name",
  "repoSettings.nameFixed": "Repository name cannot be changed",
  "repoSettings.description": "Description",
  "repoSettings.descriptionPlaceholder":
    "Add a description for your repository",
  "repoSettings.visibility": "Repository visibility",
  "repoSettings.public": "Public",
  "repoSettings.publicDesc": "Anyone can see this repository",
  "repoSettings.private": "Private",
  "repoSettings.privateDesc": "Only you can see this repository",
  "repoSettings.saveChanges": "Save changes",
  "repoSettings.success": "Repository settings updated successfully!",

  // 404
  "notFound.title": "Page not found",
  "notFound.description": "Lost, this page is. In another system, it may be.",

  // Error
  "error.title": "Error",

  // Blob (file viewer)
  "blob.fileNotFound": "File not found",
  "blob.fileNotFoundDesc": "The requested file could not be found.",
  "blob.raw": "Raw",
  "blob.binaryFile": "Binary file",
  "blob.binaryFileDesc":
    "This file cannot be displayed because it is a binary file.",
  "blob.size": "Size: {size}",

  // Tree (directory viewer)
  "tree.emptyDir": "Empty directory",
  "tree.emptyDirDesc": "This directory doesn't contain any files yet.",

  // Commit detail
  "commit.notFound": "Commit not found",
  "commit.notFoundDesc": "The requested commit could not be found.",
  "commit.parent": "Parent",
  "commit.commit": "Commit",
  "commit.authored": "authored",
  "commit.files": "files",
  "commit.file": "file",
  "commit.changed": "changed",
  "commit.added": "added",
  "commit.modified": "modified",
  "commit.deleted": "deleted",
  "commit.noChanges": "No changes",
  "commit.noChangesDesc": "This commit doesn't contain any file changes.",
  "commit.binaryFile": "Binary file",
  "commit.binaryFileDesc": "Binary files cannot be displayed",
  "commit.loadingDiff": "Loading diff...",

  // Language
  "lang.switch": "中文",
} satisfies Record<string, string>;

const zh: Record<string, string> = {
  "app.name": "GitVex",

  "nav.signIn": "登录",
  "nav.signUp": "注册",
  "nav.signOut": "退出登录",
  "nav.dashboard": "控制台",
  "nav.profile": "个人主页",
  "nav.settings": "设置",
  "nav.new": "新建",
  "nav.code": "代码",
  "nav.commits": "提交记录",
  "nav.issues": "问题",
  "nav.pullRequests": "合并请求",

  "signIn.title": "欢迎回来",
  "signIn.description": "登录您的账户以继续使用。",
  "signIn.email": "邮箱",
  "signIn.emailPlaceholder": "name@example.com",
  "signIn.password": "密码",
  "signIn.passwordPlaceholder": "至少8个字符",
  "signIn.login": "登录",
  "signIn.needAccount": "还没有账户？注册",
  "signIn.success": "登录成功",
  "signIn.invalidEmail": "邮箱格式无效",
  "signIn.shortPassword": "密码至少需要8个字符",

  "signUp.title": "创建账户",
  "signUp.description": "注册以开始使用 GitVex。",
  "signUp.name": "姓名",
  "signUp.namePlaceholder": "张三",
  "signUp.username": "用户名",
  "signUp.usernamePlaceholder": "zhangsan",
  "signUp.email": "邮箱",
  "signUp.emailPlaceholder": "name@example.com",
  "signUp.password": "密码",
  "signUp.passwordPlaceholder": "至少8个字符",
  "signUp.invalidEmail": "邮箱格式无效",
  "signUp.shortPassword": "密码至少需要8个字符",
  "signUp.signUp": "注册",
  "signUp.haveAccount": "已有账户？登录",
  "signUp.success": "注册成功",
  "signUp.shortName": "姓名至少需要2个字符",
  "signUp.shortUsername": "用户名至少需要3个字符",

  "home.title": "GitVex",
  "home.tagline": "开源、无服务器的 Git 托管平台。",
  "home.description":
    "GitVex 是一个完全开源的无服务器 Git 托管平台。无需虚拟机，无需容器，只需 Durable Objects。",
  "home.getStarted": "开始使用",
  "home.featuresTitle": "功能特性",
  "home.featureServerless": "无服务器",
  "home.featureServerlessDesc":
    "无需管理服务器。GitVex 运行在 Cloudflare 的全球网络上。",
  "home.featureDurable": "Durable Objects",
  "home.featureDurableDesc":
    "通过 Durable Objects 将 Git 仓库存储在 SQLite 中，安全可靠。",
  "home.featureOpenSource": "开源",
  "home.featureOpenSourceDesc":
    "100% 开源。在您自己的 Cloudflare 账号上自托管。",
  "home.featureFast": "快速",
  "home.featureFastDesc": "全球边缘网络确保低延迟访问。",
  "home.startNow": "立即开始使用 GitVex",
  "home.startNowDesc": "创建账户，几分钟内即可开始托管仓库。",
  "home.createAccount": "创建账户",
  "home.footer": "GitVex。基于 Cloudflare Workers 与 Durable Objects 构建。",
  "home.logo": "GitVex",
  "home.builtWith": "技术栈",
  "home.giveStar": "去 GitHub 点个 Star",
  "home.github": "GitHub",
  "home.techWorkers": "处理 Git Smart HTTP 协议请求并托管 Web 界面。",
  "home.techDO": "存储和管理 Git 仓库数据。",
  "home.techD1": "存储用户数据、仓库元数据、议题和其他元数据。",
  "home.techAuth": "处理身份认证与授权。",
  "home.techTanstack": "用于构建 Web 界面的框架。",

  "dashboard.title": "控制台",
  "dashboard.welcome": "欢迎, {username}",
  "dashboard.yourRepositories": "我的仓库",
  "dashboard.newRepo": "新建仓库",
  "dashboard.noRepos": "暂无仓库",
  "dashboard.noReposDesc": "创建您的第一个仓库以开始使用。",
  "dashboard.createRepo": "创建仓库",

  "newRepo.title": "创建新仓库",
  "newRepo.owner": "所有者",
  "newRepo.repositoryName": "仓库名称",
  "newRepo.repositoryNamePlaceholder": "my-repository",
  "newRepo.description": "描述（可选）",
  "newRepo.descriptionPlaceholder": "仓库的简短描述",
  "newRepo.visibility": "仓库可见性",
  "newRepo.public": "公开",
  "newRepo.publicDesc": "任何人可见此仓库",
  "newRepo.private": "私有",
  "newRepo.privateDesc": "仅您可查看此仓库",
  "newRepo.initialize": "使用 README 初始化此仓库",
  "newRepo.create": "创建仓库",
  "newRepo.creating": "创建中...",
  "newRepo.nameRequired": "仓库名称为必填项",
  "newRepo.nameTooLong": "仓库名称不能超过100个字符",
  "newRepo.nameInvalid": "仓库名称只能包含字母、数字、连字符、下划线和点号",
  "newRepo.success": "仓库创建成功！",

  "settings.title": "设置",
  "settings.personalAccessTokens": "个人访问令牌",
  "settings.patComingSoon":
    "个人访问令牌即将推出。届时您可以使用它们从命令行进行 Git 认证。",
  "settings.patDescription":
    "个人访问令牌允许您从命令行进行 Git 认证。它们也适用于 CI/CD 流水线和其他自动化工具。",
  "settings.createToken": "创建令牌",
  "settings.patName": "令牌名称",
  "settings.patNamePlaceholder": "我的令牌",
  "settings.patExpires": "过期时间",
  "settings.patLastUsed": "最后使用",
  "settings.patCreated": "创建时间",
  "settings.patNever": "从未使用",
  "settings.noTokens": "暂无令牌",
  "settings.noTokensDesc": "创建个人访问令牌以开始使用。",
  "settings.delete": "删除",
  "settings.confirmDelete": "确定要删除此令牌吗？",
  "settings.tokenCreated": "令牌创建成功！",
  "settings.tokenDeleted": "令牌已删除！",
  "settings.profileTab": "个人资料",
  "settings.profileInfo": "个人资料",
  "settings.name": "姓名",
  "settings.username": "用户名",
  "settings.email": "邮箱",
  "settings.usernameFixed": "用户名不可更改",
  "settings.emailFixed": "邮箱不可更改",
  "settings.saveChanges": "保存更改",
  "settings.profileUpdated": "个人资料已更新",
  "settings.profileUpdateFailed": "更新个人资料失败",
  "settings.nameMin": "姓名至少需要2个字符",
  "settings.createPatTitle": "创建个人访问令牌",
  "settings.createPatDesc": "给令牌起一个便于识别的名称。",
  "settings.patPurpose": "这个令牌用于什么？",
  "settings.cancel": "取消",
  "settings.generateToken": "生成令牌",
  "settings.generatedToken": "已生成的令牌",
  "settings.copyNow": "请立即复制个人访问令牌，之后将无法再次查看！",
  "settings.yourTokens": "我的令牌",
  "settings.unnamedToken": "未命名令牌",
  "settings.noTokenToCopy": "没有可复制的令牌",
  "settings.failedCreatePat": "创建个人访问令牌失败",
  "settings.failedDeletePat": "删除个人访问令牌失败",
  "settings.tokenNameMin": "令牌名称至少需要3个字符",
  "settings.tokenNameMax": "令牌名称不能超过50个字符",

  "profile.repositories": "仓库",
  "profile.noRepos": "暂无仓库",

  "repo.code": "代码",
  "repo.commits": "提交记录",
  "repo.issues": "问题",
  "repo.pullRequests": "合并请求",
  "repo.settings": "设置",

  "repo.cloneRepo": "克隆此仓库",
  "repo.cloneDesc": "使用 Git 将此仓库克隆到本地。",
  "repo.https": "HTTPS",
  "repo.copied": "仓库地址已复制到剪贴板",
  "repo.emptyRepo": "此仓库为空。",
  "repo.emptyRepoDesc": "推送已有仓库或创建新仓库以开始使用。",
  "repo.note": "说明",
  "repo.privateRepoDesc":
    "这是一个**私有仓库**。您需要个人访问令牌（PAT）来克隆和推送更改。",
  "repo.publicRepoDesc": "要推送更改到此仓库，您需要一个个人访问令牌（PAT）。",
  "repo.createInSettings": "设置 > 个人访问令牌",
  "repo.createNewRepo": "在命令行中创建新仓库",
  "repo.pushExisting": "从命令行推送已有仓库",

  "commits.title": "提交记录",
  "commits.commitsOn": "{date} 的提交",
  "commits.committed": "提交于",
  "commits.noCommits": "暂无提交记录",
  "commits.noCommitsDesc": "此仓库暂无任何提交记录。",

  "issues.title": "问题",
  "issues.newIssue": "新建问题",
  "issues.noIssues": "此仓库暂无问题。",
  "issues.createIssue": "创建问题",
  "issues.opened": "创建于",

  "issue.createTitle": "创建新问题",
  "issue.title": "添加标题",
  "issue.titlePlaceholder": "标题",
  "issue.description": "添加描述（可选）",
  "issue.descriptionPlaceholder": "在此输入描述...",
  "issue.cancel": "取消",
  "issue.create": "创建",
  "issue.titleRequired": "标题为必填项",
  "issue.titleTooLong": "标题不能超过200个字符",
  "issue.descTooLong": "描述不能超过10,000个字符",
  "issue.success": "问题创建成功！",
  "issue.error": "错误",
  "issue.failedCreate": "创建问题失败",
  "issue.comments": "评论 ({count})",
  "issue.noComments": "暂无评论。快来第一个评论吧！",
  "issue.addComment": "添加评论...",
  "issue.comment": "评论",
  "issue.close": "关闭问题",
  "issue.reopen": "重新打开",
  "issue.open": "打开",
  "issue.closed": "已关闭",
  "issue.created": "创建于",
  "issue.commented": "评论于",
  "issue.noContent": "无内容",

  "pulls.todo": "TODO - 也许我无法按时实现这个功能。",

  "repoSettings.title": "仓库设置",
  "repoSettings.pageDescription": "管理仓库设置和可见性",
  "repoSettings.failedUpdate": "更新仓库失败",
  "repoSettings.repoName": "仓库名称",
  "repoSettings.nameFixed": "仓库名称不能更改",
  "repoSettings.description": "描述",
  "repoSettings.descriptionPlaceholder": "为仓库添加描述",
  "repoSettings.visibility": "仓库可见性",
  "repoSettings.public": "公开",
  "repoSettings.publicDesc": "任何人可见此仓库",
  "repoSettings.private": "私有",
  "repoSettings.privateDesc": "仅您可查看此仓库",
  "repoSettings.saveChanges": "保存更改",
  "repoSettings.success": "仓库设置更新成功！",

  "notFound.title": "页面未找到",
  "notFound.description": "迷路了，这个页面。可能在另一个系统中。",

  "error.title": "错误",

  // Blob (file viewer)
  "blob.fileNotFound": "文件未找到",
  "blob.fileNotFoundDesc": "请求的文件未找到。",
  "blob.raw": "原始",
  "blob.binaryFile": "二进制文件",
  "blob.binaryFileDesc": "该文件为二进制文件，无法显示。",
  "blob.size": "大小：{size}",

  // Tree (directory viewer)
  "tree.emptyDir": "空目录",
  "tree.emptyDirDesc": "该目录下还没有任何文件。",

  // Commit detail
  "commit.notFound": "提交未找到",
  "commit.notFoundDesc": "请求的提交记录未找到。",
  "commit.parent": "父提交",
  "commit.commit": "提交",
  "commit.authored": "提交于",
  "commit.files": "个文件",
  "commit.file": "个文件",
  "commit.changed": "已变更",
  "commit.added": "已添加",
  "commit.modified": "已修改",
  "commit.deleted": "已删除",
  "commit.noChanges": "无变更",
  "commit.noChangesDesc": "此提交不包含任何文件变更。",
  "commit.binaryFile": "二进制文件",
  "commit.binaryFileDesc": "无法显示二进制文件",
  "commit.loadingDiff": "正在加载差异对比...",

  "lang.switch": "English",
};

// ── Types ───────────────────────────────────────────────────────────────────────

type Dict = Record<string, string>;
type Locale = "en" | "zh";

// ── Context ─────────────────────────────────────────────────────────────────────

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

// ── Provider ────────────────────────────────────────────────────────────────────

const dicts: Record<Locale, Dict> = { en, zh };

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored === "en" || stored === "zh") return stored;
  return navigator.language.startsWith("zh") ? "zh" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t: I18nCtx["t"] = (key, params) => {
    const dict = dicts[locale] ?? en;
    let val = dict[key] ?? (en as Dict)[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return val;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────────────────────

export function useT(): I18nCtx["t"] {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx.t;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within I18nProvider");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

// ── Language Toggle component ───────────────────────────────────────────────────

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const next = locale === "en" ? "zh" : "en";
  return (
    <button
      aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
      className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-background px-2 font-medium text-xs tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground sm:h-9 sm:px-2.5"
      onClick={() => setLocale(next)}
      type="button"
    >
      <span className="sm:hidden">{locale === "en" ? "中" : "EN"}</span>
      <span className="hidden sm:inline">
        {locale === "en" ? "中文" : "English"}
      </span>
    </button>
  );
}
