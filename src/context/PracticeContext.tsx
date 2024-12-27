import React, { createContext, useContext, useState } from 'react';

interface PracticeContextType {
  jobType: string;
  requirements: string;
  questions: string[];
  answers: Record<string, string>;
  setJobType: (type: string) => void;
  setRequirements: (reqs: string) => void;
  setQuestions: (questions: string[]) => void;
  setAnswers: (answers: Record<string, string>) => void;
  resetPractice: () => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobType, setJobType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const resetPractice = () => {
    setJobType('');
    setRequirements('');
    setQuestions([]);
    setAnswers({});
  };

  return (
    <PracticeContext.Provider
      value={{
        jobType,
        requirements,
        questions,
        answers,
        setJobType,
        setRequirements,
        setQuestions,
        setAnswers,
        resetPractice,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};