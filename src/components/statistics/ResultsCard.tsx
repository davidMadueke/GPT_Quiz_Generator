import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Award, Trophy } from 'lucide-react'

type Props = {
    accuracy: number
}

const ResultsCard = ({accuracy}: Props) => {
  return (
    <Card className='md:col-span-7'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
            <CardTitle className='text-2xl font-bold'>Results</CardTitle>
            <Award/>
            
        </CardHeader>

        <CardContent className='flex flex-col items-center justify-center h-3/5'>
            {accuracy > 75 && (
                <>
                <Trophy className='mr-4' stroke='gold' size={50}/>
                <div className="flex flex-col justify-center items-center text-2xl font-semibold text-yellow-400">
                    <span>Impressive</span>
                    <span className='text-sm text-center  opacity-50'>
                        {`You got > 75% accuracy`}
                    </span>
                </div>
                </>
            )}

            {(accuracy > 25 && accuracy <= 75 ) && (
                <>
                <Trophy className='mr-4' stroke='silver' size={50}/>
                <div className="flex flex-col justify-center items-center text-2xl font-semibold">
                    <span>Good Job!</span>
                    <span className='text-sm text-center opacity-50'>
                        {`You got > 25% accuracy`}
                    </span>
                </div>
                </>
            )}

            {(accuracy >= 0 && accuracy <= 25 ) && (
                <>
                <Trophy className='mr-4' stroke='red' size={50}/>
                <div className="flex flex-col justify-center items-center text-2xl font-semibold  ">
                    <span>Nice Try!</span>
                    <span className='text-sm text-center opacity-50'>
                        {`You got < 25% accuracy`}
                    </span>
                </div>
                </>
            )}
        </CardContent>
    </Card>
  )
}

export default ResultsCard