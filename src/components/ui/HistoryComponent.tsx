import { prisma } from '@/lib/db'
import { BookOpen, Clock, CopyCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    limit: number
    userId: string
}

const HistoryComponent = async ({ limit, userId }: Props) => {
    const games = await prisma.game.findMany({
        where: { 
            userId: userId
        },
        take: limit,
        orderBy: {
            timeStarted: 'desc'
        }
    })
  return (
    <div className='space-y-8'>
        {games.map((game) => {
            return(
                <div className="flex items-center justify-between" key={game.id}>
                    <div className="flex items-center">
                        {(game.gameType === 'mcq') ? (
                            <CopyCheck className='mr-3'/>
                        ) :(
                            <BookOpen className='mr-3'/>
                        )}
                        <div className="ml-4 space-y-1">
                            <Link href={`/statistics/${game.id}`} className='text-base font-medium leading-none underline'>
                                <div className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                                    {game.topic}
                                </div>
                            </Link>
                            <p className='flex items-center px-2 py-1 text-sm text-white rounded-lg w-fit bg-slate-800'>
                                <Clock className='mr-1' size={16}/>
                                {new Date(game.timeStarted).toLocaleDateString()}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                            {game.gameType === 'mcq' ? ("MCQ") : ("Open Ended")}
                            </p>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default HistoryComponent