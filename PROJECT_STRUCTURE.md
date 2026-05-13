# 📁 NEET Predictor - Complete Project Structure

```
neet-predictor/
│
├── 📂 frontend/                        # React/Next.js Frontend
│   ├── 📂 public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── 📂 assets/
│   │       ├── 📂 images/
│   │       ├── 📂 icons/
│   │       └── 📂 videos/
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── AlertBar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   │
│   │   │   ├── 📂 college-predictor/
│   │   │   │   ├── CollegePredictorForm.jsx
│   │   │   │   ├── PredictionResult.jsx
│   │   │   │   ├── CollegeCard.jsx
│   │   │   │   └── FilterOptions.jsx
│   │   │   │
│   │   │   ├── 📂 comparison-tool/
│   │   │   │   ├── ComparisonTable.jsx
│   │   │   │   ├── CollegeSelector.jsx
│   │   │   │   └── ComparisonChart.jsx
│   │   │   │
│   │   │   ├── 📂 cutoff-engine/
│   │   │   │   ├── CutoffSearch.jsx
│   │   │   │   ├── CutoffTable.jsx
│   │   │   │   ├── TrendAnalysis.jsx
│   │   │   │   └── HistoricalData.jsx
│   │   │   │
│   │   │   ├── 📂 mock-tests/
│   │   │   │   ├── TestList.jsx
│   │   │   │   ├── TestEngine.jsx
│   │   │   │   ├── QuestionDisplay.jsx
│   │   │   │   ├── Timer.jsx
│   │   │   │   ├── ResultAnalysis.jsx
│   │   │   │   └── LeaderBoard.jsx
│   │   │   │
│   │   │   ├── 📂 question-bank/
│   │   │   │   ├── QuestionSearch.jsx
│   │   │   │   ├── QuestionFilter.jsx
│   │   │   │   ├── QuestionDetail.jsx
│   │   │   │   ├── OldPapersList.jsx
│   │   │   │   └── MCQList.jsx
│   │   │   │
│   │   │   ├── 📂 forum/
│   │   │   │   ├── DiscussionList.jsx
│   │   │   │   ├── DiscussionThread.jsx
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   ├── AnswerForm.jsx
│   │   │   │   └── ExpertBadge.jsx
│   │   │   │
│   │   │   ├── 📂 news-feed/
│   │   │   │   ├── NewsList.jsx
│   │   │   │   ├── NewsCard.jsx
│   │   │   │   ├── NewsDetail.jsx
│   │   │   │   └── NewsFilter.jsx
│   │   │   │
│   │   │   ├── 📂 alerts/
│   │   │   │   ├── AlertsPanel.jsx
│   │   │   │   ├── AlertCard.jsx
│   │   │   │   ├── CountdownTimer.jsx
│   │   │   │   └── AlertHistory.jsx
│   │   │   │
│   │   │   ├── 📂 documents/
│   │   │   │   ├── DocumentList.jsx
│   │   │   │   ├── DocumentDetail.jsx
│   │   │   │   ├── ChecklistGenerator.jsx
│   │   │   │   └── PDFDownload.jsx
│   │   │   │
│   │   │   ├── 📂 auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── GoogleOAuth.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   │
│   │   │   └── 📂 user-profile/
│   │   │       ├── ProfilePage.jsx
│   │   │       ├── EditProfile.jsx
│   │   │       ├── PreferencesPanel.jsx
│   │   │       └── TestHistory.jsx
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CollegePredictorPage.jsx
│   │   │   ├── ComparisonPage.jsx
│   │   │   ├── CutoffPage.jsx
│   │   │   ├── MockTestsPage.jsx
│   │   │   ├── QuestionBankPage.jsx
│   │   │   ├── OldPapersPage.jsx
│   │   │   ├── MCQTestPage.jsx
│   │   │   ├── ForumPage.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── DocumentsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── AboutPage.jsx
│   │   │
│   │   ├── 📂 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   ├── useNotification.js
│   │   │   ├── useTimer.js
│   │   │   └── useLocalStorage.js
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── api.js              # Axios API client
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── collegeService.js   # College predictor APIs
│   │   │   ├── cutoffService.js    # Cutoff data APIs
│   │   │   ├── testService.js      # Mock test APIs
│   │   │   ├── forumService.js     # Forum APIs
│   │   │   ├── newsService.js      # News APIs
│   │   │   └── alertService.js     # Alerts APIs
│   │   │
│   │   ├── 📂 store/              # Redux state management
│   │   │   ├── store.js
│   │   │   ├── 📂 slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── collegeSlice.js
│   │   │   │   ├── testSlice.js
│   │   │   │   ├── notificationSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── 📂 thunks/
│   │   │       ├── authThunks.js
│   │   │       ├── collegeThunks.js
│   │   │       └── testThunks.js
│   │   │
│   │   ├── 📂 styles/
│   │   │   ├── 📂 css/
│   │   │   │   ├── index.css
│   │   │   │   ├── tailwind.css
│   │   │   │   ├── variables.css
│   │   │   │   └── responsive.css
│   │   │   │
│   │   │   └── 📂 scss/
│   │   │       ├── main.scss
│   │   │       ├── 📂 components/
│   │   │       └── 📂 pages/
│   │   │
│   │   ├── 📂 utils/
│   │   │   ├── formatters.js       # Date, number formatting
│   │   │   ├── validators.js       # Input validation
│   │   │   ├── errorHandler.js     # Error handling
│   │   │   ├── constants.js        # App constants
│   │   │   └── helpers.js          # Helper functions
│   │   │
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── config.js               # App configuration
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── jest.config.js
│
├── 📂 backend/                       # Node.js/Express Backend
│   ├── 📂 src/
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── colleges.routes.js
���   │   │   ├── cutoff.routes.js
│   │   │   ├── tests.routes.js
│   │   │   ├── questions.routes.js
│   │   │   ├── forum.routes.js
│   │   │   ├── news.routes.js
│   │   │   ├── alerts.routes.js
│   │   │   ├── documents.routes.js
│   │   │   └── users.routes.js
│   │   │
│   │   ├── 📂 controllers/
│   │   │   ├── authController.js
│   │   │   ├── collegeController.js
│   │   │   ├── cutoffController.js
│   │   │   ├── testController.js
│   │   │   ├── questionController.js
│   │   │   ├── forumController.js
│   │   │   ├── newsController.js
│   │   │   ├── alertController.js
│   │   │   ├── documentController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── 📂 models/
│   │   │   ├── User.js
│   │   │   ├── College.js
│   │   │   ├── Cutoff.js
│   │   │   ├── MockTest.js
│   │   │   ├── Question.js
│   │   │   ├── TestResult.js
│   │   │   ├── ForumDiscussion.js
│   │   │   ├── News.js
│   │   │   ├── Alert.js
│   │   │   ├── Document.js
│   │   │   ├── OldPaper.js
│   │   │   └── ExpertVerification.js
│   │   │
│   │   ├── 📂 middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── cors.js
│   │   │   └── logging.js
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── authService.js
│   │   │   ├── collegeService.js
│   │   │   ├── cutoffService.js
│   │   │   ├── testService.js
│   │   │   ├── questionService.js
│   │   │   ├── forumService.js
│   │   │   ├── newsService.js
│   │   │   ├── alertService.js
│   │   │   ├── documentService.js
│   │   │   ├── emailService.js
│   │   │   ├── smsService.js
│   │   │   ├── fileUploadService.js
│   │   │   └── externalApiService.js
│   │   │
│   │   ├── 📂 jobs/                # Background jobs (cron)
│   │   │   ├── updateNewsJob.js
│   │   │   ├── sendAlertsJob.js
│   │   │   ├── updateCutoffJob.js
│   │   │   ├── generateReportsJob.js
│   │   │   └── cleanupJob.js
│   │   │
│   │   ├── 📂 config/
│   │   │   ├── database.js         # MongoDB & PostgreSQL config
│   │   │   ├── email.js            # Email configuration
│   │   │   ├── s3.js               # AWS S3 configuration
│   │   │   ├── redis.js            # Redis configuration
│   │   │   ├── external-apis.js    # NTA, RSS feed APIs
│   │   │   └── constants.js
│   │   │
│   │   ├── 📂 utils/
│   │   │   ├── logger.js
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   ├── errorHandler.js
│   │   │   ├── fileHandler.js
│   │   │   └── encryption.js
│   │   │
│   │   ├── 📂 scripts/
│   │   │   ├── seedDatabase.js
│   │   │   ├── migrateData.js
│   │   │   ├── importColleges.js
│   │   │   ├── importOldPapers.js
│   │   │   └── backupDatabase.js
│   │   │
│   │   └── server.js               # Main entry point
│   │
│   ├── 📂 tests/
│   │   ├── 📂 unit/
│   │   ├── 📂 integration/
│   │   └── 📂 e2e/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── jest.config.js
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── 📂 mobile/                       # React Native Mobile App
│   ├── 📂 src/
│   │   ├── 📂 screens/
│   │   ├── 📂 components/
│   │   ├── 📂 navigation/
│   │   ├── 📂 services/
│   │   ├── 📂 store/
│   │   └── App.js
│   │
│   ├── app.json
│   ├── package.json
│   └── eas.json
│
├── 📂 docs/                        # Documentation
│   ├── 📂 api/
│   │   ├── college-predictor-api.md
│   │   ├── cutoff-engine-api.md
│   │   ├── test-engine-api.md
│   │   ├── forum-api.md
│   │   ├── news-api.md
│   │   └── alerts-api.md
│   │
│   ├── 📂 guides/
│   │   ├── setup-guide.md
│   │   ├── deployment-guide.md
│   │   ├── database-guide.md
│   │   └── contributing.md
│   │
│   ├── 📂 architecture/
│   │   ├── system-architecture.md
│   │   ├── data-flow.md
│   │   └── scalability-plan.md
│   │
│   ├── README.md
│   └── CHANGELOG.md
│
├── 📂 infra/                       # Infrastructure & DevOps
│   ├── 📂 kubernetes/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── mongodb-statefulset.yaml
│   │   └── redis-deployment.yaml
│   │
│   ├── 📂 terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── aws-resources.tf
│   │
│   ├── 📂 docker/
│   │   ├── backend.Dockerfile
│   │   ├── frontend.Dockerfile
│   │   └── docker-compose.yml
│   │
│   └── 📂 monitoring/
│       ├── prometheus.yml
│       ├── grafana-dashboards.json
│       └── alerting-rules.yaml
│
├── 📂 .github/
│   ├── 📂 workflows/
│   │   ├── ci-backend.yml
│   │   ├── ci-frontend.yml
│   │   ├── deploy-production.yml
│   │   ├── security-scan.yml
│   │   └── performance-test.yml
│   │
│   └── 📂 ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── documentation.md
│
├── .gitignore
├── .env.example
├── DATABASE_SCHEMA.md
├── PROJECT_STRUCTURE.md
├── README.md
├── ROADMAP.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## Key Directories Explained

### **Frontend (React/Next.js)**
- **Components**: Reusable React components for all features
- **Pages**: Individual page components
- **Services**: API client functions
- **Store**: Redux state management
- **Utils**: Helper functions, validators, formatters

### **Backend (Node.js/Express)**
- **Routes**: API endpoints
- **Controllers**: Business logic
- **Models**: Database schemas
- **Middleware**: Authentication, validation, error handling
- **Services**: Reusable business logic
- **Jobs**: Background jobs and cron tasks

### **Database**
- **MongoDB**: User data, forums, news, alerts
- **PostgreSQL**: Test results, analytics
- **Redis**: Caching, sessions

### **Infrastructure**
- **Docker**: Containerization
- **Kubernetes**: Orchestration
- **Terraform**: Infrastructure as Code

---

## File Naming Conventions

```
✅ GOOD:
- collegeService.js
- auth.middleware.js
- testController.js
- useAuth.js
- formatters.js

❌ AVOID:
- college_service.js
- auth service.js
- testcontroller.js
- use_auth.js
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Next.js 14, Tailwind CSS, Redux |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, PostgreSQL, Redis |
| **Authentication** | JWT, OAuth 2.0 (Google, Facebook) |
| **APIs** | RESTful, GraphQL (optional) |
| **File Storage** | AWS S3 |
| **Email** | SendGrid / Nodemailer |
| **SMS** | Twilio |
| **Deployment** | Docker, Kubernetes, CI/CD (GitHub Actions) |
| **Monitoring** | Prometheus, Grafana, ELK Stack |

---

**Last Updated**: 2026-05-13
