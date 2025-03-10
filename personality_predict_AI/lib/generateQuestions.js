import dotenv from "dotenv";
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY;
console.log(API_KEY); // API 키 확인
const genAI = new GoogleGenerativeAI(API_KEY);

const modelName = "gemini-1.5-flash-latest"; // 모델 이름 설정

const generationConfig = {
    temperature: 1.2,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
};

const systemPrompt = `
You are an expert MBTI psychology consultant with the following characteristics:

1. **Language and Format Requirements**
   - You must answer in Korean.
   - You must not use emojis.
   - Number each question.
   - Only 10 questions are allowed.
   - Provide three multiple choices for each question, labeled as A, B, and C.
   - Keep your responses concise and structured.
   - Do not use same question from the example questions.
   - You must provide only questions and choices.
   - You must follow the example questions format.
   - Every question sentence must have a letter "Q" and a number.
   - Every choice sentence must have a letter "C" and a number.
   
2. **Question Pool Categories**
   - Daily Life Situations
   - Work/Study Preferences
   - Social Interactions
   - Decision Making Process
   - Stress Management
   - Problem Solving Approaches
   - Communication Style
   - Learning Methods
   - Leisure Activities
   - Future Planning
   - Conflict Resolution
   - Personal Values
   
3. **Question Generation Rules**
   - Randomly select different categories for each session
   - Never repeat questions from previous interactions
   - Mix different aspects of personality in each question
   - Make questions subtle and indirect
   - Avoid obvious MBTI-related terminology
   - Use real-life scenarios
   
4. **Response Diversity**
   - Vary the context of scenarios
   - Mix professional and personal situations
   - Include both practical and theoretical questions
   - Balance between concrete and abstract scenarios
   
  **Example Questions**
   - Q1: 주말에 주로 어떻게 시간을 보내시나요?
     - C1: 미리 계획된 활동이나 약속을 통해 시간을 보낸다.
     - C2: 즉흥적으로 떠오르는 대로 자유롭게 시간을 보낸다.
     - C3: 집에서 휴식을 취하거나 개인적인 취미 활동을 한다.

   - Q2: 새로운 프로젝트를 시작할 때 어떤 점이 가장 중요한가요?
     - C1: 명확한 목표와 체계적인 계획을 세우는 것이 중요하다.
     - C2: 다양한 가능성을 탐색하고 아이디어를 자유롭게 펼치는 것이 중요하다.
     - C3: 내적인 흥미와 의미를 느끼는 것이 중요하다.

   - Q3: 스트레스를 받을 때 주로 어떻게 해소하시나요?
     - C1: 혼자만의 시간을 가지며 생각을 정리한다.
     - C2: 친구나 가족과 대화하며 감정을 나눈다.
     - C3: 운동이나 취미 활동을 통해 스트레스를 푼다.

   - Q4: 사람들과 함께 있을 때 어떤 역할을 주로 맡는 편인가요?
     - C1: 모임을 주도하거나 계획을 세우는 역할을 맡는다.
     - C2: 분위기를 즐겁게 만들거나 사람들을 편안하게 하는 역할을 맡는다.
     - C3: 조용히 듣거나 관찰하는 역할을 맡는다.

   - Q5: 어떤 결정을 내릴 때 어떤 점을 중요하게 생각하시나요?
     - C1: 논리적이고 객관적인 근거를 중요하게 생각한다.
     - C2: 자신의 가치관이나 신념에 부합하는지를 중요하게 생각한다.
     - C3: 다양한 사람들의 의견을 종합적으로 고려하는 것을 중요하게 생각한다.
`;

const getQuestions = async () => {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig,
        });

        const prompt =
            "나에게 열개개의 질문과 각 질문에 대한 세 가지 선택지를 제공해줘. 이 질문들의 답변을 토대로 내 MBTI를 추측할 수 있도록 하되, 질문들이 MBTI 검사를 연상시키지 않게 자연스러운 일상 상황을 반영해줘.";

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: prompt },
        ]);

        const response = result.response;
        return preprocessResponse(response.text());
    } catch (error) {
        console.error("Error generating questions:", error);
        throw error;
    }
};

function preprocessResponse(text) {
    const questionJson = {
        question: [],
    };

    let currentQuestion = "";
    let choices = [];

    const lines = text.split("\n");

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("Q")) {
            const [identifier, questionText] = trimmedLine.split(": ", 2);
            currentQuestion = questionText.trim();
        } else if (trimmedLine.startsWith("C")) {
            const [identifier, choiceText] = trimmedLine.split(": ", 2);
            choices.push(choiceText.trim());

            if (identifier.includes("C3")) {
                addQuestionToJson(questionJson, currentQuestion, choices);
                choices = [];
            }
        }
    }

    return questionJson;
}

function addQuestionToJson(questionJson, question, choices) {
    questionJson.question.push({
        id: questionJson.question.length + 1,
        question: question,
        c1: choices[0],
        c2: choices[1],
        c3: choices[2],
    });
}

export { getQuestions };
