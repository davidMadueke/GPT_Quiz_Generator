"use client"
import { useTheme } from 'next-themes'
import React from 'react'
import D3WordCloud from 'react-d3-cloud'

type Props = {}

const data = [
    {
        text: 'React',
        value: 7
    },
    {
        text: 'John',
        value: 14
    },
    {
        text: 'Susie',
        value: 4
    },
]

const fontSizeMapper = (word: any) => Math.log2(word.value) * 5 + 16

const CustomWordCloud = (props: Props) => {
    const theme = useTheme()
  return (
    <>
    <D3WordCloud 
    height={555}
    font='sans-serif'
    fontSize={fontSizeMapper}
    rotate={0}
    padding={10}
    fill={theme.theme =='dark' ?'white' :'dark'}
    data={data}
    />
    </>
  )
}

export default CustomWordCloud