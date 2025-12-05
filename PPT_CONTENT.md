# 📊 UlamApp - PowerPoint Presentation Content

**Use this content directly in your PowerPoint slides**

---

## 🎯 SLIDE 1: TITLE SLIDE

### Title:
**UlamApp: AI-Powered Filipino Recipe Generator**

### Subtitle:
*Solving "Anong lulutuin ko?" with Artificial Intelligence*

### Team Information:
- **Team Name:** Watchdogs
- **Course:** SFIT-2B
- **Institution:** Quezon City University
- **Date:** [Your Presentation Date]

---

## 🎯 SLIDE 2: OBJECTIVES (OBJ)

### Primary Objective:
**To develop an AI-powered web application that generates personalized Filipino recipe suggestions based on available ingredients, helping users reduce food waste and make informed cooking decisions.**

### Specific Objectives:

1. **To create an intelligent recipe recommendation system**
   - Analyze user's available ingredients
   - Generate personalized Filipino dish suggestions
   - Provide detailed cooking instructions

2. **To implement AI-powered ingredient recognition**
   - Camera-based ingredient scanning
   - Automatic ingredient identification using Google Gemini AI
   - Support for common Filipino ingredients

3. **To develop a user-friendly interface**
   - Bilingual support (English and Tagalog)
   - Responsive design for all devices
   - Intuitive navigation and recipe browsing

4. **To integrate smart filtering features**
   - Budget-based recipe filtering
   - Healthy mode option
   - Adjustable serving sizes (pax control)

5. **To implement cloud-based recipe storage**
   - Secure user authentication
   - Personal recipe collection
   - Cross-device synchronization

6. **To provide comprehensive recipe information**
   - Nutritional information
   - Estimated costs
   - Step-by-step cooking instructions
   - Shopping lists for missing ingredients

---

## 📋 SLIDE 3: SCOPE

### In-Scope Features:

#### 1. **Core Functionality**
- ✅ Ingredient input (manual and camera-based)
- ✅ AI-powered recipe generation
- ✅ Recipe browsing and viewing
- ✅ Detailed cooking instructions
- ✅ Recipe saving and management

#### 2. **User Management**
- ✅ User registration and authentication
- ✅ Email verification system
- ✅ User profile management
- ✅ Saved recipes collection

#### 3. **Recipe Features**
- ✅ Recipe suggestions based on ingredients
- ✅ Full recipe details with instructions
- ✅ Nutritional information display
- ✅ Cost estimation
- ✅ Difficulty level indicators
- ✅ Preparation time display

#### 4. **Smart Filters**
- ✅ Budget limit setting (PHP)
- ✅ Healthy mode toggle
- ✅ Serving size adjustment (pax)
- ✅ Language preference (English/Tagalog)

#### 5. **Additional Features**
- ✅ Trending recipes section
- ✅ Recently viewed recipes
- ✅ Recipe image display
- ✅ Shopping list generation
- ✅ Recipe search and filtering

#### 6. **Technical Scope**
- ✅ Web-based application (React)
- ✅ Cloud database (Supabase)
- ✅ AI integration (Google Gemini)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time data synchronization

---

## 🚫 SLIDE 4: DELIMITATION

### Out-of-Scope Features:

#### 1. **Recipe Creation by Users**
- ❌ Users cannot create or submit their own recipes
- ❌ No community recipe sharing
- ❌ No recipe rating or review system

#### 2. **Social Features**
- ❌ No social media integration
- ❌ No recipe sharing via social platforms
- ❌ No user-to-user messaging
- ❌ No recipe comments or discussions

#### 3. **Advanced Features**
- ❌ No meal planning calendar
- ❌ No grocery list export to shopping apps
- ❌ No recipe video tutorials
- ❌ No voice commands or voice assistant

#### 4. **Payment Integration**
- ❌ No in-app purchases
- ❌ No premium subscription features
- ❌ No payment processing for ingredients

#### 5. **Offline Functionality**
- ❌ Limited offline access (only saved recipes)
- ❌ No offline recipe generation
- ❌ Requires internet for AI processing

#### 6. **Platform Limitations**
- ❌ Web application only (no native mobile app)
- ❌ No desktop application version
- ❌ Browser-based only

#### 7. **Recipe Database**
- ❌ No pre-existing recipe database
- ❌ Recipes generated on-demand by AI
- ❌ No recipe validation by professional chefs

#### 8. **Ingredient Recognition**
- ❌ Limited to common Filipino ingredients
- ❌ May not recognize rare or exotic ingredients
- ❌ Requires good lighting for camera feature

#### 9. **Language Support**
- ❌ Only English and Tagalog (no other languages)
- ❌ No regional dialect support

#### 10. **Data and Analytics**
- ❌ No detailed user analytics dashboard
- ❌ No recipe popularity metrics for users
- ❌ No personal cooking statistics

---

## ✨ SLIDE 5: FEATURES (Part 1)

### 1. **AI-Powered Recipe Generation**
- **Description:** Uses Google Gemini AI to analyze available ingredients and generate personalized Filipino recipe suggestions
- **Benefit:** Intelligent recommendations tailored to user's pantry
- **Technology:** Google Gemini 2.5 Flash AI Model

### 2. **Camera-Based Ingredient Recognition**
- **Description:** Scan ingredients using device camera; AI identifies and adds them to pantry list
- **Benefit:** Quick and convenient ingredient input
- **Technology:** Google Gemini Vision API

### 3. **Smart Recipe Filtering**
- **Budget Control:** Set spending limits in PHP; recipes filtered by cost
- **Healthy Mode:** Prioritizes vegetable-heavy, less oily options
- **Pax Control:** Adjust recipes for number of people (1-10+)
- **Benefit:** Personalized recipe suggestions based on preferences

### 4. **Comprehensive Recipe Details**
- **Full Instructions:** Step-by-step cooking guide
- **Chef's Notes:** Tips and cooking advice
- **Nutritional Info:** Calories, protein, carbs, fat
- **Cost Breakdown:** Estimated cost per ingredient
- **Shopping List:** Missing ingredients with prices

---

## ✨ SLIDE 6: FEATURES (Part 2)

### 5. **Bilingual Interface**
- **Languages:** English and Tagalog/Filipino
- **Toggle:** Easy language switching
- **Benefit:** Accessible to Filipino users
- **Coverage:** All UI elements and recipe content

### 6. **Cloud-Based Recipe Storage**
- **Save Recipes:** Personal cookbook collection
- **Sync Across Devices:** Access from any device
- **Secure Storage:** Encrypted database with user authentication
- **Benefit:** Never lose your favorite recipes

### 7. **Trending Recipes**
- **Real-Time Data:** Based on actual user interactions
- **View Counts:** Shows popularity metrics
- **Benefit:** Discover what others are cooking
- **Technology:** Supabase database tracking

### 8. **User Account Management**
- **Registration:** Easy sign-up process
- **Email Verification:** Secure account activation
- **Profile Settings:** Customize name and preferences
- **Account Deletion:** User-controlled data removal

### 9. **Responsive Design**
- **Mobile-First:** Optimized for smartphones
- **Tablet Support:** Great experience on tablets
- **Desktop Compatible:** Works on computers
- **Benefit:** Access from any device, anywhere

### 10. **Visual Recipe Cards**
- **Appetizing Images:** Auto-fetched recipe photos
- **Modern Design:** Clean, card-based interface
- **Easy Browsing:** Intuitive navigation
- **Benefit:** Visual recipe discovery

---

## 🎯 SLIDE 7: TECHNICAL FEATURES

### Technology Stack:

#### **Frontend:**
- React 19 (Modern UI Framework)
- Tailwind CSS 4 (Styling)
- Vite (Build Tool)

#### **Backend & Database:**
- Supabase (Cloud Database & Authentication)
- PostgreSQL (Database Engine)
- Row Level Security (Data Protection)

#### **AI & APIs:**
- Google Gemini 2.5 Flash (Recipe Generation)
- Google Custom Search API (Image Fetching)
- RESTful API Integration

#### **Key Technical Features:**
- ✅ Real-time data synchronization
- ✅ Secure user authentication
- ✅ Cloud-based storage
- ✅ Responsive design
- ✅ Error handling and validation
- ✅ Loading states and animations

---

## 📊 SLIDE 8: SYSTEM ARCHITECTURE

### Architecture Overview:

```
┌─────────────────┐
│   User Browser  │
│   (React App)   │
└────────┬────────┘
         │
         ├──► Google Gemini AI (Recipe Generation)
         │
         ├──► Google Custom Search (Images)
         │
         └──► Supabase (Database & Auth)
                │
                ├──► User Profiles
                ├──► Saved Recipes
                └──► Recipe Views (Trending)
```

### Data Flow:
1. User inputs ingredients
2. Frontend sends data to AI
3. AI generates recipes
4. Recipes displayed to user
5. User actions saved to database
6. Data synchronized across devices

---

## 🎯 SLIDE 9: CONCLUSION

### Summary:

**UlamApp successfully addresses the common Filipino household challenge of "Anong lulutuin ko?" by leveraging artificial intelligence to provide personalized recipe recommendations based on available ingredients.**

### Key Achievements:

1. **✅ Functional AI Integration**
   - Successfully integrated Google Gemini AI
   - Generates accurate Filipino recipe suggestions
   - Provides detailed cooking instructions

2. **✅ User-Friendly Interface**
   - Intuitive design accessible to all users
   - Bilingual support for Filipino users
   - Responsive across all devices

3. **✅ Complete Feature Set**
   - Ingredient recognition (manual & camera)
   - Smart filtering (budget, health, pax)
   - Recipe saving and management
   - Trending recipes section

4. **✅ Secure & Scalable**
   - Cloud-based architecture
   - Secure user authentication
   - Scalable database design

### Impact:

- **Reduces Food Waste:** Helps users utilize available ingredients
- **Saves Time:** Quick recipe discovery and meal planning
- **Promotes Filipino Cuisine:** Focuses on local dishes and ingredients
- **Accessible:** Free to use, works on any device
- **Educational:** Provides cooking instructions for beginners

### Future Enhancements:

- Meal planning calendar
- Recipe sharing features
- Video tutorials
- Mobile app version
- Expanded ingredient recognition

### Final Statement:

**"UlamApp demonstrates how modern web technologies and artificial intelligence can solve everyday problems, making cooking more accessible and enjoyable for Filipino households."**

---

## 📈 SLIDE 10: STATISTICS & METRICS

### Performance Metrics:

- **Recipe Generation Time:** 3-5 seconds
- **AI Processing:** Real-time recipe suggestions
- **Database Response:** < 1 second
- **Image Loading:** Optimized with caching
- **User Experience:** Smooth, responsive interface

### Technical Specifications:

- **Supported Languages:** 2 (English, Tagalog)
- **Device Support:** All (Mobile, Tablet, Desktop)
- **Database:** PostgreSQL (Supabase)
- **AI Model:** Google Gemini 2.5 Flash
- **Framework:** React 19
- **Build Size:** ~470 KB (optimized)

---

## 🎓 SLIDE 11: LEARNING OUTCOMES

### Skills Developed:

1. **Frontend Development**
   - React framework mastery
   - Component-based architecture
   - State management
   - Responsive design

2. **Backend Integration**
   - API integration
   - Database management
   - Authentication systems
   - Cloud services

3. **AI Integration**
   - Google Gemini API usage
   - Prompt engineering
   - AI response handling
   - Image recognition

4. **Project Management**
   - Team collaboration
   - Version control (Git)
   - Documentation
   - Testing and debugging

---

## 💡 SLIDE 12: DEMONSTRATION

### Live Demo Checklist:

- [ ] Show landing page
- [ ] Demonstrate sign up/login
- [ ] Add ingredients (manual)
- [ ] Show camera feature
- [ ] Generate recipes
- [ ] View recipe details
- [ ] Save a recipe
- [ ] Show saved recipes
- [ ] Toggle language
- [ ] Adjust settings
- [ ] Show trending section

---

## ❓ SLIDE 13: Q&A

### Prepared Answers:

**Q: How accurate are the AI-generated recipes?**  
A: The AI uses Filipino cooking traditions and common practices. Recipes are generated based on established cooking methods.

**Q: Is user data secure?**  
A: Yes, we use Supabase with Row Level Security. Each user can only access their own data.

**Q: Can it work offline?**  
A: Saved recipes can be viewed offline, but generating new recipes requires internet for AI processing.

**Q: What makes it different from other recipe apps?**  
A: Focus on Filipino cuisine, AI-powered generation, ingredient-based suggestions, and bilingual support.

**Q: Is it free to use?**  
A: Yes, all core features are free. No subscription required.

---

## 📝 ADDITIONAL SLIDE IDEAS

### Slide 14: Problem Statement
- Show statistics about food waste
- Common challenges in meal planning
- The "Anong lulutuin ko?" problem

### Slide 15: Solution Overview
- How UlamApp solves the problem
- Key differentiators
- User benefits

### Slide 16: User Journey
- Step-by-step user flow
- Visual representation
- Key touchpoints

### Slide 17: Technology Stack Details
- Detailed tech breakdown
- Why each technology was chosen
- Integration challenges and solutions

### Slide 18: Challenges & Solutions
- Technical challenges faced
- How they were overcome
- Lessons learned

### Slide 19: Future Roadmap
- Planned enhancements
- Potential features
- Long-term vision

### Slide 20: Thank You
- Team acknowledgment
- Contact information
- Repository link (if applicable)

---

## 🎨 DESIGN TIPS FOR PPT

### Color Scheme:
- **Primary:** Orange (#f97316) - Represents Filipino cuisine
- **Secondary:** Red (#ef4444) - Energy and passion
- **Accent:** Slate/Gray - Professional look
- **Background:** White/Light gray - Clean and modern

### Font Recommendations:
- **Headings:** Bold, Sans-serif (Arial, Calibri, or similar)
- **Body:** Clean, readable (Arial, Calibri, or similar)
- **Size:** Minimum 24pt for body text

### Visual Elements:
- Use screenshots of the actual app
- Include flowcharts for architecture
- Add icons for features
- Use consistent color scheme
- Keep slides uncluttered

### Slide Structure:
- One main idea per slide
- Bullet points (not paragraphs)
- Visual aids (images, diagrams)
- Consistent formatting
- Clear headings

---

## 📋 PRESENTATION CHECKLIST

### Before Presentation:
- [ ] Review all slides
- [ ] Practice demo flow
- [ ] Prepare backup screenshots
- [ ] Test app one more time
- [ ] Review Q&A section
- [ ] Check all links work
- [ ] Print handouts (optional)
- [ ] Prepare backup plan if demo fails

### During Presentation:
- [ ] Speak clearly and confidently
- [ ] Make eye contact
- [ ] Use simple language
- [ ] Show enthusiasm
- [ ] Manage time well
- [ ] Be ready for questions

### After Presentation:
- [ ] Thank the audience
- [ ] Collect feedback
- [ ] Note improvements
- [ ] Celebrate success!

---

**Good luck with your presentation! 🍳✨**

*Use this content as a guide. Customize it to fit your presentation style and time constraints.*

