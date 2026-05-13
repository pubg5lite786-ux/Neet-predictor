# 🧠 MCQ Test Engine & Question Bank

## Overview
Interactive MCQ (Multiple Choice Questions) test engine with chapter-wise, subject-wise, and mixed difficulty tests.

---

## Database Schema for MCQ Tests

```javascript
// models/MCQTest.js

const mcqTestSchema = new Schema({
  // Test Identity
  testId: { type: String, unique: true }, // MCQ_001, MCQ_002
  testName: String,
  description: String,
  testType: { // Type of MCQ test
    type: String,
    enum: ['Chapter-wise', 'Subject-wise', 'Topic-wise', 'Mixed', 'Daily'],
    default: 'Topic-wise'
  },
  
  // Test Configuration
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, default: function() { return this.totalQuestions * 4 } },
  questionsPerPage: { type: Number, default: 1 }, // 1 question per page
  duration: { type: Number }, // in minutes (null = unlimited time)
  shuffle: { type: Boolean, default: true }, // Randomize questions
  shuffleOptions: { type: Boolean, default: true }, // Randomize options
  
  // Subject & Topic Coverage
  subjects: [{
    subject: { type: String, enum: ['Physics', 'Chemistry', 'Biology'] },
    chapters: [String],
    noOfQuestions: Number
  }],
  
  // Difficulty Configuration
  difficultyDistribution: {
    easy: { type: Number, default: 0 }, // percentage
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  
  // Questions Reference
  questions: [{
    questionId: ObjectId, // Reference to Question model
    order: Number,
    marks: { type: Number, default: 4 }
  }],
  
  // Test Settings
  allowReview: { type: Boolean, default: true }, // Review questions before submit
  allowMarkForReview: { type: Boolean, default: true },
  showAnswersAfterSubmit: { type: Boolean, default: true },
  showExplanationAfterSubmit: { type: Boolean, default: true },
  negativeMarking: { type: Number, default: 1 }, // -1 for wrong answer
  
  // Difficulty Level (1-5)
  overallDifficulty: { type: Number, min: 1, max: 5 },
  
  // Status & Publication
  isPublished: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  
  // Analytics
  stats: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averagePercentile: { type: Number, default: 0 },
    averageTimePerQuestion: { type: Number, default: 0 }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  publishedAt: Date
});

// Indexes
mcqTestSchema.index({ testType: 1, isPublished: 1 });
mcqTestSchema.index({ 'subjects.subject': 1 });
mcqTestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MCQTest', mcqTestSchema);
```

---

## API Endpoints

```javascript
// routes/mcqTests.routes.js

const express = require('express');
const router = express.Router();
const mcqTestController = require('../controllers/mcqTestController');
const auth = require('../middleware/auth.middleware');

// Public - List tests
router.get('/mcq-tests', mcqTestController.getAllTests);
router.get('/mcq-tests/filters', mcqTestController.getTestFilters);
router.get('/mcq-tests/:testId', mcqTestController.getTestDetails);

// User - Take test
router.post('/mcq-tests/:testId/start', auth, mcqTestController.startTest);
router.post('/mcq-tests/:testId/save-answer', auth, mcqTestController.saveAnswer);
router.post('/mcq-tests/:testId/submit', auth, mcqTestController.submitTest);
router.get('/mcq-tests/:testId/results/:attemptId', auth, mcqTestController.getResults);
router.get('/mcq-tests/:testId/review/:attemptId', auth, mcqTestController.reviewTest);

// User - Performance
router.get('/my-mcq-tests', auth, mcqTestController.getUserTests);
router.get('/mcq-performance', auth, mcqTestController.getPerformanceStats);

// Admin
router.post('/mcq-tests', auth, mcqTestController.createTest);
router.put('/mcq-tests/:testId', auth, mcqTestController.updateTest);
router.post('/mcq-tests/:testId/add-questions', auth, mcqTestController.addQuestionsToTest);

module.exports = router;
```

---

## Controller Implementation

```javascript
// controllers/mcqTestController.js

const MCQTest = require('../models/MCQTest');
const MCQResult = require('../models/MCQResult');
const Question = require('../models/Question');
const logger = require('../utils/logger');

// Get all MCQ tests with filters
exports.getAllTests = async (req, res) => {
  try {
    const { page = 1, limit = 12, testType, subject, difficulty } = req.query;
    
    const query = { isPublished: true, isActive: true };
    
    if (testType) query.testType = testType;
    if (subject) query['subjects.subject'] = subject;
    if (difficulty) query.overallDifficulty = parseInt(difficulty);
    
    const tests = await MCQTest
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-questions'); // Don't return full questions list
    
    const total = await MCQTest.countDocuments(query);
    
    res.json({
      tests: tests.map(test => ({
        _id: test._id,
        testId: test.testId,
        testName: test.testName,
        description: test.description,
        testType: test.testType,
        totalQuestions: test.totalQuestions,
        duration: test.duration,
        difficulty: test.overallDifficulty,
        subjects: test.subjects.map(s => s.subject),
        stats: test.stats
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    logger.error('Error fetching MCQ tests:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get available filters
exports.getTestFilters = async (req, res) => {
  try {
    const testTypes = await MCQTest.distinct('testType');
    const subjects = await MCQTest.distinct('subjects.subject');
    const difficulties = [1, 2, 3, 4, 5];
    
    res.json({
      testTypes,
      subjects,
      difficulties
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get test details
exports.getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;
    
    const test = await MCQTest.findOne({ testId })
      .populate('questions.questionId', 'questionText subject chapter difficulty');
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start MCQ test
exports.startTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user._id;
    
    const test = await MCQTest.findOne({ testId })
      .populate('questions.questionId');
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    // Create test attempt
    const attempt = new MCQResult({
      userId,
      testId: test._id,
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
      startedAt: new Date(),
      answers: {}, // { questionId: 'selectedOption' }
      markedForReview: []
    });
    
    await attempt.save();
    
    // Prepare questions (hide answers)
    const questionsForTest = test.questions.map(q => {
      const qData = q.questionId.toObject();
      delete qData.correctAnswer;
      delete qData.explanation;
      return qData;
    });
    
    // Shuffle if enabled
    if (test.shuffle) {
      for (let i = questionsForTest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionsForTest[i], questionsForTest[j]] = [questionsForTest[j], questionsForTest[i]];
      }
    }
    
    res.json({
      attemptId: attempt._id,
      testName: test.testName,
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
      duration: test.duration ? test.duration * 60 : null, // Convert to seconds
      questions: questionsForTest,
      settings: {
        allowReview: test.allowReview,
        allowMarkForReview: test.allowMarkForReview,
        questionsPerPage: test.questionsPerPage
      }
    });
  } catch (error) {
    logger.error('Error starting test:', error);
    res.status(500).json({ error: error.message });
  }
};

// Save answer (real-time)
exports.saveAnswer = async (req, res) => {
  try {
    const { testId } = req.params;
    const { attemptId, questionId, answer, timeSpent } = req.body;
    
    const attempt = await MCQResult.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    // Save answer
    attempt.answers[questionId] = answer;
    attempt.timingPerQuestion = attempt.timingPerQuestion || {};
    attempt.timingPerQuestion[questionId] = timeSpent;
    
    await attempt.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit MCQ test
exports.submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { attemptId } = req.body;
    
    const test = await MCQTest.findOne({ testId }).populate('questions.questionId');
    const attempt = await MCQResult.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    const detailedResults = [];
    
    for (const q of test.questions) {
      const selectedAnswer = attempt.answers[q.questionId._id];
      const isCorrect = selectedAnswer && selectedAnswer === q.questionId.correctAnswer;
      
      if (!selectedAnswer) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        totalMarks += 4;
      } else {
        wrongCount++;
        totalMarks -= 1; // Negative marking
      }
      
      detailedResults.push({
        questionId: q.questionId._id,
        subject: q.questionId.subject,
        chapter: q.questionId.chapter,
        selected: selectedAnswer,
        correct: q.questionId.correctAnswer,
        isCorrect,
        timeSpent: attempt.timingPerQuestion?.[q.questionId._id] || 0
      });
    }
    
    // Calculate percentile
    const allResults = await MCQResult.find({
      testId: test._id,
      isCompleted: true
    }).select('totalMarks');
    
    const betterScores = allResults.filter(r => r.totalMarks > totalMarks).length;
    const percentile = ((allResults.length - betterScores) / allResults.length * 100).toFixed(2);
    
    // Update attempt
    attempt.correctAnswers = correctCount;
    attempt.wrongAnswers = wrongCount;
    attempt.unanswered = unansweredCount;
    attempt.totalMarks = totalMarks;
    attempt.percentile = percentile;
    attempt.isCompleted = true;
    attempt.submittedAt = new Date();
    
    await attempt.save();
    
    // Analyze weak areas
    const subjectWiseScores = {};
    detailedResults.forEach(result => {
      if (!subjectWiseScores[result.subject]) {
        subjectWiseScores[result.subject] = { correct: 0, total: 0 };
      }
      subjectWiseScores[result.subject].total++;
      if (result.isCorrect) subjectWiseScores[result.subject].correct++;
    });
    
    res.json({
      score: totalMarks,
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      percentile,
      accuracy: ((correctCount / test.totalQuestions) * 100).toFixed(2),
      subjectWiseScores,
      detailedResults
    });
  } catch (error) {
    logger.error('Error submitting test:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get test results
exports.getResults = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;
    
    const attempt = await MCQResult.findById(attemptId);
    
    if (!attempt || attempt.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json({
      testName: attempt.testName,
      score: attempt.totalMarks,
      correct: attempt.correctAnswers,
      wrong: attempt.wrongAnswers,
      unanswered: attempt.unanswered,
      percentile: attempt.percentile,
      timeTaken: Math.floor((attempt.submittedAt - attempt.startedAt) / 1000),
      submittedAt: attempt.submittedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Review test
exports.reviewTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;
    
    const attempt = await MCQResult.findById(attemptId)
      .populate('testId', 'testName totalMarks showAnswersAfterSubmit')
      .populate('answers');
    
    if (!attempt || attempt.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's MCQ test history
exports.getUserTests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    
    const attempts = await MCQResult
      .find({ userId })
      .populate('testId', 'testName testType')
      .sort({ startedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await MCQResult.countDocuments({ userId });
    
    res.json({
      attempts,
      pagination: { total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get performance statistics
exports.getPerformanceStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const attempts = await MCQResult
      .find({ userId, isCompleted: true })
      .populate('testId', 'testType subjects');
    
    // Calculate statistics
    const stats = {
      totalTests: attempts.length,
      averageScore: (attempts.reduce((sum, a) => sum + a.totalMarks, 0) / attempts.length).toFixed(2),
      averagePercentile: (attempts.reduce((sum, a) => sum + parseFloat(a.percentile), 0) / attempts.length).toFixed(2),
      totalCorrect: attempts.reduce((sum, a) => sum + a.correctAnswers, 0),
      totalWrong: attempts.reduce((sum, a) => sum + a.wrongAnswers, 0),
      accuracy: ((attempts.reduce((sum, a) => sum + a.correctAnswers, 0) / 
                 (attempts.length * 100)) * 100).toFixed(2),
      subjectWisePerformance: {}
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Frontend Component: MCQ Test Engine

```jsx
// components/MCQTests/MCQTestEngine.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import MCQQuestion from './MCQQuestion';
import TestTimer from './TestTimer';
import QuestionPalette from './QuestionPalette';

export default function MCQTestEngine({ testId }) {
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    startTest();
  }, []);

  const startTest = async () => {
    try {
      const response = await axios.post(`/api/mcq-tests/${testId}/start`);
      setTestData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error starting test:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    // Auto-save
    axios.post(`/api/mcq-tests/${testId}/save-answer`, {
      attemptId: testData.attemptId,
      questionId,
      answer,
      timeSpent: 0
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/mcq-tests/${testId}/submit`, {
        attemptId: testData.attemptId
      });
      setSubmitted(true);
      // Redirect to results
      window.location.href = `/results/${testData.attemptId}`;
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading || !testData) return <div>Loading...</div>;

  const currentQuestion = testData.questions[currentQuestionIndex];
  const answered = Object.keys(answers).length;
  const unanswered = testData.totalQuestions - answered;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">{testData.testName}</h2>
            <TestTimer duration={testData.duration} onTimeUp={handleSubmit} />
          </div>

          <MCQQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={testData.totalQuestions}
            selectedAnswer={answers[currentQuestion._id]}
            onSelectAnswer={(answer) => handleAnswer(currentQuestion._id, answer)}
            onMarkForReview={() => setMarkedForReview(prev => 
              prev.includes(currentQuestion._id) 
                ? prev.filter(id => id !== currentQuestion._id)
                : [...prev, currentQuestion._id]
            )}
            isMarked={markedForReview.includes(currentQuestion._id)}
          />

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              className="px-4 py-2 bg-gray-500 text-white rounded"
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(testData.totalQuestions - 1, currentQuestionIndex + 1))}
              className="px-4 py-2 bg-gray-500 text-white rounded"
              disabled={currentQuestionIndex === testData.totalQuestions - 1}
            >
              Next →
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded ml-auto"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Question Palette */}
      <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">Test Progress</div>
          <div className="space-y-1 text-sm">
            <div>✅ Answered: {answered}</div>
            <div>⏳ Unanswered: {unanswered}</div>
            <div>🔖 For Review: {markedForReview.length}</div>
          </div>
        </div>

        <QuestionPalette
          totalQuestions={testData.totalQuestions}
          answered={Object.keys(answers)}
          markedForReview={markedForReview}
          currentQuestion={currentQuestionIndex}
          onSelectQuestion={setCurrentQuestionIndex}
        />
      </div>
    </div>
  );
}
```

---

## Features Summary

✅ **Chapter-wise MCQ Tests**: Test specific chapters
✅ **Subject-wise Tests**: Physics, Chemistry, Biology
✅ **Mixed Difficulty**: Easy, Medium, Hard combinations
✅ **Real-time Answer Saving**: Auto-save while taking test
✅ **Review Feature**: Review answers before submitting
✅ **Detailed Analytics**: Subject-wise performance, weak areas
✅ **Negative Marking**: -1 for wrong answers
✅ **Performance Tracking**: Percentile, accuracy, trends
✅ **Leaderboard**: Compare with other students (optional)
✅ **Solution Videos**: Watch video explanations

**Last Updated**: 2026-05-13
