# 📍 Complete Website Sitemap

## NEET Predictor - 25+ Pages Structure

### 1. PUBLIC PAGES (No Login Required)

#### Home & Landing
- **/** - Homepage (Hero, Features, CTA)
- **/about** - About NEET Predictor
- **/contact** - Contact Us
- **/pricing** - Subscription Plans

#### Core Tools (Public)
- **/college-predictor** - Interactive College Predictor Tool
- **/college-predictor/results** - Predictor Results
- **/college-comparison** - College Comparison Tool
- **/college/:id** - Individual College Details Page
- **/cutoff-data** - State-wise Cut-off Database
- **/cutoff-data/:state** - State-specific Cut-offs
- **/cutoff-data/:state/:category** - Category-wise Cut-offs

#### News & Alerts
- **/news** - NEET News Feed
- **/alerts** - Real-time Counseling Alerts
- **/alerts/:alertId** - Individual Alert Details
- **/exam-schedule** - NEET Exam Schedule & Countdown

#### Information
- **/documents** - Required Documents Guide
- **/documents/:documentType** - Specific Document Guides
- **/faq** - Frequently Asked Questions
- **/blog** - Blog Articles
- **/blog/:slug** - Individual Blog Post

#### Authentication
- **/signup** - User Registration
- **/login** - User Login
- **/forgot-password** - Password Recovery
- **/verify-email** - Email Verification

#### Legal
- **/privacy-policy** - Privacy Policy
- **/terms-of-service** - Terms of Service
- **/disclaimer** - Disclaimer

---

### 2. USER AUTHENTICATED PAGES (Login Required)

#### Dashboard
- **/dashboard** - Main Dashboard
- **/dashboard/profile** - User Profile
- **/dashboard/edit-profile** - Edit Profile
- **/dashboard/settings** - Account Settings
- **/dashboard/notifications** - Notification Center
- **/dashboard/saved-colleges** - Saved Colleges
- **/dashboard/saved-comparisons** - Saved Comparisons

#### Mock Tests
- **/mock-tests** - Mock Test Library
- **/mock-tests/:testId** - Start Mock Test
- **/mock-tests/:testId/questions/:questionId** - Individual Question
- **/mock-tests/:testId/results** - Test Results & Analytics
- **/mock-tests/:testId/review** - Review Answers
- **/mock-tests/history** - Test Attempt History
- **/mock-tests/performance** - Performance Analytics

#### Question Bank
- **/question-bank** - Question Bank Home
- **/question-bank/search** - Search Questions
- **/question-bank/:subject** - Subject-wise Questions
- **/question-bank/:subject/:chapter** - Chapter-wise Questions
- **/question-bank/year/:year** - Year-wise Questions
- **/question-bank/question/:id** - Individual Question with Solution

#### Forum & Community
- **/forum** - Forum Homepage
- **/forum/discussions** - All Discussions
- **/forum/discussions/new** - Create New Discussion
- **/forum/discussions/:id** - View Discussion Thread
- **/forum/my-discussions** - My Discussions
- **/forum/my-answers** - My Answers
- **/forum/bookmarks** - Bookmarked Discussions
- **/forum/expert-answers** - Expert Q&A Section

#### Learning
- **/video-lectures** - Video Lecture Series
- **/video-lectures/:topic** - Videos by Topic
- **/video-lectures/watch/:videoId** - Watch Video
- **/video-lectures/my-playlist** - My Playlists
- **/study-materials** - Downloadable Study Materials

#### Counseling Tools
- **/counseling-checklist** - Counseling Preparation Checklist
- **/counseling-timeline** - Counseling Timeline
- **/counseling-process** - How Counseling Works
- **/document-checklist** - Document Checklist Generator
- **/document-checklist/download-pdf** - Download PDF Checklist

#### Analytics & Progress
- **/analytics** - Personal Analytics Dashboard
- **/analytics/test-performance** - Test Performance Metrics
- **/analytics/weak-areas** - Weak Areas Analysis
- **/analytics/progress** - Progress Timeline

---

### 3. ADMIN PAGES (Admin Only)

#### Admin Dashboard
- **/admin** - Admin Dashboard
- **/admin/analytics** - Platform Analytics
- **/admin/users** - User Management
- **/admin/users/:userId** - User Details
- **/admin/colleges** - College Management
- **/admin/colleges/add** - Add College
- **/admin/colleges/:collegeId/edit** - Edit College

#### Content Management
- **/admin/news** - Manage News Feeds
- **/admin/news/add** - Add News Article
- **/admin/alerts** - Manage Counseling Alerts
- **/admin/alerts/add** - Create Alert
- **/admin/mock-tests** - Manage Mock Tests
- **/admin/mock-tests/add** - Create Mock Test
- **/admin/questions** - Manage Questions
- **/admin/documents** - Manage Documents

#### Cutoff Data Management
- **/admin/cutoff-data** - Manage Cut-off Data
- **/admin/cutoff-data/import** - Import Cut-off Data
- **/admin/cutoff-data/edit/:collegeId/:year** - Edit Cut-off

#### Forum Moderation
- **/admin/forum** - Forum Management
- **/admin/forum/discussions** - Moderate Discussions
- **/admin/forum/discussions/:id** - Discussion Details
- **/admin/forum/reported-content** - Reported Content
- **/admin/forum/expert-verification** - Expert Verification

#### Expert Management
- **/admin/experts** - Expert List
- **/admin/experts/:expertId** - Expert Profile
- **/admin/experts/verify** - Verification Queue

#### Reports & Analytics
- **/admin/reports** - Reports & Analytics
- **/admin/reports/traffic** - Traffic Analytics
- **/admin/reports/engagement** - User Engagement
- **/admin/reports/performance** - System Performance

#### Settings
- **/admin/settings** - Platform Settings
- **/admin/settings/general** - General Settings
- **/admin/settings/seo** - SEO Settings
- **/admin/settings/notifications** - Notification Settings
- **/admin/settings/integrations** - API Integrations

---

### 4. API ENDPOINTS (Backend Routes)

#### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete account
- `GET /api/users/:id/preferences` - Get preferences
- `PUT /api/users/:id/preferences` - Update preferences

#### Colleges
- `GET /api/colleges` - List all colleges
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/search` - Search colleges
- `POST /api/colleges/:id/save` - Save college
- `DELETE /api/colleges/:id/save` - Remove saved college
- `GET /api/colleges/:id/reviews` - Get college reviews

#### College Predictor
- `POST /api/predictor/predict` - Predict colleges based on rank
- `GET /api/predictor/results/:resultId` - Get prediction results

#### Cut-off Data
- `GET /api/cutoff` - Get cut-off data
- `GET /api/cutoff/:state` - State-wise cut-offs
- `GET /api/cutoff/:state/:category` - Category-wise cut-offs
- `POST /api/cutoff/import` - Admin: Import cut-off data

#### Mock Tests
- `GET /api/mock-tests` - List mock tests
- `GET /api/mock-tests/:id` - Get test details
- `POST /api/mock-tests/:id/start` - Start a test
- `POST /api/mock-tests/:id/submit` - Submit test answers
- `GET /api/mock-tests/:id/results/:resultId` - Get test results
- `GET /api/mock-tests/history/:userId` - Test history

#### Questions
- `GET /api/questions` - List questions
- `GET /api/questions/:id` - Get question details
- `GET /api/questions/search` - Search questions
- `POST /api/questions/:id/report` - Report question

#### Forum
- `GET /api/forum/discussions` - List discussions
- `POST /api/forum/discussions` - Create discussion
- `GET /api/forum/discussions/:id` - Get discussion details
- `PUT /api/forum/discussions/:id` - Edit discussion
- `DELETE /api/forum/discussions/:id` - Delete discussion
- `POST /api/forum/discussions/:id/answer` - Post answer
- `POST /api/forum/discussions/:id/upvote` - Upvote discussion
- `POST /api/forum/discussions/:discussionId/answers/:answerId/upvote` - Upvote answer

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/alerts` - Get counseling alerts

#### News
- `GET /api/news` - Get news feed
- `GET /api/news/:id` - Get news article
- `POST /api/news` - Admin: Create news

#### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:type` - Get specific document guide
- `POST /api/documents/:id/download-pdf` - Download PDF

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/test-performance` - Test performance data
- `GET /api/analytics/weak-areas` - Weak areas analysis

---

### 5. STATIC PAGES (Not Logged In)
- **/404** - 404 Page
- **/500** - 500 Error Page
- **/maintenance** - Maintenance Page

---

## Page Count Summary

- **Public Pages**: 20+
- **User Pages**: 30+
- **Admin Pages**: 25+
- **API Endpoints**: 60+
- **Total Frontend Pages**: 75+

---

**Last Updated**: 2026-05-13
