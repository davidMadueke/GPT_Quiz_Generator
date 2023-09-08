import React from 'react'
import { Card } from './card'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Separator } from './separator'

type Props = {
    correct: number,
    incorrect: number,
}

const MCQCounter = ({correct, incorrect}: Props) => {
  return (
    <Card className='flex flex-row items-center justify-center p-2'>
        <CheckCircle2 className='mr-2' color='green' size={30}/>
        <span className='text-2xl mx-2 text-[green]'>{correct}</span>

        <Separator orientation='vertical' className='h-8'/>

        <span className='text-2xl mx-2 text-[red]'>{incorrect}</span>
        <XCircle className='ml-2' color='red' size={30}/>

    </Card>
  )
}

export default MCQCounter