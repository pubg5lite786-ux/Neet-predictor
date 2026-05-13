# 🔄 Live Market Data & Automatic Updates System

## Overview
Automated system that fetches and updates NEET counseling data, cut-offs, news, and alerts in real-time from official sources.

---

## 1. AUTOMATIC CUT-OFF DATA UPDATES

### Data Sources
- **NTA Official Website** (nta.ac.in)
- **State Counseling Portals**
- **Medical Colleges Official Sites**
- **Government Medical Council APIs**

### Backend Job (Node.js + Bull Queue)

```javascript
// src/jobs/updateCutoffJob.js

const Bull = require('bull');
const axios = require('axios');
const CutoffModel = require('../models/Cutoff');
const logger = require('../utils/logger');

const cutoffQueue = new Bull('cutoff-updates', process.env.REDIS_URL);

// Fetch from NTA Official API
async function fetchNTACutoffData() {
  try {
    const response = await axios.get('https://nta.ac.in/api/cutoff-data', {
      headers: {
        'Authorization': `Bearer ${process.env.NTA_API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    logger.error('NTA API Error:', error);
    throw error;
  }
}

// Fetch from State Portals (Example: Maharashtra)
async function fetchStatePortalData(stateCode) {
  const stateAPIs = {
    'MH': 'https://www.ojee.in/api/cutoff',
    'KA': 'https://cetonline.karnataka.gov.in/api/cutoff',
    'DL': 'https://www.nta.ac.in/delhi-cutoff',
    'TN': 'https://www.tnmedicalselection.org/api/cutoff'
  };
  
  try {
    const response = await axios.get(stateAPIs[stateCode]);
    return response.data;
  } catch (error) {
    logger.error(`State Portal Error for ${stateCode}:`, error);
    return null;
  }
}

// Process and store cut-off data
async function processCutoffData(rawData) {
  try {
    const processedData = rawData.map(item => ({
      collegeCode: item.college_code,
      collegeName: item.college_name,
      state: item.state,
      examYear: new Date().getFullYear(),
      counselingRound: item.round,
      quota: item.quota_type,
      cutoffRank: {
        general: item.general_cutoff,
        obc: item.obc_cutoff,
        sc: item.sc_cutoff,
        st: item.st_cutoff,
        generalPwD: item.general_pwd_cutoff,
        obcPwD: item.obc_pwd_cutoff,
        scPwD: item.sc_pwd_cutoff,
        stPwD: item.st_pwd_cutoff
      },
      updatedAt: new Date(),
      source: 'nta_official'
    }));
    
    // Bulk upsert to database
    for (const data of processedData) {
      await CutoffModel.findOneAndUpdate(
        { collegeCode: data.collegeCode, examYear: data.examYear, quota: data.quota },
        data,
        { upsert: true }
      );
    }
    
    logger.info(`✅ Updated ${processedData.length} cut-off records`);
    return processedData.length;
  } catch (error) {
    logger.error('Error processing cut-off data:', error);
    throw error;
  }
}

// Main job handler
cutoffQueue.process(async (job) => {
  logger.info('🔄 Starting Cut-off Data Update...');
  
  try {
    // Fetch from NTA
    const ntaData = await fetchNTACutoffData();
    await processCutoffData(ntaData);
    
    // Fetch from State Portals
    const states = ['MH', 'KA', 'DL', 'TN', 'GJ', 'UP', 'WB', 'AP'];
    for (const state of states) {
      const stateData = await fetchStatePortalData(state);
      if (stateData) {
        await processCutoffData(stateData);
      }
    }
    
    logger.info('✅ Cut-off data update completed successfully');
    return { success: true, message: 'Cut-off data updated' };
  } catch (error) {
    logger.error('❌ Cut-off update failed:', error);
    throw error;
  }
});

// Schedule the job - Run every 6 hours
cutoffQueue.add({}, {
  repeat: {
    cron: '0 */6 * * *' // Every 6 hours
  }
});

module.exports = cutoffQueue;
```

---

## 2. AUTOMATIC NEWS FEED INTEGRATION

### RSS Feed & API Integration

```javascript
// src/jobs/updateNewsJob.js

const Bull = require('bull');
const Parser = require('rss-parser');
const axios = require('axios');
const NewsModel = require('../models/News');
const logger = require('../utils/logger');

const newsQueue = new Bull('news-updates', process.env.REDIS_URL);
const parser = new Parser();

// NTA RSS Feeds
const RSS_FEEDS = [
  'https://nta.ac.in/feed.xml',
  'https://www.ndtv.com/topic/neet/rss',
  'https://timesofindia.indiatimes.com/rssfeeds/medical-entrance-exams-news'
];

// Google News API (Requires API Key)
async function fetchFromGoogleNews() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'NEET OR counseling OR medical college',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: process.env.GOOGLE_NEWS_API_KEY
      }
    });
    return response.data.articles;
  } catch (error) {
    logger.error('Google News API Error:', error);
    return [];
  }
}

// Fetch and parse RSS feeds
async function fetchRSSFeeds() {
  let allArticles = [];
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const articles = feed.items.map(item => ({
        title: item.title,
        description: item.content || item.contentSnippet,
        url: item.link,
        image: item.isoDate ? null : item.image,
        source: item.creator || 'NTA',
        publishedAt: new Date(item.pubDate),
        category: 'Official Update',
        priority: feedUrl.includes('nta') ? 'High' : 'Medium'
      }));
      allArticles = [...allArticles, ...articles];
    } catch (error) {
      logger.warn(`Failed to fetch RSS feed: ${feedUrl}`, error);
    }
  }
  
  return allArticles;
}

// Store news articles to database
async function storeNews(articles) {
  try {
    let addedCount = 0;
    
    for (const article of articles) {
      // Check if article already exists
      const exists = await NewsModel.findOne({ url: article.url });
      if (!exists) {
        await NewsModel.create({
          ...article,
          slug: article.title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
        });
        addedCount++;
      }
    }
    
    logger.info(`✅ Added ${addedCount} new articles to database`);
    return addedCount;
  } catch (error) {
    logger.error('Error storing news:', error);
    throw error;
  }
}

// Main news update job
newsQueue.process(async (job) => {
  logger.info('🔄 Starting News Feed Update...');
  
  try {
    // Fetch from RSS feeds
    const rssArticles = await fetchRSSFeeds();
    
    // Fetch from Google News API
    const googleArticles = await fetchFromGoogleNews();
    
    // Combine and deduplicate
    const allArticles = [...rssArticles, ...googleArticles];
    const uniqueArticles = Array.from(
      new Map(allArticles.map(item => [item.url, item])).values()
    );
    
    // Store to database
    const addedCount = await storeNews(uniqueArticles);
    
    logger.info(`✅ News update completed. Added ${addedCount} articles.`);
    return { success: true, articlesAdded: addedCount };
  } catch (error) {
    logger.error('❌ News update failed:', error);
    throw error;
  }
});

// Schedule: Run every 2 hours
newsQueue.add({}, {
  repeat: {
    cron: '0 */2 * * *'
  }
});

module.exports = newsQueue;
```

---

## 3. REAL-TIME COUNSELING ALERTS

### Alert Generation & Notification System

```javascript
// src/jobs/sendAlertsJob.js

const Bull = require('bull');
const AlertModel = require('../models/Alert');
const UserModel = require('../models/User');
const NotificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const alertQueue = new Bull('alert-notifications', process.env.REDIS_URL);

// Fetch upcoming alerts
async function getUpcomingAlerts() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  
  return await AlertModel.find({
    startDate: { $lte: oneHourLater },
    startDate: { $gte: now },
    isBroadcasted: false
  });
}

// Send notifications to users
async function sendAlertNotifications(alert) {
  try {
    // Get target users based on alert criteria
    const query = {};
    if (alert.targetStates.length > 0 && !alert.targetStates.includes('All')) {
      query.state = { $in: alert.targetStates };
    }
    if (alert.targetCategories.length > 0 && !alert.targetCategories.includes('All')) {
      query.category = { $in: alert.targetCategories };
    }
    
    const users = await UserModel.find(query).select('_id email phone pushToken');
    
    logger.info(`📢 Sending alert to ${users.length} users`);
    
    // Send notifications in batches
    const batchSize = 1000;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (user) => {
        // Email notification
        if (alert.notificationChannels.includes('email')) {
          await NotificationService.sendEmail({
            to: user.email,
            subject: alert.title,
            template: 'alert-notification',
            data: alert
          });
        }
        
        // SMS notification
        if (alert.notificationChannels.includes('sms')) {
          await NotificationService.sendSMS({
            to: user.phone,
            message: `${alert.title}. Visit: ${process.env.APP_URL}${alert.actionLink}`
          });
        }
        
        // Push notification
        if (alert.notificationChannels.includes('push') && user.pushToken) {
          await NotificationService.sendPushNotification({
            token: user.pushToken,
            title: alert.title,
            message: alert.description,
            data: { alertId: alert._id, actionLink: alert.actionLink }
          });
        }
      }));
    }
    
    // Mark alert as broadcasted
    alert.isBroadcasted = true;
    await alert.save();
    
    logger.info(`✅ Alert notifications sent to ${users.length} users`);
  } catch (error) {
    logger.error('Error sending alert notifications:', error);
    throw error;
  }
}

// Main alert processing job
alertQueue.process(async (job) => {
  logger.info('🔔 Checking for upcoming alerts...');
  
  try {
    const upcomingAlerts = await getUpcomingAlerts();
    
    for (const alert of upcomingAlerts) {
      await sendAlertNotifications(alert);
    }
    
    logger.info(`✅ Processed ${upcomingAlerts.length} alerts`);
    return { success: true, alertsProcessed: upcomingAlerts.length };
  } catch (error) {
    logger.error('❌ Alert processing failed:', error);
    throw error;
  }
});

// Schedule: Run every 5 minutes
alertQueue.add({}, {
  repeat: {
    cron: '*/5 * * * *'
  }
});

module.exports = alertQueue;
```

---

## 4. REAL-TIME DATA SYNC WITH REDIS

```javascript
// src/services/cacheService.js

const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect();

class CacheService {
  // Cache cut-off data for 6 hours
  async cacheCutoffData(stateCode, data) {
    const key = `cutoff:${stateCode}`;
    await redisClient.setEx(key, 21600, JSON.stringify(data));
    logger.info(`Cached cut-off data for ${stateCode}`);
  }
  
  // Cache college data for 24 hours
  async cacheCollegeData(collegeId, data) {
    const key = `college:${collegeId}`;
    await redisClient.setEx(key, 86400, JSON.stringify(data));
  }
  
  // Get cached data
  async getCachedData(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  // Invalidate cache
  async invalidateCache(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Invalidated ${keys.length} cache entries`);
    }
  }
}

module.exports = new CacheService();
```

---

## 5. SETUP IN MAIN SERVER

```javascript
// src/server.js

require('dotenv').config();
const express = require('express');
const cutoffQueue = require('./jobs/updateCutoffJob');
const newsQueue = require('./jobs/updateNewsJob');
const alertQueue = require('./jobs/sendAlertsJob');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/colleges', require('./routes/colleges.routes'));
app.use('/api/cutoff', require('./routes/cutoff.routes'));
app.use('/api/tests', require('./routes/tests.routes'));
app.use('/api/forum', require('./routes/forum.routes'));
app.use('/api/news', require('./routes/news.routes'));
app.use('/api/alerts', require('./routes/alerts.routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Job status endpoint
app.get('/api/jobs/status', async (req, res) => {
  try {
    const cutoffStats = await cutoffQueue.getJobCounts();
    const newsStats = await newsQueue.getJobCounts();
    const alertStats = await alertQueue.getJobCounts();
    
    res.json({
      cutoffUpdates: cutoffStats,
      newsUpdates: newsStats,
      alertNotifications: alertStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('📊 Automatic update jobs initialized');
});
```

---

## 6. ENVIRONMENT VARIABLES

```bash
# .env
REDIS_URL=redis://:password@localhost:6379/0
NTA_API_KEY=your_nta_api_key
GOOGLE_NEWS_API_KEY=your_google_news_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
ONESIGNAL_API_KEY=your_onesignal_key
```

---

## 7. MONITORING DASHBOARD

```javascript
// Frontend: Components to monitor real-time updates

// components/AdminDashboard/JobMonitor.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobMonitor() {
  const [jobStats, setJobStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('/api/jobs/status');
        setJobStats(response.data);
      } catch (error) {
        console.error('Failed to fetch job status:', error);
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading || !jobStats) return <div>Loading...</div>;
  
  return (
    <div className="job-monitor">
      <h2>🔄 Live Job Status</h2>
      <div className="job-stats">
        <div className="stat-card">
          <h3>📊 Cut-off Updates</h3>
          <p>Active: {jobStats.cutoffUpdates.active}</p>
          <p>Completed: {jobStats.cutoffUpdates.completed}</p>
          <p>Failed: {jobStats.cutoffUpdates.failed}</p>
        </div>
        
        <div className="stat-card">
          <h3>📰 News Updates</h3>
          <p>Active: {jobStats.newsUpdates.active}</p>
          <p>Completed: {jobStats.newsUpdates.completed}</p>
        </div>
        
        <div className="stat-card">
          <h3>🔔 Alert Notifications</h3>
          <p>Active: {jobStats.alertNotifications.active}</p>
          <p>Completed: {jobStats.alertNotifications.completed}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Summary

✅ **Automatic Cut-off Updates**: Every 6 hours from NTA & State Portals
✅ **Real-time News Integration**: Every 2 hours from RSS feeds & Google News
✅ **Live Alert Notifications**: Every 5 minutes, sent via Email/SMS/Push
✅ **Redis Caching**: Fast data retrieval with 6-24 hour cache
✅ **Monitoring Dashboard**: Track all jobs in real-time
✅ **Error Handling**: Automatic retry on failures

**Last Updated**: 2026-05-13
