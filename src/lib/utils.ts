import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds: number){
  const hours= Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - (hours * 3600)) / 60)
  const secs = seconds - (hours * 3600) - (minutes * 60)

  const parts = []

  if(hours>0){
    parts.push(` ${hours}hrs`)
  }
  if(minutes>0){
    parts.push(` ${minutes}mins`)
  }
  if(secs>0){
    parts.push(` ${secs}secs`)
  }

  return parts.join(" ")
}
