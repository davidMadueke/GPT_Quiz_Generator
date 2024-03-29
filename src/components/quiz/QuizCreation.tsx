"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { BookOpen, CopyCheck, Trophy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { quizCreationSchema } from '@/schemas/quiz'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormControl } from '../ui/form'
import { Button} from '../ui/button'
import { Input } from "@/components/ui/input"
import { Separator } from '../ui/separator'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import LoadingQuestions from '../ui/LoadingQuestions'
import { set } from 'date-fns'

type Props = {
    topicParam: string
}

type Input = z.infer<typeof quizCreationSchema>

const QuizCreation = ({topicParam}: Props) => {
    const router = useRouter()
    const [finishedLoading, setFinishedLoading] = React.useState(false)
    const [showLoader, setShowLoader] = React.useState(false)
    const {mutate: getQuestions, isLoading} = useMutation({
        mutationFn: async ({amount, topic, type}: Input) => {
            const response = await axios.post('/api/game', {
                amount,
                topic,
                type
            })
            return response.data
        }
    })
    const form = useForm<Input>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            amount: 3,
            topic: topicParam,
            type: 'mcq',
        }
    })
    form.watch()
    function onSubmit(input: Input) {
        setShowLoader(true)
        getQuestions({
            amount: input.amount,
            topic: input.topic,
            type: input.type
        }, {
            onSuccess: ({gameId}) => {
                setFinishedLoading(true)
                setTimeout(() => {
                    if(form.getValues('type') === 'mcq'){
                        router.push(`/play/mcq/${gameId}`)
                    } else {
                        router.push(`/play/open-ended/${gameId}`)
                    }
                },1000)
            },
            onError: (error) => {
                console.log(error)
                setShowLoader(false)
            }
        })
    }

    if(showLoader){
        return( <LoadingQuestions finishedLoading={finishedLoading}/>)
    }
    return (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0'>
            <div>
            <Card>
                <CardHeader>
                    <div className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='font-bold text-2xl'>
                            Quiz Creator
                        </CardTitle>
                        <Trophy size={28} strokeWidth={2.5} />
                    </div>
                    <CardDescription>
                        Choose a topic and create a quiz
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a topic" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please provide a topic.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Questions</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter an Amount" 
                                            {...field}
                                            type='number'
                                            min={1}
                                            max={10}
                                            onChange={(e) => {
                                                form.setValue('amount', parseInt(e.target.value))
                                            }}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                                <Button
                                type='button'
                                variant={form.getValues('type') === 'mcq' ? 'default' : 'secondary'}
                                onClick={() => {
                                    form.setValue('type', 'mcq')
                                }}
                                >
                                    <CopyCheck className='w-4 h-4 mr-2'/> Multiple Choice
                                </Button>
                                <Separator orientation='vertical' className='ml-2 mr-2'/>
                                <Button
                                type='button'
                                variant={form.getValues('type') === 'open_ended' ? 'default' : 'secondary'}
                                onClick={() => {
                                    form.setValue('type', 'open_ended')
                                }}
                                >
                                    <BookOpen className='w-4 h-4 mr-2'/> Open Ended
                                </Button>
                            </div>
                            <Button disabled={isLoading} type="submit">Submit</Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>
            </div>
        </div>

    )
}

export default QuizCreation