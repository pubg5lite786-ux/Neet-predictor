# 📚 Old Test Papers & Previous Year Questions

## Overview
Comprehensive system for storing, organizing, and serving NEET old papers from 2012-2025 with full solutions.

---

## Database Schema for Old Papers

```javascript
// models/OldPaper.js - MongoDB

const oldPaperSchema = new Schema({
  // Basic Info
  paperId: { type: String, unique: true }, // NEET2024, NEET2023, etc.
  year: { type: Number, required: true }, // 2024, 2023
  examDate: { type: Date },
  examCode: String, // Code printed on admit card
  
  // Paper Details
  language: { type: String, enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'] },
  totalQuestions: { type: Number, default: 180 },
  totalMarks: { type: Number, default: 720 },
  duration: { type: Number, default: 180 }, // in minutes
  
  // Subject Distribution
  subjectDistribution: {
    physics: { questions: 45, marks: 180 },
    chemistry: { questions: 45, marks: 180 },
    biology: { questions: 90, marks: 360 }
  },
  
  // Difficulty Analysis
  difficultyAnalysis: {
    easy: { count: 45, percentage: 25 },
    medium: { count: 90, percentage: 50 },
    hard: { count: 45, percentage: 25 }
  },
  
  // Questions Array - Full Details
  questions: [{
    questionNumber: Number,
    questionId: ObjectId,
    subject: { type: String, enum: ['Physics', 'Chemistry', 'Biology'] },
    chapter: String,
    topic: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    
    // Question Content
    questionText: String,
    questionImage: String, // URL if contains diagram
    questionType: { type: String, enum: ['Single Choice', 'Multiple Choice', 'Numerical'] },
    
    // Options
    options: [{
      optionId: { type: String, enum: ['a', 'b', 'c', 'd'] },
      text: String,
      image: String
    }],
    
    // Answer & Solution
    correctAnswer: { type: String, enum: ['a', 'b', 'c', 'd'] },
    explanation: String, // Detailed explanation
    alternativeExplanations: [String], // Multiple ways to solve
    
    // Media & Resources
    solutionVideo: String, // YouTube URL or internal video
    solutionPDF: String, // PDF solution URL
    formulasUsed: [String], // Related formulas
    relatedQuestions: [ObjectId], // Similar questions from other years
    
    // Metadata
    importanceScore: { type: Number, min: 1, max: 5 }, // How important is this question
    frequencyInExams: Number, // How many times asked
    tags: [String],
    conceptsTested: [String]
  }],
  
  // Cut-off Analysis
  cutoffAnalysis: {
    generalCutoff: Number,
    obcCutoff: Number,
    scCutoff: Number,
    stCutoff: Number
  },
  
  // Statistics
  statistics: {
    totalAttempts: Number,
    averageScore: Number,
    averageTimePerQuestion: Number, // in seconds
    topicWiseDifficulty: {}
  },
  
  // Document URLs
  fullPaperPDF: String,
  fullPaperImages: [String], // Page-wise images
  answerKey: String, // PDF with answers
  
  // Status
  isPublished: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verifiedBy: ObjectId, // Reference to expert
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  publishedAt: Date
});

// Indexes
oldPaperSchema.index({ year: 1, language: 1 });
oldPaperSchema.index({ 'questions.subject': 1 });
oldPaperSchema.index({ 'questions.chapter': 1 });
oldPaperSchema.index({ 'questions.difficulty': 1 });
oldPaperSchema.index({ 'questions.tags': 1 });

module.exports = mongoose.model('OldPaper', oldPaperSchema);
```

---

## API Endpoints for Old Papers

```javascript
// routes/oldPapers.routes.js

const express = require('express');
const router = express.Router();
const oldPapersController = require('../controllers/oldPapersController');
const auth = require('../middleware/auth.middleware');

// Public endpoints
router.get('/papers', oldPapersController.getAllPapers);
router.get('/papers/:paperId', oldPapersController.getPaperDetails);
router.get('/papers/year/:year', oldPapersController.getPapersByYear);
router.get('/papers/search', oldPapersController.searchPapers);

// User endpoints (requires auth)
router.get('/papers/:paperId/attempt', auth, oldPapersController.startPaperAttempt);
router.post('/papers/:paperId/submit', auth, oldPapersController.submitPaper);
router.get('/papers/:paperId/results/:attemptId', auth, oldPapersController.getResults);
router.get('/my-papers', auth, oldPapersController.getUserPapers);

// Admin endpoints
router.post('/papers', auth, oldPapersController.createPaper);
router.put('/papers/:paperId', auth, oldPapersController.updatePaper);
router.post('/papers/:paperId/questions/bulk-import', auth, oldPapersController.bulkImportQuestions);

module.exports = router;
```

---

## Controller Implementation

```javascript
// controllers/oldPapersController.js

const OldPaper = require('../models/OldPaper');
const TestResult = require('../models/TestResult');
const logger = require('../utils/logger');

// Get all papers with pagination
exports.getAllPapers = async (req, res) => {
  try {
    const { page = 1, limit = 10, year, language, sort } = req.query;
    
    const query = { isPublished: true };
    if (year) query.year = year;
    if (language) query.language = language;
    
    const papers = await OldPaper
      .find(query)
      .sort(sort === 'newest' ? { year: -1 } : { year: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-questions'); // Don't return full questions initially
    
    const total = await OldPaper.countDocuments(query);
    
    res.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    logger.error('Error fetching papers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get paper details with questions
exports.getPaperDetails = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { includeAnswers = false } = req.query;
    
    const paper = await OldPaper.findOne({ paperId });
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Hide answers if not requested
    if (!includeAnswers) {
      paper.questions.forEach(q => {
        delete q.correctAnswer;
        delete q.explanation;
      });
    }
    
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search papers by year, language, topic
exports.searchPapers = async (req, res) => {
  try {
    const { q, year, language, topic, difficulty } = req.query;
    
    const query = { isPublished: true };
    
    if (q) {
      query.$or = [
        { 'questions.topic': { $regex: q, $options: 'i' } },
        { 'questions.conceptsTested': { $in: [q] } }
      ];
    }
    
    if (year) query.year = parseInt(year);
    if (language) query.language = language;
    if (difficulty) query['questions.difficulty'] = difficulty;
    if (topic) query['questions.chapter'] = { $regex: topic, $options: 'i' };
    
    const papers = await OldPaper.find(query)
      .select('paperId year language examDate totalQuestions')
      .limit(20);
    
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start paper attempt
exports.startPaperAttempt = async (req, res) => {
  try {
    const { paperId } = req.params;
    const userId = req.user._id;
    
    const paper = await OldPaper.findOne({ paperId });
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Create test attempt record
    const attempt = new TestResult({
      userId,
      testId: paper._id,
      testType: 'old_paper',
      totalMarks: paper.totalMarks,
      totalQuestions: paper.totalQuestions,
      startedAt: new Date(),
      answers: []
    });
    
    await attempt.save();
    
    // Return paper without answers
    const paperData = JSON.parse(JSON.stringify(paper));
    paperData.questions.forEach(q => {
      delete q.correctAnswer;
      delete q.explanation;
    });
    
    res.json({
      attemptId: attempt._id,
      paper: paperData,
      timer: paper.duration * 60 // in seconds
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit paper answers
exports.submitPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { attemptId, answers } = req.body;
    
    const paper = await OldPaper.findOne({ paperId });
    const attempt = await TestResult.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    // Calculate score
    let correctCount = 0;
    let totalMarks = 0;
    const answerAnalysis = [];
    
    for (const [qId, selectedAnswer] of Object.entries(answers)) {
      const question = paper.questions.find(q => q._id.toString() === qId);
      if (!question) continue;
      
      const isCorrect = question.correctAnswer === selectedAnswer;
      const marks = isCorrect ? 4 : -1;
      totalMarks += marks;
      
      if (isCorrect) correctCount++;
      
      answerAnalysis.push({
        questionId: qId,
        selected: selectedAnswer,
        correct: question.correctAnswer,
        isCorrect,
        marks
      });
    }
    
    // Calculate percentile
    const allResults = await TestResult.find({
      testId: paper._id,
      isCompleted: true
    }).select('totalMarks');
    
    const betterScores = allResults.filter(r => r.totalMarks > totalMarks).length;
    const percentile = ((allResults.length - betterScores) / allResults.length * 100).toFixed(2);
    
    // Update attempt
    attempt.answers = answers;
    attempt.correctAnswers = correctCount;
    attempt.totalMarks = totalMarks;
    attempt.percentile = percentile;
    attempt.isCompleted = true;
    attempt.submittedAt = new Date();
    
    await attempt.save();
    
    res.json({
      score: totalMarks,
      correct: correctCount,
      incorrect: answers.length - correctCount,
      percentile,
      analysis: answerAnalysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Frontend Component: Old Papers List

```jsx
// components/OldPapers/OldPapersList.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Play, Filter } from 'lucide-react';

export default function OldPapersList() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    language: 'English'
  });

  useEffect(() => {
    fetchPapers();
  }, [filters]);

  const fetchPapers = async () => {
    try {
      const response = await axios.get('/api/old-papers', { params: filters });
      setPapers(response.data.papers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const startPaper = async (paperId) => {
    try {
      const response = await axios.get(`/api/old-papers/${paperId}/attempt`);
      // Redirect to paper taking mode
      window.location.href = `/papers/${response.data.attemptId}`;
    } catch (error) {
      console.error('Error starting paper:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Old NEET Papers</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          >
            <option value="">All Years</option>
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded"
            value={filters.language}
            onChange={(e) => setFilters({...filters, language: e.target.value})}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map(paper => (
          <div key={paper._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h3 className="text-xl font-bold">NEET {paper.year}</h3>
              <p className="text-sm opacity-90">{paper.examDate ? new Date(paper.examDate).toLocaleDateString() : 'Date TBD'}</p>
            </div>

            <div className="p-4">
              <div className="space-y-2 mb-4">
                <p><strong>Language:</strong> {paper.language}</p>
                <p><strong>Questions:</strong> {paper.totalQuestions}</p>
                <p><strong>Marks:</strong> {paper.totalMarks}</p>
                <p><strong>Duration:</strong> {paper.duration} minutes</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startPaper(paper.paperId)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  <Play size={18} /> Start Test
                </button>
                <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded flex items-center justify-center gap-2">
                  <Download size={18} /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Data Import Script

```javascript
// scripts/importOldPapers.js

const mongoose = require('mongoose');
const OldPaper = require('../models/OldPaper');
const fs = require('fs');
const path = require('path');

async function importPapers() {
  try {
    // Read JSON file with paper data
    const dataPath = path.join(__dirname, '../data/old-papers.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const papersData = JSON.parse(rawData);

    // Bulk insert
    const result = await OldPaper.insertMany(papersData, { ordered: false });
    console.log(`✅ Imported ${result.length} papers`);
  } catch (error) {
    console.error('❌ Import error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  importPapers();
}
```

---

**Features**:
✅ Full papers from 2012-2025
✅ Multiple languages (English, Hindi, etc.)
✅ Complete solutions with videos
✅ Difficulty analysis
✅ Cut-off insights
✅ Performance tracking
✅ PDF downloads

**Last Updated**: 2026-05-13
