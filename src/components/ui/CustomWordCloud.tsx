"use client"
import { useTheme } from 'next-themes'
import React from 'react'

/*import D3WordCloud from 'react-d3-cloud'*/ // This is  causing a Reference Error: documnet is not defined
                                          // Used dynamic import to fix this                              
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const D3WordCloud = dynamic(
  () => import('react-d3-cloud'),
  { ssr: false,
    loading: () => <p>Loading...</p>}
)

type Props = {
    formattedTopics: {text:string, value:number}[]
}


const fontSizeMapper = (word: any) => Math.log2(word.value) * 5 + 16

const CustomWordCloud = ({formattedTopics}: Props) => {
    const theme = useTheme()
    const router = useRouter()
  return (
    <>
    <D3WordCloud 
    height={555}
    font='sans-serif'
    fontSize={fontSizeMapper}
    rotate={0}
    padding={10}
    fill={theme.theme =='dark' ?'white' :'dark'}
    onWordClick={(event, word) => {
        router.push(`/quiz?topic=${word.text}`)
    }}
    data={formattedTopics}
    />
    </>
  )
}

export default CustomWordCloud