import { getResult } from "@/lib/generateResult";

export async function POST(request) {
    try {
        const { answers, questions } = JSON.parse(await request.text());
        const result = await getResult(answers, questions);
        return new Response(JSON.stringify({ data: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in POST /api/submitAnswers:', error);
        return new Response(JSON.stringify({ error: '답변을 처리하는 데 실패했습니다.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}