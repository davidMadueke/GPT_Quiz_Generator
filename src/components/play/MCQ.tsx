"use client"
import { Game, Question } from '.prisma/client'
import { ArrowRightCircle, BarChart4, Loader2, Timer } from 'lucide-react'
import React, { useMemo } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button, buttonVariants } from '../ui/button'
import MCQCounter from '../ui/MCQCounter'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/quiz'
import { useToast } from '../ui/use-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
    game: Game & {questions: Pick<Question, 'id'| 'answerOptions' | 'question'>[]}
}

const MCQ = ({ game }: Props) => {
    const {toast} = useToast()

    const [correctAnswers, setCorrectAnswers] = React.useState<number>(0)
    const [incorrectAnswers, setIncorrectAnswers] = React.useState<number>(0)

    const [questionIndex, setQuestionIndex] = React.useState(0)
    const [selectedOption, setSelectedOption] = React.useState<number>(0)

    const [isEnded, setIsEnded] = React.useState(false)
    
    const currentQuestion = React.useMemo(() => {
        return game.questions[questionIndex]
    }, [game.questions, questionIndex])
    
    const options = React.useMemo(() => {
        if(!currentQuestion) return []
        if(!currentQuestion.answerOptions) return []
        return JSON.parse(currentQuestion.answerOptions as string) as string[]
    }, [currentQuestion])

    const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
        mutationFn: async () => {
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: currentQuestion?.id as string,
                userAnswer: options[selectedOption],
            };
            const response = await axios.post('/api/checkAnswer', payload);
            return response.data
        },
    })

    const handleNext = React.useCallback(() => {
        if(isChecking) return
        checkAnswer(undefined,{
            onSuccess: ({isCorrect}) => {
                if(isCorrect) {
                    setCorrectAnswers((prev) => prev + 1)
                    toast({
                        title: 'Correct Answer!',
                        description: 'You got the correct answer!',
                        variant: 'success',
                    })
                } else {
                    setIncorrectAnswers((prev) => prev + 1)
                    toast({
                        title: 'Incorrect Answer!',
                        description: 'You got the incorrect answer!',
                        variant: 'destructive',
                    })
                }
                if (questionIndex === game.questions.length - 1) {
                    setIsEnded(true) 
                    return
                }
                setQuestionIndex((prev) => prev + 1)
            }
        })
    }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === '1') {
                setSelectedOption(0)
            }
            else if(event.key === '2') {
                setSelectedOption(1)
            }
            else if(event.key === '3') {
                setSelectedOption(2)
            }
            else if(event.key === '4') {
                setSelectedOption(3)
            }
            else if(event.key === 'Enter') {
                handleNext()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {document.removeEventListener('keydown', () => {})}
    }, [handleNext])

    if(isEnded) {
        return (
        <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
                You have completed this quiz in {'00:00'} minutes!
            </div>
            <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
            View Statistics
            <BarChart4 className='w-4 h-4 ml-2'/>
            </Link>
        </div>
        )
    }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-4-xl w-[90vw]">
        <div className="flex flex-row justify-between mb-2">
            {/* Topic */}
            <div className="flex flex-col">
            <p>
                <span className='text-slate-400'>Topic:</span>
                <span className='px-2 py-1 text-white rounded-lg bg-slate-800 ml-2'>{game.topic}</span>
            </p>
            <div className="flex self-start  text-slate-400 mt-2">
                <Timer className='mr-2 '/>
                <span>00:00</span>
            </div>
            </div>

            <MCQCounter correct={correctAnswers} incorrect={incorrectAnswers}/>
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

        <div className='flex flex-col items-center justify-center w-full mt-4'>
            {/* AnswerOptions */}
            {options.map((option, index) => {
                return (
                    <Button 
                    key={index} 
                    className='justify-start w-full py-8 mb-4'
                    variant={selectedOption === index ? 'default' : 'secondary'}
                    onClick={() => {setSelectedOption(index)}} >

                        <div className='flex items-center justify-start'>
                            <div className="p-2 px-3 mr-5 border rounder-md">
                                {index + 1}
                            </div>
                            <div className="text-start"> {option}</div>
                        </div>
                    </Button>
                )
            })}
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

export default MCQ