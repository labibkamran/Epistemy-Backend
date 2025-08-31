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


