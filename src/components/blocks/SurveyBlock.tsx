import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';

const SurveyContainer = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const SurveyTitle = styled.input`
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const QuestionContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const QuestionInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const OptionInput = styled.input`
  width: calc(100% - 40px);
  padding: 0.5rem;
  margin: 0.25rem 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem 0;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
  
  &:hover {
    background-color: #dc2626;
  }
`;

interface SurveyData {
  title: string;
  questions: {
    question: string;
    options: string[];
  }[];
}

const SurveyBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(
    content ? JSON.parse(content) : { title: '', questions: [] }
  );

  const handleTitleChange = (title: string) => {
    const newData = { ...surveyData, title };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const handleQuestionChange = (index: number, question: string) => {
    const newQuestions = [...surveyData.questions];
    newQuestions[index] = { ...newQuestions[index], question };
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, option: string) => {
    const newQuestions = [...surveyData.questions];
    newQuestions[questionIndex].options[optionIndex] = option;
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const addQuestion = () => {
    const newQuestions = [...surveyData.questions, { question: '', options: [''] }];
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const removeQuestion = (index: number) => {
    const newQuestions = surveyData.questions.filter((_, i) => i !== index);
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...surveyData.questions];
    newQuestions[questionIndex].options.push('');
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...surveyData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    const newData = { ...surveyData, questions: newQuestions };
    setSurveyData(newData);
    onUpdate(id, JSON.stringify(newData));
  };

  return (
    <SurveyContainer>
      <SurveyTitle
        value={surveyData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Enter survey title..."
      />
      {surveyData.questions.map((question, questionIndex) => (
        <QuestionContainer key={questionIndex}>
          <QuestionInput
            value={question.question}
            onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
            placeholder="Enter question..."
          />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} style={{ display: 'flex', alignItems: 'center' }}>
              <OptionInput
                value={option}
                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                placeholder="Enter option..."
              />
              <RemoveButton onClick={() => removeOption(questionIndex, optionIndex)}>
                ×
              </RemoveButton>
            </div>
          ))}
          <AddButton onClick={() => addOption(questionIndex)}>Add Option</AddButton>
          <RemoveButton onClick={() => removeQuestion(questionIndex)}>Remove Question</RemoveButton>
        </QuestionContainer>
      ))}
      <AddButton onClick={addQuestion}>Add Question</AddButton>
    </SurveyContainer>
  );
};

export default SurveyBlock; 