
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import CustomWordCloud from '../ui/CustomWordCloud'
import { prisma } from '@/lib/db'


type Props = {}

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({})
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count
    }
  })
  return (
    <Card className='col-span-4'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
            <CardDescription>
                Here are all of the hot Topics for you to learn. Click on one to get started!
            </CardDescription>
        </CardHeader>

        <CardContent className='pl-2 '> 
            <CustomWordCloud formattedTopics={formattedTopics}/>
        </CardContent>
        
    </Card>
  )
}

export default HotTopicsCard