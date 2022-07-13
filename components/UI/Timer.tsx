import React from 'react'
import { useState, useEffect } from 'react'
import { Text } from '@chakra-ui/react'

const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

const Timer = ({ timestamp }: { timestamp: number }) => {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let numSeconds = timestamp - Math.floor(Date.now() / 1000)
    if (numSeconds > 0) {
      const numDays = Math.floor(numSeconds / SECONDS_IN_DAY)
      numSeconds -= numDays * SECONDS_IN_DAY
      const numHours = Math.floor(numSeconds / SECONDS_IN_HOUR)
      numSeconds -= numHours * SECONDS_IN_HOUR
      const numMinutes = Math.floor(numSeconds / SECONDS_IN_MINUTE)
      numSeconds -= numMinutes * SECONDS_IN_MINUTE
      setDays(numDays)
      setHours(numHours)
      setMinutes(numMinutes)
      setSeconds(numSeconds)
    }
    setLoading(false)
  }, [timestamp])

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            if (days === 0) {
              clearInterval(myInterval)
            } else {
              setDays(days - 1)
              setHours(23)
              setMinutes(59)
              setSeconds(59)
            }
          } else {
            setHours(hours - 1)
            setMinutes(59)
            setSeconds(59)
          }
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      } else {
        setSeconds(seconds - 1)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })

  return loading ? (
    <>{'...'}</>
  ) : (
    <>
      {days > 0
        ? `${days} Day${days > 1 && 's'} ${hours}:${minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
          }`
        : hours > 0
        ? `${hours}:${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
        : minutes > 0
        ? `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
        : seconds > 0
        ? `${seconds < 10 ? `0${seconds}` : seconds}`
        : 'Ended'}
    </>
  )
}

export default Timer
