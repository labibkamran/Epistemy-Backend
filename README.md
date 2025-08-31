# Epistemy Backend

Production-ready Node/Express backend for Epistemy with MongoDB persistence and an AI pipeline that turns tutoring transcripts into a structured Teaching Pack.

## Overview

Welcome to **Epistemy** - an intelligent tutoring platform that transforms raw video sessions into structured, AI-powered learning experiences. Let me tell you the story of how our backend orchestrates this magical transformation.

### 🎯 **The Epistemy Vision**

Epistemy is more than just a tutoring platform - it's an AI-powered learning ecosystem that bridges the gap between live tutoring sessions and structured, personalized learning materials. Our backend serves as the intelligent brain that processes, analyzes, and transforms every tutoring interaction into actionable insights.

### 🚀 **The Complete Learning Journey**

#### **1. The Session Creation Saga**
The journey begins when a **tutor** creates a new session in the system. They provide:
- Session title and description
- Student assignment (optional)
- Session pricing (if they want to monetize their expertise)
- Calendly integration for seamless booking

#### **2. The Transcript Upload Adventure**
Once a tutoring session is completed, the magic begins:
- **Tutors upload transcript files** (.txt format) containing the session conversation
- Our system processes these transcripts through a sophisticated **AI pipeline**
- Each transcript undergoes a complete transformation into structured learning content

#### **3. The AI Pipeline Transformation**
Our intelligent backend processes transcripts through a **5-stage AI pipeline**:

**Stage 1: Preprocessing & Language Detection**
- Cleans and normalizes transcript text
- Detects language automatically
- Generates content checksums for integrity

**Stage 2: Topic Extraction & Organization**
- Identifies the main subject of the session
- Breaks down content into logical subtopics
- Creates learning objectives for each subtopic

**Stage 3: Executive Summary Generation**
- Creates comprehensive session summaries
- Extracts key learning points
- Identifies common misconceptions to address

**Stage 4: Progress Evaluation & Assessment**
- Compares current session with previous ones
- Evaluates student progress across multiple dimensions
- Generates personalized improvement recommendations
- Creates performance rubrics with evidence-based scoring

**Stage 5: Interactive Quiz Creation**
- Generates 3-5 progression-aware practice questions
- Creates multiple-choice questions with explanations
- Adapts difficulty based on session content
- Provides immediate feedback and learning reinforcement

#### **4. The Student Learning Experience**
Students access their personalized learning materials:
- **Session Overview**: Complete session summaries and key points
- **Interactive Quizzes**: Practice questions with immediate feedback
- **Progress Tracking**: Visual progress indicators and improvement areas
- **Learning Analytics**: Performance metrics and study recommendations

#### **5. The Booking & Payment Ecosystem**
Our platform seamlessly integrates with external services:
- **Calendly Integration**: Students can book sessions directly through tutor's Calendly links
- **Session Pricing**: Tutors set their own rates and monetize their expertise
- **Payment Tracking**: Built-in payment status management
- **Session Management**: Complete lifecycle from booking to completion

### 🏗️ **Backend Architecture Highlights**

#### **Core Services**
- **Tutor Service**: Manages tutor profiles, sessions, and content creation
- **Student Service**: Handles student access, progress tracking, and quiz attempts
- **AI Pipeline Service**: Orchestrates the complete content transformation process
- **File Management**: Handles transcript uploads and document processing

#### **Data Models**
- **User Management**: Separate tutor and student roles with specialized fields
- **Session Tracking**: Complete session lifecycle with AI-generated content
- **Progress Analytics**: Student performance tracking and improvement metrics
- **Quiz Management**: Interactive assessment system with attempt tracking

#### **AI Integration**
- **LangChain Framework**: Robust AI pipeline orchestration
- **Groq Compatibility**: High-performance LLM integration
- **JSON Schema Validation**: Ensures AI output quality and consistency
- **Error Recovery**: Robust fallback mechanisms for AI processing failures

### 🔄 **The Complete Flow in Action**

1. **Tutor creates session** → System generates unique session ID
2. **Student books session** → Calendly integration handles scheduling
3. **Session completion** → Transcript upload triggers AI pipeline
4. **AI processing** → 5-stage transformation creates learning pack
5. **Content delivery** → Students access personalized materials
6. **Learning engagement** → Quiz attempts and progress tracking
7. **Continuous improvement** → AI learns from student interactions

### 🌟 **What Makes Epistemy Special**

- **Intelligent Content Generation**: Every session becomes a structured learning experience
- **Personalized Learning Paths**: AI adapts content based on individual progress
- **Seamless Integration**: Calendly, payment, and content management in one platform
- **Scalable Architecture**: Built to handle multiple tutors and students simultaneously
- **Quality Assurance**: Robust error handling and content validation
- **Performance Optimization**: Token management and rate limiting for cost efficiency

## AI Pipeline (High-Level Diagram)

![AI Pipeline](https://res.cloudinary.com/dwakiaafh/image/upload/v1756441896/epistemy_pipeline_sketchflow_v2_fhipzl.png)

## Database Diagram

![Database Diagram](https://res.cloudinary.com/dwakiaafh/image/upload/v1756617058/epistemy_flow_diagram_white_nyoj5d.png)

## 🚀 **Deployment Guide**

### **Requirements**

- **Node.js**: Version 18 or higher
- **MongoDB**: Version 6 or higher
- **npm** or **yarn** package manager
- **Git** for cloning the repository

### **Installation & Setup**

#### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd Epistemy-Backend
```

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Environment Configuration**
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/epistemy

# AI/LLM Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com/openai/v1

# Model Configuration (examples)
MODEL_TOPICS=mixtral-8x7b-32768
MODEL_SUMMARY=mixtral-8x7b-32768
MODEL_PROGRESS=mixtral-8x7b-32768
MODEL_QUIZ=mixtral-8x7b-32768

# Token Limits
MAX_INPUT_CHARS=12000
MAX_OUTPUT_TOKENS=600
MAX_OUTPUT_TOKENS_PROGRESS=900
MAX_OUTPUT_TOKENS_QUIZ=700

# Performance Configuration
LLM_STEP_PAUSE_MS=200

# Frontend URL (for CORS and sharing)
FRONTEND_URL=http://localhost:5173
```

#### **4. Database Setup**
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

#### **5. Run the Application**

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Build and Run:**
```bash
npm run build
npm start
```

### **API Endpoints**

#### **Tutor Routes**
- `POST /tutor/signup` - Tutor registration
- `POST /tutor/login` - Tutor authentication
- `POST /tutor/session` - Create new session
- `POST /tutor/process-session` - Upload and process transcript
- `GET /tutor/sessions/:tutorId` - Get tutor's sessions
- `GET /tutor/session/:sessionId` - Get specific session
- `PATCH /tutor/session/:sessionId` - Update session
- `GET /tutor/students` - List all students
- `GET /tutor/profile/:tutorId` - Get tutor profile
- `PATCH /tutor/profile/:tutorId` - Update tutor profile

#### **Student Routes**
- `POST /student/signup` - Student registration
- `POST /student/login` - Student authentication
- `GET /student/sessions/:studentId` - Get student's sessions
- `GET /student/session/:sessionId` - Get specific session details
- `POST /student/session/:sessionId/quiz` - Submit quiz attempt
- `GET /student/session/:sessionId/attempts` - Get quiz attempt history
- `GET /student/stats/:studentId` - Get student statistics
- `GET /student/tutors` - List available tutors with Calendly links

### **Testing the API**

#### **Using Postman or cURL**

**1. Test Tutor Signup:**
```bash
curl -X POST http://localhost:4000/tutor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "calendlyUrl": "https://calendly.com/johndoe",
    "sessionPrice": 50
  }'
```

**2. Test Session Creation:**
```bash
curl -X POST http://localhost:4000/tutor/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tutorId": "tutor_id_here",
    "title": "Mathematics Session",
    "studentId": "student_id_here",
    "paid": false
  }'
```

### **Production Deployment**

#### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/epistemy
GROQ_API_KEY=your_production_groq_key
FRONTEND_URL=https://yourdomain.com
```

#### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

#### **PM2 Process Management**
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "epistemy-backend" -- start

# Monitor the application
pm2 monit

# Restart the application
pm2 restart epistemy-backend
```

### **Troubleshooting**

#### **Common Issues**

**1. MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for cloud databases

**2. AI Pipeline Failures:**
- Verify GROQ_API_KEY is valid
- Check token limits in environment variables
- Monitor API rate limits

**3. File Upload Issues:**
- Ensure proper file format (.txt for transcripts)
- Check file size limits
- Verify multer configuration

#### **Logs and Debugging**
```bash
# View application logs
npm run dev

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Monitor API requests
# Check browser developer tools for frontend errors
```

### **Performance Optimization**

- **Database Indexing**: Already configured for optimal query performance
- **Token Management**: Configured to handle rate limits efficiently
- **Error Recovery**: Robust fallback mechanisms for AI processing
- **Caching**: Implement Redis for session caching (optional enhancement)

### **Security Considerations**

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation and sanitization
- **CORS Configuration**: Properly configured for frontend integration
- **Rate Limiting**: Built-in protection against API abuse

Your Epistemy backend is now ready for deployment! 🎉


