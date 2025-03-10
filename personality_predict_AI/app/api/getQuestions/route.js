
import { getQuestions } from '../../../lib/generateQuestions';

export async function GET(request) {
    try {
        const questionsData = await getQuestions();
        return new Response(JSON.stringify({ data: questionsData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in GET /api/getQuestions:', error);
        return new Response(JSON.stringify({ error: '질문을 가져오는 데 실패했습니다.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}