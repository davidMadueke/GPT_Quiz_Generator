import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/quiz";
import { NextResponse } from "next/server";
import z from 'zod';
import stringSimilarity from "string-similarity-js";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json()
        const {questionId, userAnswer} = checkAnswerSchema.parse(body)
        const question = await prisma.question.findUnique({
            where: {id: questionId},
        })

        if(!question) {
            return NextResponse.json({error: "Question not found"}, {status: 404})
        }

        await prisma.question.update({
            where: {id: questionId},
            data:{
                userAnswer: userAnswer
            }
        })

        if(question.questionType === 'mcq'){
            const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
            await prisma.question.update({
                where: {id: questionId},
                data:{
                    isCorrect: isCorrect
                }
            })
            return NextResponse.json({isCorrect}, {status: 200})
        } else if (question.questionType === 'open_ended'){

            // console.log('question.answer: ' + question.answer)

            const answerKeywords = question.answer.toLowerCase().trim().split(' ')
            const userAnswerKeywords = userAnswer.toLowerCase().trim().split(' ')

             // Getting elements in answerKeywords but not in userAnswerKeywords
            const difference1 = answerKeywords.filter(
            (element) => !userAnswerKeywords.includes(element)).join(' ');

            // Getting elements in userAnswerKeywords but not in answerKeywords
            const difference2 = userAnswerKeywords.filter(
            (element) => !answerKeywords.includes(element)).join(' ');

            let percentageSimilar = stringSimilarity(difference1, difference2)

            // If both difference1 and difference2 are empty, then the answers are the same
            if (difference1 === '' && difference2 === '') {percentageSimilar = 1}
            // If both difference1 and difference2 have 1 word, then the answers are at least 50% similar
            else if (difference1.split(' ').length === 1 && difference2.split(' ').length === 1) {percentageSimilar = 0.5 + (percentageSimilar / 2)}

            percentageSimilar = Math.round(percentageSimilar * 100)

            // console.log('difference 1' + difference1)
            // console.log('difference 2' + difference2)

            await prisma.question.update({
                where: {id: questionId},
                data:{
                    percentageCorrect: percentageSimilar
                }
            })
            return NextResponse.json({percentageSimilar}, {status: 200})
        }
    } catch (error) {
        if(error instanceof z.ZodError) {
            return NextResponse.json({error: error.issues}, {status: 400})
        }
    }
}