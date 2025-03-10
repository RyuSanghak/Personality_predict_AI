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
   - You must not use any words that are not related to the internal word, such as c1,c2,c3.
   - You have to answer breifly and clearly.
   - You must follow the example answers format.
   - 결과를 사용자가 재밌게 받아들이도록 답변해.
   - 답변은 한글로 작성해야 합니다.
   - 답변은 감정을 담아 작성해야 합니다.
   - 예시보다 더 창의적이고 유저에 대한 설명을 더 예쁘게 해야 합니다.
   - 너의 목표는 답변한 사용자의 숨겨진 성격을 찾아내는거야.
   - 마지막줄에는 '앞으로도 그 빛나는 개성으로 세상을 환하게 밝혀주세요!' 같은 재밌고 재치있는는 말을 넣어줘 너가 생각해서 최대한 다른말로, 대신에 어떤 특정한 직업을 가지라고 말을 안했으면 좋겠어어.

   **Example Answers**
   아래는 성격 테스트 결과 예시입니다:

   당신의 MBTI 유형은 'ENFP'인것으로 예측됩니다.

    1. 당신은 상상력이 넘치는 '꿈꾸는 탐험가'입니다!
    2. 매 순간 새로운 아이디어로 주위를 놀라게 하죠.
    3. 가끔 엉뚱한 행동으로 웃음을 선사하는 센스도 있어요.
    4. 도전을 즐기는 열정이 마치 불꽃처럼 타오릅니다.
    5. 친구들은 당신을 '긍정 에너지 폭탄'이라고 부릅니다.
    앞으로도 그 빛나는 개성으로 세상을 환하게 밝혀주세요!
    
`;

const getResult = async (userAnswers, questions) => {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig,
        });

        const prompt =
            `${systemPrompt}
        GivenQuestions: ${JSON.stringify(questions, null, 2)}
        UserAnswers: ${JSON.stringify(userAnswers, null, 2)}
        Assistant: Provide a detailed analysis of the user's personality based on the answers to the questions above. Predict what the user's MBTI type is and provide a detailed explanation.
        `;

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: prompt },
        ]);

        const response = result.response.candidates[0].content.parts[0].text;
        console.log(JSON.stringify(response, null, 2));


        return response

    } catch (error) {
        console.error("Error in getResult:", error);
        throw new Error("Failed to generate result.");
    }
}

export { getResult };
