import { Box, HStack, Text, IconButton } from '@chakra-ui/react'
import { LuPause, LuPlay, LuTrash2 } from 'react-icons/lu'
import React from 'react'

interface TimerProps {
  maxTime: number // in seconds
  interval: number // in seconds
  onDelete: () => void
}

export function Timer({ maxTime, interval, onDelete }: TimerProps): React.ReactElement {
  const [timeLeft, setTimeLeft] = React.useState(maxTime)
  const [isRunning, setIsRunning] = React.useState(false)

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning, timeLeft])

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
      borderColor="gray.700"
    >
      <HStack justify="space-between" align="center" w="100%">
        <Text fontSize="lg" fontWeight="medium">
          {formatTime(timeLeft)}
        </Text>
        <HStack gap={2}>
          <IconButton
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            variant="ghost"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
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
      <Box 
        mt={2} 
        h="4px" 
        w="100%" 
        bg="gray.700" 
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="100%"
          w={`${progress}%`}
          bg={timeLeft > 0 ? "blue.500" : "green.500"}
          transition="width 0.3s ease"
        />
      </Box>
    </Box>
  )
} 