import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, RotateCw } from 'lucide-react';
import apiService from '../../../lib/api/api.service';

interface FeedbackStepProps {
  questions: string[];
  answers: Record<string, string>;
  onRetake: () => void;
}

interface FeedbackData {
  strengths: string[];
  improvements: string[];
  overallAssessment: string;
  score: number;
}

const FeedbackStep: React.FC<FeedbackStepProps> = ({ questions, answers, onRetake }) => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get feedback from API based on answers
    getFeedbackFromAPI();
  }, []);

  const getFeedbackFromAPI = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Format the interview data for the API
      const interviewData = {
        questions,
        answers: Object.values(answers),
      };

      // Call API to analyze responses
      const result = await apiService.feedback.analyze(interviewData);
      
      if (result.success) {
        setFeedback(result.data);
      } else {
        console.error('Failed to get feedback:', result);
        setError('Failed to analyze your responses. Using local analysis instead.');
        
        // Fallback to local analysis if API fails
        generateLocalFeedback();
      }
    } catch (err) {
      console.error('Error getting feedback:', err);
      setError('Error analyzing responses. Using local analysis instead.');
      
      // Fallback to local analysis if API fails
      generateLocalFeedback();
    } finally {
      setIsLoading(false);
    }
  };

  // Local fallback for feedback generation if API fails
  const generateLocalFeedback = () => {
    try {
      // Analyze the responses
      const strengths = analyzeStrengths(answers);
      const improvements = analyzeImprovements(answers);
      const overallAssessment = generateOverallAssessment(answers, strengths?.length || 0, improvements?.length || 0);
      const score = calculateScore(answers, questions?.length || 0);

      setFeedback({
        strengths: strengths || [],
        improvements: improvements || [],
        overallAssessment: overallAssessment || "No assessment available.",
        score: score || 0
      });
    } catch (error) {
      console.error('Error generating local feedback:', error);
      setError('Error generating local feedback. Please try again.');
      
      // Set default feedback
      setFeedback({
        strengths: ['Answered all interview questions'],
        improvements: ['Continue practicing to improve your responses'],
        overallAssessment: 'Thank you for participating in the practice interview.',
        score: 50
      });
    }
  };

  // Analyze strengths in responses (local fallback)
  const analyzeStrengths = (answers: Record<string, string>): string[] => {
    const strengths = [];
    
    // Check for detailed responses (more than 100 characters)
    if (Object.values(answers).some(answer => answer.length > 100)) {
      strengths.push('Detailed and complete responses');
    }
    
    // Check for specific examples
    if (Object.values(answers).some(answer => 
      answer.toLowerCase().includes('example') || 
      answer.toLowerCase().includes('project') || 
      answer.toLowerCase().includes('case')
    )) {
      strengths.push('Provided concrete examples');
    }
    
    // Check for technical terms
    if (Object.values(answers).some(answer => 
      answer.toLowerCase().includes('technology') || 
      answer.toLowerCase().includes('method') || 
      answer.toLowerCase().includes('framework')
    )) {
      strengths.push('Good use of technical terminology');
    }
    
    // Check for STAR structure (Situation, Task, Action, Result)
    if (Object.values(answers).some(answer => 
      answer.toLowerCase().includes('situation') || 
      answer.toLowerCase().includes('problem') || 
      answer.toLowerCase().includes('action') || 
      answer.toLowerCase().includes('result') || 
      answer.toLowerCase().includes('solution')
    )) {
      strengths.push('Clear structure of responses (STAR method)');
    }
    
    // Check for teamwork mentions
    if (Object.values(answers).some(answer => 
      answer.toLowerCase().includes('team') || 
      answer.toLowerCase().includes('collaboration') || 
      answer.toLowerCase().includes('partnership')
    )) {
      strengths.push('Good focus on teamwork and collaboration');
    }

    // If no strengths found, add a generic one
    if (strengths.length === 0) {
      strengths.push('Ability to answer all questions');
      strengths.push('Direct and simple communication');
    }
    
    return strengths;
  };

  // Analyze areas for improvement (local fallback)
  const analyzeImprovements = (answers: Record<string, string>): string[] => {
    const improvements = [];
    
    // Check for very short responses (less than 50 characters)
    if (Object.values(answers).some(answer => answer.length < 50)) {
      improvements.push('Elaborate more on some of your answers with more details');
    }
    
    // Check for lack of examples
    if (!Object.values(answers).some(answer => 
      answer.toLowerCase().includes('example') || 
      answer.toLowerCase().includes('project') || 
      answer.toLowerCase().includes('case')
    )) {
      improvements.push('Include specific examples from previous experiences');
    }
    
    // Check for lack of metrics
    if (!Object.values(answers).some(answer => 
      answer.includes('%') || 
      answer.toLowerCase().includes('percentage') || 
      /\d+(\.\d+)?/.test(answer) || 
      answer.toLowerCase().includes('metric')
    )) {
      improvements.push('Add metrics and quantitative data');
    }
    
    // Check for lack of result mentions
    if (!Object.values(answers).some(answer => 
      answer.toLowerCase().includes('resulted') || 
      answer.toLowerCase().includes('impact') || 
      answer.toLowerCase().includes('consequence') || 
      answer.toLowerCase().includes('outcome')
    )) {
      improvements.push('Emphasize more on the results and impact of your actions');
    }
    
    // Check for lack of technical terminology
    if (!Object.values(answers).some(answer => 
      answer.toLowerCase().includes('technology') || 
      answer.toLowerCase().includes('technique') || 
      answer.toLowerCase().includes('method') || 
      answer.toLowerCase().includes('framework')
    )) {
      improvements.push('Incorporate more relevant technical terminology');
    }

    // If no improvements found, add a generic one
    if (improvements.length === 0) {
      improvements.push('Consider structuring answers using the STAR method');
      improvements.push('Mention more measurable achievements');
    }
    
    return improvements;
  };

  // Generate overall assessment (local fallback)
  const generateOverallAssessment = (answers: Record<string, string>, strengthCount: number, improvementCount: number): string => {
    const avgLength = Object.values(answers).reduce((sum, answer) => sum + answer.length, 0) / Object.values(answers).length;
    
    // Determine assessment type based on analysis
    if (avgLength > 150 && strengthCount > improvementCount) {
      return 'Your responses demonstrate good communication skills and a solid understanding of your role. The use of specific examples and clear structure are strengths. Continue focusing on quantifying your achievements to make your answers even more impactful.';
    } else if (avgLength > 100) {
      return 'Your responses demonstrate knowledge of the subject, but could benefit from more details and concrete examples. Consider using the STAR method (Situation, Task, Action, Result) to structure your answers. This will help clearly demonstrate how you approach professional challenges.';
    } else {
      return 'Your responses provide a foundation, but need to be expanded with more details, specific examples, and measurable results. Try to demonstrate your experience and skills with concrete examples from previous projects or situations you faced at work.';
    }
  };

  // Calculate overall score (local fallback)
  const calculateScore = (answers: Record<string, string>, questionCount: number): number => {
    // Verificar se há questões
    if (!questionCount) {
      return 0;
    }
    
    // Scoring criteria
    let score = 0;
    
    // Check completeness of answers
    const answeredQuestions = Object.keys(answers).length;
    score += (answeredQuestions / questionCount) * 100 * 0.5; // 50% of score for answering all questions
    
    // Check average length of responses (ideal between 100-200 characters)
    const avgLength = answeredQuestions > 0 ? Object.values(answers).reduce((sum, answer) => sum + answer.length, 0) / answeredQuestions : 0;
    const lengthScore = Math.min(100, (avgLength / 150) * 100);
    score += lengthScore * 0.3; // 30% of score for appropriate length
    
    // Check for examples and technical terms
    const containsExamples = Object.values(answers).filter(answer => 
      answer.toLowerCase().includes('example') || 
      answer.toLowerCase().includes('project') || 
      answer.toLowerCase().includes('case')
    ).length;
    
    const exampleScore = answeredQuestions > 0 ? (containsExamples / answeredQuestions) * 100 : 0;
    score += exampleScore * 0.2; // 20% of score for using examples
    
    return Math.round(score);
  };

  // Get score message based on score
  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Award className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 5 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Feedback</h2>
        <p className="text-gray-600">Here's how you performed in your practice interview</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <RotateCw className="h-10 w-10 text-indigo-600" />
          </div>
          <p className="mt-4 text-gray-600">Analyzing your responses...</p>
        </div>
      ) : feedback ? (
        <>
          {/* Error message if API failed */}
          {error && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
              <p className="text-sm">{error}</p>
            </div>
          )}
        
          {/* Score */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/70 backdrop-blur-sm shadow-sm rounded-full h-32 w-32 flex flex-col items-center justify-center border-4 border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">{feedback.score}%</div>
              <div className="text-sm text-gray-600">{getScoreMessage(feedback.score)}</div>
            </div>
          </div>
        
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <FeedbackSection
              title="Strengths"
              items={feedback?.strengths || []}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              gradient="from-green-50 to-emerald-50"
              border="border-green-200"
            />
            <FeedbackSection
              title="Areas for Improvement"
              items={feedback?.improvements || []}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
              gradient="from-red-50 to-rose-50"
              border="border-red-200"
            />
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall Assessment</h3>
            <p className="text-gray-600 leading-relaxed">
              {feedback?.overallAssessment || "No assessment available."}
            </p>
          </div>
        </>
      ) : null}

      <div className="flex justify-center">
        <button
          onClick={onRetake}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Retake Interview</span>
        </button>
      </div>
    </div>
  );
};

interface FeedbackSectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  gradient: string;
  border: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, items = [], icon, gradient, border }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-sm border ${border}`}>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-3">
      {Array.isArray(items) && items.length > 0 ? items.map((item, index) => (
        <li key={index} className="flex items-start space-x-2">
          {icon}
          <span className="text-gray-600">{item}</span>
        </li>
      )) : (
        <li className="flex items-start space-x-2">
          {icon}
          <span className="text-gray-600">No information available</span>
        </li>
      )}
    </ul>
  </div>
);

export default FeedbackStep;