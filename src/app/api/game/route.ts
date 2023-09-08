// /api/game

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function POST(req: Request, res: Response) {
    try {
        const session = await getAuthSession();
        if(!session?.user){
            return NextResponse.json(
                {message: "You must be logged in to create a quiz"},
                {status: 401}
            )
        }
        const body = await req.json();
        const { amount, topic, type } = quizCreationSchema.parse(body);

        const game = await prisma.game.create({
            data: {
                topic,
                timeStarted: new Date(),
                gameType: type,
                userId: session.user.id
            }
        })

        const {data} = await axios.post(`${process.env.API_URL}/api/questions`, {
            amount,
            topic,
            type
        })
        if (type === 'mcq'){
            type mcqQuestion = {
                question: string,
                answer: string,
                option1: string,
                option2: string,
                option3: string
            }
            let manyData = data.questions.map((question: mcqQuestion)=>{
                let options = [question.answer, question.option1, question.option2, question.option3]
                options = options.sort(()=>Math.random()-0.5)
                return {
                    question: question.question,
                    answer: question.answer,
                    answerOptions: JSON.stringify(options),
                    gameId: game.id,
                    questionType: "mcq",
                }
            })
            await prisma.question.createMany({
                data: manyData
            })
        } else if(type === 'open_ended'){
            type openEndedQuestion = {
                question: string,
                answer: string
            }
            let manyData = data.questions.map((question: openEndedQuestion)=>{
                return {
                    question: question.question,
                    answer: question.answer,
                    gameId: game.id,
                    questionType: "open_ended",
                }
            })
            await prisma.question.createMany({
                data: manyData
            })
        }
        return NextResponse.json({gameId: game.id})
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                message: error.issues
            },

                { status: 400 }

            )
        }
        return NextResponse.json({
            message: console.log(error) //'Whoops! Something went wrong.'
        },
            { status: 500 }
        )
    }
}