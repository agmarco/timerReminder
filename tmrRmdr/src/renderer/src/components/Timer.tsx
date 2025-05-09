import { Box, HStack, Text, IconButton } from '@chakra-ui/react'
import { LuPause, LuPlay, LuTrash2 } from 'react-icons/lu'
import React from 'react'

interface TimerProps {
  maxTime: number // in seconds
  interval: number // in seconds
  timerName: string
  isRunning: boolean
  onStateChange: (isRunning: boolean) => void
  onDelete: () => void
}

export function Timer({
  timerName,
  maxTime,
  interval,
  isRunning,
  onStateChange,
  onDelete
}: TimerProps): React.ReactElement {
  const [timeLeft, setTimeLeft] = React.useState(maxTime)
  const [isFlashing, setIsFlashing] = React.useState(false)
  const lastIntervalHit = React.useRef(maxTime)
  const startTimeRef = React.useRef<number | null>(null)
  const animationFrameRef = React.useRef<number>()

  React.useEffect(() => {
    if (isRunning) {
      // Record the start time when the timer begins running
      startTimeRef.current = Date.now()

      const updateTimer = () => {
        if (!startTimeRef.current) return

        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const newTimeLeft = Math.max(0, maxTime - elapsed)

        // Check if we've hit an interval
        if (newTimeLeft % interval === 0 && newTimeLeft !== lastIntervalHit.current) {
          lastIntervalHit.current = newTimeLeft
          setIsFlashing(true)
          setTimeout(() => setIsFlashing(false), 3000)
        }

        setTimeLeft(newTimeLeft)

        if (newTimeLeft > 0) {
          animationFrameRef.current = requestAnimationFrame(updateTimer)
        } else {
          onStateChange(false)
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer)
    } else {
      startTimeRef.current = null
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRunning, maxTime, interval, onStateChange])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeLeft / maxTime) * 100

  return (
    <Box
      w="100%"
      p={4}
      borderBottom="1px"
      borderColor="white"
      bg={isFlashing ? 'orange.900' : 'transparent'}
      transition="background-color 0.3s ease"
    >
      <HStack justify="space-between" align="center" w="100%">
        <HStack gap={4}>
          <Text fontSize="md" fontWeight="bold" color="white">
            {timerName}
          </Text>
          <Text fontSize="lg" fontWeight="medium" color="gray.400">
            {formatTime(timeLeft)}
          </Text>
          <Text fontSize="lg" color="blue.400">
            {formatTime(interval)}
          </Text>
        </HStack>
        <HStack gap={2}>
          <IconButton
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            variant="ghost"
            size="sm"
            onClick={() => onStateChange(!isRunning)}
          >
            {isRunning ? <LuPause /> : <LuPlay />}
          </IconButton>
          <IconButton
            aria-label="Delete timer"
            variant="ghost"
            size="sm"
            colorScheme="red"
            onClick={onDelete}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </HStack>
      <Box mt={2} h="4px" w="100%" bg="gray.700" borderRadius="full" overflow="hidden">
        <Box
          h="100%"
          w={`${progress}%`}
          bg={timeLeft > 0 ? 'blue.500' : 'green.500'}
          transition="width 0.4s ease"
        />
      </Box>
    </Box>
  )
}
