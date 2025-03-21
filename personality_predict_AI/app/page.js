"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Toggle } from "@/components/ui/toggle"



export default function Home() {
  const [questions, setQuestions] = useState([]); // 질문 상태 관리
  const [loading_getQuestions, setLoading_getQuestions] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [quizPage, setQuizPage] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState({}); // 선택된 선택지 상태 관리
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문 인덱스스
  const [resultPage, setResultPage] = useState(false); // 결과 페이지 on off
  const [resultResponse, setResultResponse] = useState([]); // 결과 텍스트
  const [loading_getResult, setLoading_getResult] = useState(false); // 결과 대기 로딩 화면 on off


  const handleFetchQuestions = async () => {
    setLoading_getQuestions(true);
    setError(null);
    setQuizPage(false);

    try {
      const response = await fetch('/api/getQuestions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json(); // JSON 데이터 파싱
      console.log('Fetched data:', result); // 응답 데이터 콘솔에 출력
      setQuestions(result.data.question);
    } catch (err) {
      setError(err.message); // 에러 상태 업데이트
    } finally {
      setLoading_getQuestions(false); // 로딩 종료
      setQuizPage(true);
    }
  };

  const returnToStart = async () => {
    setQuestions([]);
    setQuizPage(false);
    setResultPage(false);
    setCurrentQuestionIndex(0);
    setSelectedChoices({});
    setResultResponse([]);
  }

  const moveNextQuestion = () => {
    if (!selectedChoices[currentQuestionIndex]) { // 선택지를 선택하지 않았을 경우
      alert("답변을 선택해주세요.");
      return;
    }


    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle end of questions, e.g., submit answers or show results
      console.log('End of questions');
      console.log(selectedChoices);

      const payload = {
        answers: selectedChoices,
        questions: questions
      };
      setLoading_getResult(true);

      fetch('/api/submitAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          setResultResponse(data);
          setLoading_getResult(false);
          setResultPage(true);
          setQuizPage(false);
        })
        .catch((error) => {
          console.error('Error:', error
          );
        });

      // 결과 화면으로 이동
    }
  };


  const handleToggle = (questionIndex, choice) => {
    setSelectedChoices(prevState => ({
      ...prevState,
      [questionIndex]: choice
    }));
  };

  if (loading_getQuestions) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4"> {/* contents 중앙 정렬 */}
        <motion.div layout transition={{ duration: 0.3 }}>
          <Card className="w-[330px] h-[300px]">
            <CardHeader>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <div>인공지능 질문 생성 중...</div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    );
  }
  else if (loading_getResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4"> {/* contents 중앙 정렬 */}
        <motion.div layout transition={{ duration: 0.3 }}>
          <Card className="w-[330px] h-[300px]">
            <CardHeader>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <div>인공지능 결과 생성 중...</div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    );
  }

  else if (quizPage) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <main className="relative flex min-h-screen items-center justify-center bg-gray-100 p-4">

        <Card className="relative w-[400px] h-[500px] overflow-hidden">
          <CardHeader >
            <div>
              <CardContent className="flex justify-center items-center flex-col space-y-4">
                <div>Question {currentQuestionIndex + 1}</div>
                <div>{currentQuestion.question}</div>
                <hr className="my-2" /> {/* Horizontal line */}
                <Toggle
                  className="w-[300px] h-[60px]"
                  variant="outline"
                  aria-label="Choice 1"
                  pressed={selectedChoices[currentQuestionIndex] === 'c1'}
                  onClick={() => handleToggle(currentQuestionIndex, 'c1')}
                >
                  {currentQuestion.c1}
                </Toggle>
                <Toggle
                  className="w-[300px] h-[60px]"
                  variant="outline"
                  aria-label="Choice 2"
                  pressed={selectedChoices[currentQuestionIndex] === 'c2'}
                  onClick={() => handleToggle(currentQuestionIndex, 'c2')}
                >
                  {currentQuestion.c2}
                </Toggle>
                <Toggle
                  className="w-[300px] h-[60px]"
                  variant="outline"
                  aria-label="Choice 3"
                  pressed={selectedChoices[currentQuestionIndex] === 'c3'}
                  onClick={() => handleToggle(currentQuestionIndex, 'c3')}
                >
                  {currentQuestion.c3}
                </Toggle>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={moveNextQuestion}>
                  다음
                </Button>
              </CardFooter>

            </div>
          </CardHeader>
        </Card>
      </main>
    );
  }
  else if (resultPage) {
    return (
      <motion.div layout transition={{ duration: 1.0 }}>
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <Card className="w-[400px] h-[800px]">
            <CardHeader>
              <CardTitle className="text-2xl">AI 성격 테스트 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto" style={{ whiteSpace: "pre-wrap" }}>
                {resultResponse.data}
              </div>

            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={returnToStart}>다시 테스트</Button>
            </CardFooter>
          </Card>
        </main>
      </motion.div>
    );
  }

  else return (
    <motion.div layout transition={{ duration: 1.0 }}>
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-[500px] h-[700px]">
          <CardHeader>
            <CardTitle className="text-2xl geistMono">AI가가 알려주는 나의 숨겨진 성격</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4" >
            <img
              src="/images/pondering_AI.jpg"
              alt="AI_image_startPage"
              className="w-100 h-100 object-contain"
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleFetchQuestions}>질문 생성</Button>
          </CardFooter>
        </Card>
      </main>
    </motion.div>
  );
}



export function CheckboxWithText() {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}