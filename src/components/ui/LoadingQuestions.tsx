"use client"
import Image from 'next/image'
import React from 'react'
import { Progress } from './progress'

type Props = {
    finishedLoading: boolean
}

const loadingTexts = [
    "Loading Questions...",
    "Preparing a quiz adventure just for you...",
    "Loading up a quiz that's worth the wait...",
    "Cooking up a batch of brain-bending questions...",
    "Weaving the fabric of your quiz experience...",
    "Crafting brain-teasers with care and precision...",
]

const LoadingQuestions = ({finishedLoading}: Props) => {
    const [progress, setProgress] = React.useState(0)
    const [loadingText, setLoadingText] = React.useState(loadingTexts[0])
    React.useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loadingTexts.length)
            setLoadingText(loadingTexts[randomIndex])
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                
                if (finishedLoading){
                    return 100
                }

                if(prev === 100){
                    return 0
                }

                if(Math.random() < 0.1){
                    return prev + 2
                }
                return prev + 0.5
            })
        },100)
        return () => clearInterval(interval)
    }, [finishedLoading])

  return (
    // <div className='absolute flex justify-center h-[100vh] items-center mr-auto ml-auto w-full'>
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col  items-center w-[70vw] md:w-[60vw]'>
        <Image
        src={'/loading.gif'}
        width={500}
        height={500}
        alt='Loading Animation'/>

        <Progress value={progress} className='w-full mt-4'/>

        <h1 className='mt-2 text-xl'>
            {loadingText}
        </h1>

    </div>
    // </div>
  )
}

export default LoadingQuestions