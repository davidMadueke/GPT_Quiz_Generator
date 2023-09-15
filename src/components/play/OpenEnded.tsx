"use client"
import React from 'react'
import { Game, Question } from '@prisma/client'
import { ArrowRightCircle, BarChart4, Loader2, Timer } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button, buttonVariants } from '../ui/button'
import { cn, formatTimeDelta } from '@/lib/utils'
import { differenceInSeconds } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/quiz'

import { useToast } from '../ui/use-toast'
import BlankAnswerInput from './BlankAnswerInput'
import Link from 'next/link'
import OpenEndedPercentage from '../ui/OpenEndedPercentage'

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'answer' | 'question'>[]}
}

const OpenEnded = ({game}: Props) => {
    const {toast} = useToast()


    const [BlankAnswer, setBlankAnswer] = React.useState<string>(" ")

    const [averagePercentage, setAveragePercentage] = React.useState(0)
    
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const [isEnded, setIsEnded] = React.useState(false)

    const [now, setNow] = React.useState<Date>(new Date())
    React.useEffect(() => {
        const interval = setInterval(() => {
            if(!isEnded){ setNow(new Date()) }
            }, 1000)
            return () => {
                clearInterval(interval)
            }
    }, [isEnded])

    const currentQuestion = React.useMemo(() => {
        return game.questions[questionIndex]
    }, [game.questions, questionIndex])

    const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
        mutationFn: async () => {
            let filledAnswer = BlankAnswer
            document.querySelectorAll('#user-blank-input').forEach((input) => {
                let value = (input as HTMLInputElement).value
                filledAnswer = filledAnswer.replace('________', value)
                value = " "
            })
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: currentQuestion?.id as string,
                userAnswer: filledAnswer,
            };
            const response = await axios.post('/api/checkAnswer', payload);
            return response.data
        },
    })

    const handleNext = React.useCallback(() => {
        if(isChecking) return
        checkAnswer(undefined,{
            onSuccess: ({ percentageSimilar }) => {
                toast({
                    title: 'The Quiz master has spoken!',
                    description: `Your answer was ${percentageSimilar}% similar to the correct answer`,
                })
                setQuestionIndex((prev) => prev + 1)

                setAveragePercentage((prev) => {
                    return (prev + percentageSimilar) / (questionIndex + 1);
                  });

                if (questionIndex === game.questions.length - 1) {
                    setIsEnded(true) 
                    return
                }
            }
        })
    }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Enter') {
                handleNext()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {document.removeEventListener('keydown', () => {})}
    }, [handleNext])

    if(isEnded) {
        return (
        <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
                You have completed this quiz in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}!
            </div>
            <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
            View Statistics
            <BarChart4 className='w-4 h-4 ml-2'/>
            </Link>
        </div>
        )
    }

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-4-xl w-[90vw] z-0">
            <div className="flex flex-row justify-between mb-2">
                {/* Topic */}
                <div className="flex flex-col">
                <p>
                    <span className='text-slate-400'>Topic:</span>
                    <span className='px-2 py-1 text-white rounded-lg bg-slate-800 ml-2'>{game.topic}</span>
                </p>
                <div className="flex self-start  text-slate-400 mt-2">
                    <Timer className='mr-2 '/>
                    <span>
                        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                    </span>
                </div>
                </div>
    
                <OpenEndedPercentage percentage={averagePercentage} />
            </div>
    
            {/* Question */}
            <Card>
                <CardHeader className='flex flex-row items-center'>
                    <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
                        <div>
                            {questionIndex + 1}
                        </div>
                        <div>
                            {game.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className='flex-grow text-lg'>
                        {currentQuestion?.question}
                    </CardDescription>
                </CardHeader>
            </Card>

            <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer} />
    
            <div className='flex flex-col items-center justify-center w-full mt-4'>
                {/* NextButton */}
                <Button 
                className='mt-2'
                onClick={()=>{handleNext()}}   
                disabled={isChecking} >
                    {isChecking && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                    Next <ArrowRightCircle className='ml-2' />
                </Button>
            </div>
        </div>
      )
}

export default OpenEnded