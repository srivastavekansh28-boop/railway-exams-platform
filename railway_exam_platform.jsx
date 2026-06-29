import React, { useState, useEffect } from 'react';
import './styles.css';

// Sample data with 100 questions per paper
const generateSamplePaper = (paperId) => {
  const topics = ['General Awareness', 'Mathematics', 'Reasoning', 'Science'];
  const questions = [];
  
  for (let i = 1; i <= 100; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    questions.push({
      id: i,
      question: `${topic} Question ${i}: What is the capital of a country related to this topic?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: Math.floor(Math.random() * 4),
      topic: topic
    });
  }
  
  return {
    id: paperId,
    title: `Sample Paper ${paperId}`,
    totalQuestions: 100,
    questions: questions,
    duration: 90 // 1:30 hours in minutes
  };
};

// Initialize sample papers (6 papers)
const initializeSamplePapers = () => {
  const papers = [];
  for (let i = 1; i <= 6; i++) {
    papers.push(generateSamplePaper(i));
  }
  return papers;
};

// Database simulation with localStorage
const Database = {
  getSamplePapers: () => {
    const stored = localStorage.getItem('samplePapers');
    return stored ? JSON.parse(stored) : initializeSamplePapers();
  },
  
  saveSamplePapers: (papers) => {
    localStorage.setItem('samplePapers', JSON.stringify(papers));
  },
  
  getStudents: () => {
    const stored = localStorage.getItem('students');
    return stored ? JSON.parse(stored) : {};
  },
  
  saveStudent: (email, studentData) => {
    const students = Database.getStudents();
    students[email] = studentData;
    localStorage.setItem('students', JSON.stringify(students));
  },
  
  getStudent: (email) => {
    const students = Database.getStudents();
    return students[email] || null;
  },
  
  saveAttempt: (email, paperId, answers, score, totalMarks) => {
    const student = Database.getStudent(email);
    if (student) {
      if (!student.attempts) student.attempts = [];
      student.attempts.push({
        paperId,
        answers,
        score,
        totalMarks,
        completedMarks: score,
        attemptDate: new Date().toLocaleDateString()
      });
      Database.saveStudent(email, student);
    }
  },
  
  getAdminStats: () => {
    const students = Database.getStudents();
    let totalLogins = 0;
    let totalAttempts = 0;
    let studentStats = [];
    
    Object.entries(students).forEach(([email, student]) => {
      totalLogins++;
      const attempts = student.attempts || [];
      totalAttempts += attempts.length;
      
      let totalScore = 0;
      attempts.forEach(attempt => {
        totalScore += attempt.score;
      });
      
      studentStats.push({
        email: student.name || email,
        attempts: attempts.length,
        totalScore: totalScore,
        averageScore: attempts.length > 0 ? (totalScore / attempts.length).toFixed(2) : 0
      });
    });
    
    return {
      totalStudents: totalLogins,
      totalAttempts,
      totalPapers: 6,
      studentStats
    };
  }
};

// Login Component
const Login = ({ onLogin, userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    if (userType === 'admin') {
      if (email === 'admin@railway.com' && password === 'admin123') {
        onLogin(userType, 'Admin User');
        localStorage.setItem('currentUser', JSON.stringify({ type: userType, name: 'Admin User', email }));
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // Student login
      let student = Database.getStudent(email);
      if (!student) {
        student = {
          name: email.split('@')[0],
          email: email,
          loginCount: 1,
          attempts: []
        };
      } else {
        student.loginCount = (student.loginCount || 0) + 1;
      }
      Database.saveStudent(email, student);
      onLogin(userType, student.name, email);
      localStorage.setItem('currentUser', JSON.stringify({ type: userType, name: student.name, email }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🚂 Railway Exam Platform</h1>
        <h2>{userType === 'admin' ? 'Admin Login' : 'Student Login'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'admin' ? 'admin@railway.com' : 'Enter your email'}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={userType === 'admin' ? 'admin123' : 'Enter password'}
            />
          </div>
          
          <button type="submit" className="btn-primary">
            {userType === 'admin' ? 'Admin Login' : 'Student Login'}
          </button>
        </form>

        {userType === 'admin' && (
          <p className="hint">Demo: admin@railway.com / admin123</p>
        )}
      </div>
    </div>
  );
};

// Student Dashboard
const StudentDashboard = ({ student, email, onLogout }) => {
  const [activeTab, setActiveTab] = useState('papers');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [solving, setSolving] = useState(false);
  const samplePapers = Database.getSamplePapers();
  const studentData = Database.getStudent(email);

  const handleStartPaper = (paper) => {
    setSelectedPaper(paper);
    setSolving(true);
  };

  return (
    <div className="dashboard student-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚂 Student Dashboard</h1>
          <p>Welcome, {student}</p>
        </div>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </header>

      {!solving ? (
        <>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'papers' ? 'active' : ''}`}
              onClick={() => setActiveTab('papers')}
            >
              📝 Available Papers ({samplePapers.length})
            </button>
            <button 
              className={`tab ${activeTab === 'scores' ? 'active' : ''}`}
              onClick={() => setActiveTab('scores')}
            >
              📊 My Scores ({studentData?.attempts?.length || 0})
            </button>
          </div>

          {activeTab === 'papers' && (
            <div className="papers-section">
              <h2>Available Sample Papers</h2>
              <div className="papers-grid">
                {samplePapers.map((paper) => {
                  const attempted = studentData?.attempts?.find(a => a.paperId === paper.id);
                  return (
                    <div key={paper.id} className="paper-card">
                      <h3>{paper.title}</h3>
                      <div className="paper-info">
                        <p>❓ Questions: {paper.totalQuestions}</p>
                        <p>⏱️ Duration: {paper.duration} minutes</p>
                        <p>📊 Marking: +4 for correct, -1 for wrong</p>
                        {attempted && (
                          <div className="attempted-info">
                            <p className="score">✅ Score: {attempted.score}/{attempted.totalMarks}</p>
                            <p className="date">Attempted: {attempted.attemptDate}</p>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleStartPaper(paper)}
                        className="btn-primary"
                      >
                        {attempted ? 'Attempt Again' : 'Start Solving'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'scores' && (
            <div className="scores-section">
              <h2>Your Performance</h2>
              {studentData?.attempts && studentData.attempts.length > 0 ? (
                <table className="scores-table">
                  <thead>
                    <tr>
                      <th>Paper</th>
                      <th>Score</th>
                      <th>Total Marks</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.attempts.map((attempt, idx) => (
                      <tr key={idx}>
                        <td>Sample Paper {attempt.paperId}</td>
                        <td className="score">{attempt.score}</td>
                        <td>{attempt.totalMarks}</td>
                        <td>{((attempt.score / attempt.totalMarks) * 100).toFixed(1)}%</td>
                        <td>{attempt.attemptDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No attempts yet. Start solving papers!</p>
              )}
            </div>
          )}
        </>
      ) : (
        <ExamSolver 
          paper={selectedPaper} 
          studentEmail={email}
          onComplete={() => {
            setSolving(false);
            setSelectedPaper(null);
          }}
        />
      )}
    </div>
  );
};

// Exam Solver Component
const ExamSolver = ({ paper, studentEmail, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(paper.duration * 60); // in seconds
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitPaper();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleSubmitPaper = () => {
    let totalScore = 0;
    paper.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        if (answers[idx] === q.correctAnswer) {
          totalScore += 4;
        } else {
          totalScore -= 1;
        }
      }
    });

    const totalMarks = paper.questions.length * 4;
    setScore(totalScore);
    Database.saveAttempt(studentEmail, paper.id, answers, totalScore, totalMarks);
    setShowResults(true);
  };

  if (showResults) {
    const totalMarks = paper.questions.length * 4;
    const percentage = ((score / totalMarks) * 100).toFixed(1);
    const correctAnswers = Object.entries(answers).filter(([idx, ans]) => {
      return ans === paper.questions[parseInt(idx)].correctAnswer;
    }).length;

    return (
      <div className="results-container">
        <div className="results-box">
          <h2>📊 Exam Completed!</h2>
          
          <div className="results-summary">
            <div className="result-card">
              <h3>Your Score</h3>
              <p className="big-score">{score}/{totalMarks}</p>
            </div>
            
            <div className="result-card">
              <h3>Percentage</h3>
              <p className="big-score">{percentage}%</p>
            </div>
            
            <div className="result-card">
              <h3>Correct Answers</h3>
              <p className="big-score">{correctAnswers}/100</p>
            </div>
            
            <div className="result-card">
              <h3>Wrong Answers</h3>
              <p className="big-score">{100 - correctAnswers}/100</p>
            </div>
          </div>

          <h3>Question Wise Analysis</h3>
          <div className="analysis-box">
            {paper.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={idx} className={`question-review ${isCorrect ? 'correct' : 'wrong'}`}>
                  <h4>Question {idx + 1}</h4>
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>Your Answer:</strong> {userAnswer !== undefined ? q.options[userAnswer] : 'Not Answered'}</p>
                  <p><strong>Correct Answer:</strong> {q.options[q.correctAnswer]}</p>
                  <p className="marks">
                    {userAnswer !== undefined ? (isCorrect ? '+4 Marks' : '-1 Mark') : '0 Marks'}
                  </p>
                </div>
              );
            })}
          </div>

          <button onClick={onComplete} className="btn-primary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const question = paper.questions[currentQuestion];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="exam-info">
          <h2>{paper.title}</h2>
          <p>Question {currentQuestion + 1}/{paper.questions.length}</p>
        </div>
        <div className={`timer ${timeLeft < 600 ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <button onClick={handleSubmitPaper} className="btn-submit">Submit Paper</button>
      </div>

      <div className="exam-body">
        <div className="question-section">
          <h3>{question.question}</h3>
          
          <div className="options">
            {question.options.map((option, idx) => (
              <label key={idx} className={`option ${answers[currentQuestion] === idx ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="answer"
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleSelectAnswer(idx)}
                />
                <span>{String.fromCharCode(65 + idx)}) {option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="navigation">
          <button 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-nav"
          >
            ← Previous
          </button>

          <div className="question-tracker">
            {paper.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`tracker-btn ${answers[idx] !== undefined ? 'answered' : ''} ${currentQuestion === idx ? 'current' : ''}`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentQuestion(Math.min(paper.questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === paper.questions.length - 1}
            className="btn-nav"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = Database.getAdminStats();
  const samplePapers = Database.getSamplePapers();

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚂 Admin Dashboard</h1>
          <p>Railway Exam Platform Management</p>
        </div>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Student Performance
        </button>
        <button 
          className={`tab ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          📝 Sample Papers
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-section">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="stat-value">{stats.totalStudents}</p>
              <p className="stat-label">Logged In</p>
            </div>

            <div className="stat-card">
              <h3>Total Attempts</h3>
              <p className="stat-value">{stats.totalAttempts}</p>
              <p className="stat-label">Sample Papers Solved</p>
            </div>

            <div className="stat-card">
              <h3>Available Papers</h3>
              <p className="stat-value">{stats.totalPapers}</p>
              <p className="stat-label">Sample Papers</p>
            </div>

            <div className="stat-card">
              <h3>Avg Attempts/Student</h3>
              <p className="stat-value">
                {stats.totalStudents > 0 ? (stats.totalAttempts / stats.totalStudents).toFixed(1) : 0}
              </p>
              <p className="stat-label">Per Student</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="students-section">
          <h2>Student Performance Details</h2>
          {stats.studentStats.length > 0 ? (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Papers Attempted</th>
                  <th>Total Score</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.studentStats.map((student, idx) => (
                  <tr key={idx}>
                    <td>{student.email}</td>
                    <td className="attempts">{student.attempts}</td>
                    <td className="score">{student.totalScore}</td>
                    <td className="average">{student.averageScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No students have attempted papers yet.</p>
          )}
        </div>
      )}

      {activeTab === 'papers' && (
        <div className="papers-section">
          <h2>Sample Papers Management</h2>
          <div className="papers-info">
            <p>Total Sample Papers: <strong>{samplePapers.length}</strong></p>
            <p>Questions per Paper: <strong>100</strong></p>
            <p>Marking: <strong>+4 for correct, -1 for wrong</strong></p>
            <p>Duration: <strong>1 hour 30 minutes</strong></p>
          </div>
          
          <h3>Paper Details</h3>
          <div className="papers-list">
            {samplePapers.map((paper) => (
              <div key={paper.id} className="paper-detail">
                <h4>{paper.title}</h4>
                <p>Total Questions: {paper.totalQuestions}</p>
                <p>Duration: {paper.duration} minutes</p>
                <p>Max Marks: {paper.totalQuestions * 4}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function RailwayExamPlatform() {
  const [currentScreen, setCurrentScreen] = useState('landingPage');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize sample papers in localStorage if not present
    if (!localStorage.getItem('samplePapers')) {
      Database.saveSamplePapers(initializeSamplePapers());
    }

    // Check if user was logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.type === 'admin') {
        setUser(parsedUser);
        setCurrentScreen('adminDashboard');
      } else {
        setUser(parsedUser);
        setCurrentScreen('studentDashboard');
      }
    }
  }, []);

  const handleLogin = (userType, userName, email = null) => {
    setUser({ type: userType, name: userName, email });
    if (userType === 'admin') {
      setCurrentScreen('adminDashboard');
    } else {
      setCurrentScreen('studentDashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentScreen('landingPage');
  };

  if (currentScreen === 'landingPage') {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <h1>🚂 Railway Exam Question Bank</h1>
          <p className="tagline">Prepare for Railway Exams with Our Comprehensive Question Bank</p>
          
          <div className="features">
            <div className="feature">
              <span className="icon">📚</span>
              <h3>100+ Questions</h3>
              <p>Multiple sample papers with diverse topics</p>
            </div>
            <div className="feature">
              <span className="icon">⏱️</span>
              <h3>Timed Tests</h3>
              <p>1 hour 30 minute duration per paper</p>
            </div>
            <div className="feature">
              <span className="icon">📊</span>
              <h3>Detailed Analytics</h3>
              <p>Track your progress and performance</p>
            </div>
          </div>

          <div className="login-buttons">
            <button 
              onClick={() => setCurrentScreen('studentLogin')}
              className="btn-primary btn-large"
            >
              Student Login
            </button>
            <button 
              onClick={() => setCurrentScreen('adminLogin')}
              className="btn-secondary btn-large"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'studentLogin') {
    return (
      <Login 
        onLogin={handleLogin} 
        userType="student"
      />
    );
  }

  if (currentScreen === 'adminLogin') {
    return (
      <Login 
        onLogin={handleLogin} 
        userType="admin"
      />
    );
  }

  if (currentScreen === 'studentDashboard' && user) {
    return (
      <StudentDashboard 
        student={user.name}
        email={user.email}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'adminDashboard' && user) {
    return (
      <AdminDashboard 
        onLogout={handleLogout}
      />
    );
  }
}
