import { NextResponse } from "next/server"
import { quizCreationSchema } from "@/schemas/quiz"
import { ZodError } from "zod"
import { strict_output } from "@/lib/gpt"
import { getAuthSession } from "@/lib/nextauth"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/nextauth"

// POST /api/questions
export const POST = async (req: Request, res: Response) => {

    try {
        // This was the original code, but it doesn't work
        
        // const session = await getAuthSession() 
        // if(!session?.user){
        //     return NextResponse.json(
        //         { message: "You must be logged in to create a quiz" },
        //         { status: 401 }
        //     )
        // }

        /* According to NEXTAUTH documentation, this is the correct way to get the session. However as of now, getServerSession does not support route handlers

        const session = await getServerSession(req, res, authOptions)
        if (!session) {
          // Signed in
          return NextResponse.json(
                    { message: "You must be logged in to create a quiz" },
                    { status: 401 }
                )
        } */
        const body = await req.json()
        const { amount, topic, type } = quizCreationSchema.parse(body)
        let questions: any;
        if (type === "open_ended") {
            questions = await strict_output(
                "You are a helpful AI that is able to generate a pair of non-trivial question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
                new Array(amount).fill(`You are to generate a random hard open-ended question about this topic: ${topic}`),
                {
                    question: "question",
                    answer: "answer with max length of 15 words"
                })
        }else if(type === "mcq"){
            questions = await strict_output(
                "You are a helpful AI that is able to generate multiple choice questions and answers, the length of each answer should not exceed 15 words",
                new Array(amount).fill(`You are to generate a random hard multiple choice question about this topic: ${topic}`),
                {
                    question: "question",
                    answer: "Correct answer with max length of 15 words",
                    option1: "First wrong but plausible option with max length of 15 words",
                    option2: "Second wrong but plausible option with max length of 15 words",
                    option3: "Third wrong but plausible option with max length of 15 words",
                }
            )}

        return NextResponse.json(
            { questions },
            { status: 200 })
    }
    catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                message: error.issues
            },

                { status: 400 }

            )
        }
    }
}