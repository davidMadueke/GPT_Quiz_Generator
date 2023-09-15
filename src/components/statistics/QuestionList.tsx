import { Question } from '@prisma/client'
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

type Props = {
    questions: Question[]
}

const QuestionList = ({questions}: Props) => {
    let questionType = questions[0].questionType
  return (
    <Table className='mt-4'>
        <TableCaption>End of Questions.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className='w-[10px]'>No.</TableHead>
                <TableHead className=''>Question & Correct Answer</TableHead>
                <TableHead className=''>Your Answer</TableHead>
                {questionType === 'open_ended' && <TableHead className='w-[10px] text-right'>Accuracy</TableHead>}
                {questionType === 'mcq' && <TableHead className='w-[10px] text-right'>Correct?</TableHead>}
            </TableRow>
        </TableHeader>

        <TableBody>
            <>
            {questions.map((question, index) => {
                return(
                <TableRow key={question.id} className='mt-2 mb-2'>
                    <TableCell className='font-bold'>{index + 1}</TableCell>
                    <TableCell className=''>
                        <div className='font-bold'>{question.question}</div>
                        <br />
                        {/* <br /> */}
                        <span className='opacity-50'>Correct Answer: {question.answer} </span> 
                    </TableCell>
                    {
                        questionType === 'mcq' && (
                        <TableCell className={
                            cn(
                                question.isCorrect ? 'text-green-500' : 'text-red-500'
                            )
                        }>
                            {question.userAnswer}
                        </TableCell>
                    )}
                    {
                        questionType === 'mcq' && (
                        <TableCell className=''>
                            {
                                question.isCorrect ? (
                                    <Check className='w-6 h-6 text-green-500' />
                                ) : (
                                    <X className='w-6 h-6 text-red-500' />
                                )
                            }
                        </TableCell>
                    )}

                    {
                        questionType === 'open_ended' && (
                        <TableCell>
                            {question.userAnswer}
                        </TableCell>
                    )}
                    {
                        questionType === 'open_ended' && (
                        <TableCell>
                            {question.percentageCorrect}%
                        </TableCell>
                    )}
                </TableRow>
            )})}
            </>
        </TableBody>
    </Table>
  )
}

export default QuestionList