# 📊 NEET Predictor - Complete Database Schema

## Overview
Using **MongoDB** (NoSQL) for flexible data + **PostgreSQL** (SQL) for transactional data.

---

## 1. USERS COLLECTION (MongoDB)

```javascript
db.users.insertOne({
  _id: ObjectId("..."),
  
  // Authentication
  email: "student@gmail.com",
  password: "hashed_password",
  phone: "+91-9876543210",
  oauthId: "google_12345", // For Google/Facebook login
  
  // Profile
  firstName: "Rahul",
  lastName: "Kumar",
  profileImage: "https://s3.amazonaws.com/...",
  bio: "NEET Aspirant 2025",
  neetRank: 4567,
  neetScore: 650,
  category: "General", // General, OBC, SC, ST
  state: "Maharashtra",
  
  // Address
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  },
  
  // Preferences
  preferences: {
    collegePreference: "Government", // Government, Private, Both
    quotaPreference: "All India", // All India, State Quota
    notifications: {
      email: true,
      sms: true,
      push: true
    }
  },
  
  // Account Status
  isEmailVerified: true,
  isPhoneVerified: true,
  accountStatus: "active", // active, suspended, deleted
  role: "student", // student, expert, admin
  
  // Timestamps
  createdAt: ISODate("2026-01-15T10:30:00Z"),
  updatedAt: ISODate("2026-05-13T14:20:00Z"),
  lastLogin: ISODate("2026-05-13T14:20:00Z")
})
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { unique: true })
db.users.createIndex({ neetRank: 1 })
db.users.createIndex({ state: 1 })
db.users.createIndex({ createdAt: -1 })
```

---

## 2. COLLEGES COLLECTION (MongoDB)

```javascript
db.colleges.insertOne({
  _id: ObjectId("..."),
  collegeCode: "AIIMS001",
  
  // Basic Information
  name: "AIIMS Delhi",
  acronym: "AIIMS",
  type: "Government", // Government, Private, Deemed
  affiliation: "Ministry of Health & Family Welfare",
  
  // Location & Contact
  location: {
    city: "Delhi",
    state: "Delhi",
    coordinates: {
      type: "Point",
      coordinates: [77.2099, 28.5921] // [longitude, latitude]
    }
  },
  phone: "+91-11-26588500",
  email: "info@aiims.edu",
  website: "https://www.aiimsdelhi.edu.in",
  
  // Academic Details
  seats: {
    total: 100,
    general: 50,
    obc: 27,
    sc: 15,
    st: 8,
    pwdGeneral: 3,
    pwdObc: 2,
    pwdSc: 1,
    pwdSt: 1
  },
  
  niftRank: 1,
  nilfRank: 1,
  
  // Financial Details
  fees: {
    tuition: {
      general: 1000000, // Annual in INR
      obc: 1000000,
      sc: 0,
      st: 0
    },
    hostel: 50000, // Annual
    meals: 30000, // Annual
    misc: 20000
  },
  
  // Infrastructure
  infrastructure: {
    hospitalBeds: 800,
    classrooms: 25,
    laboratories: 15,
    library: true,
    hostelAccommodation: true,
    sportsComplex: true,
    cafeteria: true
  },
  
  // Placements & Outcomes
  placements: {
    averageSalary: 1200000,
    highestSalary: 2500000,
    placementPercentage: 95,
    topRecruiters: ["Apollo Hospitals", "Fortis", "Max Healthcare"]
  },
  
  // Faculty
  totalFaculty: 120,
  studentToFacultyRatio: "1:0.8",
  
  // Accreditation
  naacGrade: "A++",
  accreditedYear: 2023,
  
  // Status
  isActive: true,
  
  // Timestamps
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-05-13T10:00:00Z")
})
```

**Indexes**:
```javascript
db.colleges.createIndex({ name: 1 })
db.colleges.createIndex({ state: 1 })
db.colleges.createIndex({ type: 1 })
db.colleges.createIndex({ "location.coordinates": "2dsphere" })
db.colleges.createIndex({ niftRank: 1 })
```

---

## 3. CUT-OFF DATA COLLECTION (MongoDB)

```javascript
db.cutoffData.insertOne({
  _id: ObjectId("..."),
  collegeId: ObjectId("..."), // Reference to colleges collection
  
  // Year & Exam Info
  examYear: 2024,
  counselingRound: 1, // Round 1, 2, 3, etc.
  quota: "All India", // All India, State Quota
  
  // Cut-off Scores (All India Quota)
  cutoffRank: {
    general: 450,
    obc: 2100,
    sc: 8500,
    st: 10200,
    generalPwD: 1200,
    obcPwD: 3000,
    scPwD: 9000,
    stPwD: 11000
  },
  
  // Cut-off Scores (State Quota - Example for Maharashtra)
  stateQuotaCutoff: {
    general: 380,
    obc: 1800,
    sc: 7500,
    st: 9000
  },
  
  // Statistical Info
  statistics: {
    totalApplications: 50000,
    totalSeatsAvailable: 100,
    cutoffNormalized: 650, // Out of 720
    cutoffPercentile: 99.5
  },
  
  // Trend Data
  trend: {
    year2023: { general: 520, obc: 2300, sc: 9000 },
    year2022: { general: 480, obc: 2200, sc: 8800 },
    year2021: { general: 510, obc: 2250, sc: 8900 }
  },
  
  // Timestamps
  createdAt: ISODate("2024-06-15T00:00:00Z"),
  updatedAt: ISODate("2026-05-13T10:00:00Z")
})
```

**Indexes**:
```javascript
db.cutoffData.createIndex({ collegeId: 1, examYear: 1, quota: 1 }, { unique: true })
db.cutoffData.createIndex({ examYear: 1 })
db.cutoffData.createIndex({ "cutoffRank.general": 1 })
db.cutoffData.createIndex({ quota: 1 })
```

---

## 4. MOCK TESTS COLLECTION (MongoDB)

```javascript
db.mockTests.insertOne({
  _id: ObjectId("..."),
  
  // Test Info
  title: "Full Length Mock Test 1",
  description: "Complete NEET Mock Test - All topics covered",
  testType: "Full Length", // Full Length, Chapter-wise, Mini
  duration: 180, // minutes
  
  // Test Details
  totalQuestions: 180,
  marks: {
    total: 720,
    correct: 4,
    incorrect: -1,
    blank: 0
  },
  
  // Subject Distribution
  subjects: {
    physics: { questions: 45, marks: 180 },
    chemistry: { questions: 45, marks: 180 },
    biology: { questions: 90, marks: 360 }
  },
  
  // Questions Array
  questions: [
    {
      _id: ObjectId("..."),
      questionNumber: 1,
      subject: "Physics",
      chapter: "Mechanics",
      difficulty: "Medium",
      text: "A ball is thrown vertically upward...",
      image: "https://s3.amazonaws.com/...",
      options: {
        a: "10 m/s",
        b: "20 m/s",
        c: "30 m/s",
        d: "40 m/s"
      },
      correctAnswer: "b",
      explanation: "Using kinematic equations...",
      videoSolution: "https://youtube.com/...",
      tags: ["kinematics", "motion"]
    }
    // ... 180 questions total
  ],
  
  // Test Status
  isPublished: true,
  difficulty: "Hard", // Easy, Medium, Hard
  
  // Metadata
  createdBy: ObjectId("..."), // Admin/Content creator ID
  language: ["English", "Hindi", "Marathi"],
  
  // Timestamps
  createdAt: ISODate("2026-01-10T10:00:00Z"),
  updatedAt: ISODate("2026-05-13T10:00:00Z"),
  publishedAt: ISODate("2026-01-15T00:00:00Z")
})
```

**Indexes**:
```javascript
db.mockTests.createIndex({ title: 1 })
db.mockTests.createIndex({ difficulty: 1 })
db.mockTests.createIndex({ isPublished: 1 })
db.mockTests.createIndex({ createdAt: -1 })
```

---

## 5. TEST RESULTS COLLECTION (PostgreSQL)

```sql
CREATE TABLE test_results (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  test_id BIGINT NOT NULL REFERENCES mock_tests(id),
  
  -- Score Details
  total_marks DECIMAL(5, 2),
  correct_answers INT,
  incorrect_answers INT,
  unanswered INT,
  
  -- Time
  time_taken DECIMAL(5, 2), -- in minutes
  
  -- Percentile
  percentile DECIMAL(5, 2),
  rank INT,
  total_test_takers INT,
  
  -- Answer Details
  answers JSONB, -- Store answer choices as JSON
  time_per_question JSONB, -- Time spent on each question
  
  -- Analysis
  subject_wise_score JSONB, -- { "physics": 120, "chemistry": 110, "biology": 190 }
  weak_areas TEXT[],
  strong_areas TEXT[],
  
  -- Comparison
  avg_marks_all_users DECIMAL(5, 2),
  comparison_percentile DECIMAL(5, 2),
  
  -- Status
  is_completed BOOLEAN DEFAULT false,
  test_status VARCHAR(50), -- submitted, grading, completed
  
  -- Timestamps
  started_at TIMESTAMP,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON test_results(user_id);
CREATE INDEX idx_test_id ON test_results(test_id);
CREATE INDEX idx_created_at ON test_results(created_at);
CREATE INDEX idx_user_test ON test_results(user_id, test_id);
```

---

## 6. FORUM DISCUSSIONS COLLECTION (MongoDB)

```javascript
db.forumDiscussions.insertOne({
  _id: ObjectId("..."),
  
  // Post Info
  title: "How to approach organic chemistry in NEET?",
  content: "I'm struggling with organic chemistry. Can someone suggest effective strategies?",
  author: ObjectId("..."), // Reference to users collection
  
  // Categorization
  category: "Exam Preparation", // College Selection, Exam Prep, Counseling, General
  tags: ["chemistry", "organic", "strategies"],
  
  // Content Media
  images: ["https://s3.amazonaws.com/..."],
  attachments: ["https://s3.amazonaws.com/...pdf"],
  
  // Engagement
  views: 1250,
  upvotes: 45,
  downvotes: 2,
  bookmarks: 120,
  
  // Answers
  answers: [
    {
      _id: ObjectId("..."),
      author: ObjectId("..."),
      content: "Here are some tips...",
      upvotes: 80,
      downvotes: 1,
      isSolution: true,
      isExpertAnswer: true,
      createdAt: ISODate("2026-05-12T14:30:00Z"),
      replies: [
        {
          _id: ObjectId("..."),
          author: ObjectId("..."),
          content: "Thanks! This helped a lot.",
          upvotes: 10,
          createdAt: ISODate("2026-05-12T16:45:00Z")
        }
      ]
    }
  ],
  
  // Status
  isResolved: true,
  isFeatured: false,
  isLocked: false,
  
  // Timestamps
  createdAt: ISODate("2026-05-10T10:00:00Z"),
  updatedAt: ISODate("2026-05-13T09:30:00Z"),
  lastActivityAt: ISODate("2026-05-13T09:30:00Z")
})
```

**Indexes**:
```javascript
db.forumDiscussions.createIndex({ title: "text", content: "text" })
db.forumDiscussions.createIndex({ category: 1 })
db.forumDiscussions.createIndex({ author: 1 })
db.forumDiscussions.createIndex({ createdAt: -1 })
db.forumDiscussions.createIndex({ views: -1 })
db.forumDiscussions.createIndex({ "answers._id": 1 })
```

---

## 7. NOTIFICATIONS COLLECTION (MongoDB)

```javascript
db.notifications.insertOne({
  _id: ObjectId("..."),
  
  // Recipient
  userId: ObjectId("..."),
  
  // Notification Content
  type: "counseling_alert", // alert, forum_reply, test_result, etc.
  title: "Registration for NEET 2025 Counseling Starts Tomorrow!",
  message: "Complete your registration by clicking the link below.",
  image: "https://s3.amazonaws.com/...",
  actionUrl: "/alerts/registration",
  
  // Notification Status
  isRead: false,
  isArchived: false,
  
  // Delivery Channels
  deliveryChannels: {
    inApp: true,
    email: true,
    sms: false,
    push: true
  },
  
  // Related Data
  relatedEntityId: ObjectId("..."), // Could be test, forum post, etc.
  
  // Timestamps
  createdAt: ISODate("2026-05-13T08:00:00Z"),
  readAt: null,
  expiresAt: ISODate("2026-05-20T08:00:00Z")
})
```

**Indexes**:
```javascript
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, isRead: 1 })
db.notifications.createIndex({ type: 1 })
```

---

## 8. NEWS FEEDS COLLECTION (MongoDB)

```javascript
db.newsFeeds.insertOne({
  _id: ObjectId("..."),
  
  // News Content
  title: "NTA Announces NEET 2025 Exam Date - June 2, 2026",
  description: "The National Testing Agency has officially announced the NEET 2025 exam date...",
  content: "Full article content here...",
  image: "https://s3.amazonaws.com/...",
  
  // Metadata
  source: "NTA Official", // NTA, NDTV, Times of India, etc.
  sourceUrl: "https://nta.ac.in/...",
  category: "Official Update", // Official, Coaching, General, Tips
  priority: "High", // High, Medium, Low
  
  // SEO
  slug: "nta-announces-neet-2025-exam-date",
  keywords: ["NEET 2025", "Exam Date", "Registration"],
  
  // Status
  isPublished: true,
  isFeatured: true,
  
  // Engagement
  views: 5000,
  shares: 250,
  comments: 120,
  
  // Timestamps
  publishedAt: ISODate("2026-05-13T08:00:00Z"),
  createdAt: ISODate("2026-05-13T07:45:00Z"),
  updatedAt: ISODate("2026-05-13T10:00:00Z")
})
```

**Indexes**:
```javascript
db.newsFeeds.createIndex({ publishedAt: -1 })
db.newsFeeds.createIndex({ slug: 1 }, { unique: true })
db.newsFeeds.createIndex({ category: 1 })
db.newsFeeds.createIndex({ isFeatured: 1 })
```

---

## 9. COUNSELING ALERTS COLLECTION (MongoDB)

```javascript
db.counselingAlerts.insertOne({
  _id: ObjectId("..."),
  
  // Alert Info
  title: "NEET Counseling Round 1 - Choice Filling Open",
  description: "You can now fill your choices for Round 1",
  alertType: "choice_filling", // registration, choice_filling, result, etc.
  priority: "Critical", // Critical, High, Medium, Low
  
  // Timeline
  startDate: ISODate("2026-06-15T00:00:00Z"),
  endDate: ISODate("2026-06-20T23:59:59Z"),
  countdownDays: 3,
  
  // Target Audience
  targetStates: ["All"], // Specific states or "All"
  targetCategories: ["All"],
  
  // Action
  actionLink: "/alerts/choice-filling",
  actionButtonText: "Start Filling Choices",
  
  // Notification Settings
  sendNotifications: true,
  notificationChannels: ["email", "push", "sms"],
  
  // Status
  isActive: true,
  isBroadcasted: true,
  
  // Timestamps
  createdAt: ISODate("2026-05-10T10:00:00Z"),
  publishedAt: ISODate("2026-05-12T00:00:00Z"),
  expiresAt: ISODate("2026-06-25T00:00:00Z")
})
```

---

## 10. COLLEGE COMPARISON COLLECTION (MongoDB)

```javascript
db.collegeComparisons.insertOne({
  _id: ObjectId("..."),
  
  userId: ObjectId("..."),
  
  colleges: [
    ObjectId("college1"),
    ObjectId("college2")
  ],
  
  comparisonData: {
    basicInfo: {
      name: true,
      type: true,
      location: true,
      website: true
    },
    financial: {
      annualFees: true,
      hostelFees: true,
      totalCostForCourse: true
    },
    infrastructure: {
      hospitalBeds: true,
      laboratories: true,
      library: true
    },
    academics: {
      rank: true,
      faculty: true,
      placements: true
    }
  },
  
  // Timestamps
  createdAt: ISODate("2026-05-13T10:00:00Z"),
  expiresAt: ISODate("2026-06-13T10:00:00Z") // Auto-delete after 30 days
})
```

---

## 11. DOCUMENTS COLLECTION (MongoDB)

```javascript
db.documents.insertOne({
  _id: ObjectId("..."),
  
  // Document Info
  documentType: "domicile_certificate", // domicile, caste, income, etc.
  title: "Domicile Certificate Guide",
  description: "Complete guide for obtaining domicile certificate",
  
  // Content
  content: "Detailed instructions...",
  pdfUrl: "https://s3.amazonaws.com/...",
  imageUrl: "https://s3.amazonaws.com/...",
  
  // State Specific
  applicableStates: ["Maharashtra", "All"],
  
  // Checklist Items
  checklist: [
    {
      item: "Birth certificate copy",
      required: true,
      notes: "Recent certified copy"
    },
    {
      item: "ID proof",
      required: true,
      notes: "Aadhar or PAN card"
    }
  ],
  
  // Status
  isPublished: true,
  version: 2,
  
  // Timestamps
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-05-13T10:00:00Z")
})
```

---

## 12. EXPERT VERIFICATION COLLECTION (MongoDB)

```javascript
db.expertVerification.insertOne({
  _id: ObjectId("..."),
  
  userId: ObjectId("..."),
  
  // Credentials
  qualification: "MBBS, MD General Medicine",
  experience: 8,
  institution: "AIIMS Delhi",
  
  // Expertise Areas
  expertiseAreas: ["College Selection", "Counseling Process", "Medical Entrance Exams"],
  
  // Verification
  isVerified: true,
  verificationDocument: "https://s3.amazonaws.com/...",
  verificationDate: ISODate("2026-03-15T00:00:00Z"),
  
  // Stats
  totalAnswers: 245,
  upvotesReceived: 1200,
  rating: 4.8,
  responseTime: "Average 2 hours",
  
  // Status
  verificationStatus: "approved", // pending, approved, rejected
  
  // Timestamps
  appliedAt: ISODate("2026-02-15T10:00:00Z"),
  approvedAt: ISODate("2026-03-15T10:00:00Z")
})
```

---

## Database Connection Strings

```javascript
// MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/neet-predictor?retryWrites=true&w=majority

// PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/neet_predictor

// Redis (Caching)
REDIS_URL=redis://:password@localhost:6379/0
```

---

## Migration Strategy

1. **Phase 1**: Create all MongoDB collections & indexes
2. **Phase 2**: Create PostgreSQL tables & run migrations
3. **Phase 3**: Set up data replication & caching (Redis)
4. **Phase 4**: Implement backup & disaster recovery

---

**Last Updated**: 2026-05-13
