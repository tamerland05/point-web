import { useEffect, useState } from "react"

// NOTE: этот компонент сейчас описывает бизнес логику (order), по хорошему сделать его более абстрактным, например "useCountdown"
// TODO: убрать бизнес логику из packages/ui
export const useOrderCancelCountdown = (remainingTime: number) => {
  const [time, setTime] = useState<number>(remainingTime)

  useEffect(() => {
    if (time <= 0) {
      return
    }

    const timerId = setTimeout(() => {
      setTime((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [time])

  const minutes = Math.floor(time / 60).toString()
  const seconds = (time % 60).toString().padStart(2, "0")
  const timerData = [minutes, seconds]

  return { time, timerData }
}
