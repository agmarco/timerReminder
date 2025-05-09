import { HStack, IconButton, Box, VStack, Text } from '@chakra-ui/react'
import { IoIosAdd } from 'react-icons/io'
import { LuSettings } from 'react-icons/lu'
import React from 'react'
import { Timer } from './components/Timer'

interface TimerData {
  id: string
  maxTime: number
  interval: number
}

export default function App(): React.ReactElement {
  const [timers, setTimers] = React.useState<TimerData[]>([])

  const addTimer = (): void => {
    const newTimer: TimerData = {
      id: Date.now().toString(),
      maxTime: 300,
      interval: 60,
    }
    setTimers(prevTimers => [...prevTimers, newTimer])
  }

  return (
    <Box 
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="gray.900"
      display="flex"
      flexDirection="column"
    >
      <Box 
        w="100%" 
        p={4} 
        bg="gray.900"
        borderBottom="1px"
        borderColor="gray.700"
      >
        <HStack justify="space-between" w="100%" gap={2}>
          <HStack gap={2}>
            <IconButton aria-label="Settings" variant="ghost" size="sm">
              <LuSettings />
            </IconButton>
          </HStack>
          <IconButton 
            aria-label="Add timer" 
            colorScheme="blue" 
            size="sm" 
            onClick={addTimer}
          >
            <IoIosAdd />
          </IconButton>
        </HStack>
      </Box>

      <Box 
        flex="1"
        overflowY="auto"
        p={4}
      >
        {timers.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            No timers yet. Click the + button to add one.
          </Text>
        ) : (
          <VStack 
            gap={2} 
            align="stretch"
          >
            {timers.map(timer => (
              <Timer
                key={timer.id}
                maxTime={timer.maxTime}
                interval={timer.interval}
                onDelete={() => setTimers(prev => prev.filter(t => t.id !== timer.id))}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}
