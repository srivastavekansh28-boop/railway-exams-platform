# 🚂 Railway Exam Question Bank Platform

Ek comprehensive railway exam preparation platform jo students ko practice karne aur apna progress track karne mein madad karega.

## 🎯 Features

### 📊 Admin Dashboard
- **Platform Statistics**: Kaul students login kiye, kitne attempts kiye, total available papers
- **Student Performance**: Har student ka individual score aur attempts ka detailed view
- **Sample Papers Management**: Sab sample papers ki details like total questions, marks, duration

### 👨‍🎓 Student Dashboard
- **Available Papers**: 6 sample papers available for practice
- **Paper Solving**: 100 questions per paper with 4 options
- **Timer**: 1 hour 30 minutes ka timer har paper ke liye
- **Scoring System**: +4 marks for correct answer, -1 for incorrect
- **Performance Tracking**: Sab attempts ka score aur correct answers dekh sakte ho
- **Detailed Analysis**: Har question ke liye sahi aur galat answers

## 🔐 Login Credentials

### Admin Login
```
Email: admin@railway.com
Password: admin123
```

### Student Login
- Koi bhi email id use kar sakte ho
- First time login automatically student account create ho jayega
- Example: student@example.com
```

## 📋 Website Structure

```
🚂 Railway Exam Platform
├── Landing Page
│   └── Student Login / Admin Login
├── Student Dashboard
│   ├── Available Papers (6 sample papers)
│   ├── Paper Solving Interface
│   │   ├── Timer (1:30 hours)
│   │   ├── Question Navigation
│   │   └── Answer Selection
│   ├── Results Page (with detailed analysis)
│   └── My Scores (attempt history)
└── Admin Dashboard
    ├── Overview (statistics)
    ├── Student Performance (detailed analytics)
    └── Sample Papers (management info)
```

## 🎓 How to Use

### For Students:

1. **Landing Page se "Student Login" click karo**
2. **Apna email enter karo** (koi bhi email chala jayega)
3. **Password enter karo** (koi bhi password)
4. **Available Papers** section mein aapko 6 sample papers milenge
5. **"Start Solving" button par click karo** paper attempt karne ke liye
6. **100 questions hai, har question mein 4 options**
7. **Question navigation bar se jump kar sakte ho**
8. **1:30 hour ka timer display hoga**
9. **Submit button se exam submit karo**
10. **Detailed results dekho** sab correct answers ke saath

### For Admin:

1. **Landing Page se "Admin Login" click karo**
2. **Admin credentials use karo**: admin@railway.com / admin123
3. **Overview Tab**: 
   - Kaul total students aur attempts
   - Available papers count
   - Average attempts per student
4. **Student Performance Tab**: 
   - Har student ka name, attempts, total score
   - Average score per student
5. **Sample Papers Tab**: 
   - Total papers ki count
   - Questions per paper (100)
   - Marking scheme (+4/-1)
   - Duration (90 minutes)

## 📈 Scoring System

```
✅ Correct Answer: +4 marks
❌ Incorrect Answer: -1 mark
⏸️ Not Answered: 0 marks

Total Marks: 100 questions × 4 = 400 marks
```

## 💾 Data Storage

- **localStorage use kiya hai** data storage ke liye
- Sab student data aur attempts automatically save ho jayega
- Browser data clear mat karna nahi toh data delete ho jayega

## 🎨 Features Breakdown

### Question Bank
- 100 questions per sample paper
- 6 sample papers total
- Multiple topics covered:
  - General Awareness
  - Mathematics
  - Reasoning
  - Science

### Timer System
- Automatic timer har exam ke liye
- Time format: Hours:Minutes:Seconds
- Warning when time is running out
- Auto-submit when time expires

### Navigation
- Question tracker with answered/unanswered status
- Previous/Next buttons for navigation
- Jump directly to any question

### Results & Analysis
- Instant results after submission
- Score breakdown
- Percentage calculation
- Question-wise analysis
  - Your answer
  - Correct answer
  - Marks obtained

### Student Tracking
- Attempt history
- Individual scores for each paper
- Performance metrics
- Date of attempts

## 🔧 Technical Stack

- **Frontend**: React.js
- **Styling**: CSS (Gradient & Modern Design)
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Browser localStorage
- **Responsive Design**: Mobile & Desktop compatible

## 📱 Responsive Design

Website sabhi devices pe properly kaam karti hai:
- Desktop
- Tablet  
- Mobile phones

## 🚀 How to Deploy

### Local Development:
1. React create-app setup karo
2. `railway_exam_platform.jsx` copy karo src folder mein
3. `styles.css` ko import karo
4. `npm start` karo

### Production Deployment:
1. Build karo: `npm run build`
2. Hosting service (Vercel, Netlify) par upload karo
3. ya apne backend server par host kar sakte ho

## 📊 Sample Data

Website automatically 6 sample papers generate karta hai har load pe:
- 100 questions per paper
- Random topics
- 4 options per question
- Randomized correct answers

## 🎯 Future Enhancements

Possible add-ons:
- Backend database (MongoDB/Firebase)
- Email notifications
- PDF report generation
- Discussion forum
- Video tutorials
- Previous years papers
- Difficulty levels
- Category-wise filtering

## ⚙️ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📞 Support

Koi bhi issue ho ya query hai toh contact karo.

---

**Happy Learning! 🎓**

Created for Railway Exam Aspirants | 🚂 Railway Exam Platform 2024
