import React from 'react'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../ui/card'

type Props = {}

const RecentActivities = (props: Props) => {
  return (
    <Card className='col-span-4 lg:col-span-3'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
            <CardDescription>
                You have played a total of 7 games.
            </CardDescription>
        </CardHeader>

        <CardContent className='max-h-[500px] overflow-scroll '> 
            Histories
        </CardContent>

    </Card>
  )
}

export default RecentActivities