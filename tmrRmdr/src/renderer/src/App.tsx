import { HStack, IconButton, Box, VStack, Text, Input } from '@chakra-ui/react'
import { IoIosAdd } from 'react-icons/io'
import { LuSettings, LuPlay, LuRotateCcw } from 'react-icons/lu'
import React from 'react'
import { Timer } from './components/Timer'

interface TimerData {
  id: string
  name: string
  maxTime: number
  interval: number
}

export default function App(): React.ReactElement {
  const [timers, setTimers] = React.useState<TimerData[]>([
    {
      id: 'creep-timer',
      name: 'Creep',
      maxTime: 3600,
      interval: 11
    },
    {
      id: 'inject-timer',
      name: 'Inject',
      maxTime: 3600,
      interval: 29
    }
  ])
  const [newTimerName, setNewTimerName] = React.useState('')
  const [newTimerMaxTime, setNewTimerMaxTime] = React.useState('3600')
  const [newTimerInterval, setNewTimerInterval] = React.useState('60')
  const [runningTimers, setRunningTimers] = React.useState<Set<string>>(new Set())

  const addTimer = (): void => {
    const newTimer: TimerData = {
      id: Date.now().toString(),
      name: newTimerName || 'Timer',
      maxTime: parseInt(newTimerMaxTime, 10),
      interval: parseInt(newTimerInterval, 10)
    }
    setTimers((prevTimers) => [...prevTimers, newTimer])
    // Reset form
    setNewTimerName('')
    setNewTimerMaxTime('3600')
    setNewTimerInterval('60')
  }

  const startAllTimers = (): void => {
    // Create a new Set with all timer IDs in a single operation
    const allTimerIds = new Set(timers.map((timer) => timer.id))
    setRunningTimers(allTimerIds)
  }

  const resetAllTimers = (): void => {
    // Stop all timers
    setRunningTimers(new Set())
    // Force a re-render of all timers by updating their IDs
    setTimers((prevTimers) =>
      prevTimers.map((timer) => ({
        ...timer,
        id: Date.now().toString() + Math.random()
      }))
    )
  }

  const handleTimerStateChange = (timerId: string, isRunning: boolean): void => {
    setRunningTimers((prev) => {
      const newSet = new Set(prev)
      if (isRunning) {
        newSet.add(timerId)
      } else {
        newSet.delete(timerId)
      }
      return newSet
    })
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
      <Box w="100%" p={4} bg="gray.900" borderBottom="1px" borderColor="gray.700">
        <HStack justify="space-between" w="100%" gap={2}>
          <HStack gap={2}>
            <IconButton aria-label="Settings" variant="ghost" size="sm">
              <LuSettings />
            </IconButton>
          </HStack>
          <HStack gap={2} flex="1" maxW="600px">
            <Box>
              <Text fontSize="xs" color="gray.400" mb={1}>
                Name
              </Text>
              <Input
                size="sm"
                value={newTimerName}
                onChange={(e) => setNewTimerName(e.target.value)}
                placeholder="Timer name"
              />
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.400" mb={1}>
                Max Time (s)
              </Text>
              <Input
                size="sm"
                type="number"
                value={newTimerMaxTime}
                onChange={(e) => setNewTimerMaxTime(e.target.value)}
                min={1}
              />
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.400" mb={1}>
                Alert Interval (s)
              </Text>
              <Input
                size="sm"
                type="number"
                value={newTimerInterval}
                onChange={(e) => setNewTimerInterval(e.target.value)}
                min={1}
              />
            </Box>
            <IconButton
              aria-label="Add timer"
              colorScheme="blue"
              size="sm"
              onClick={addTimer}
              alignSelf="flex-end"
            >
              <IoIosAdd />
            </IconButton>
            <IconButton
              aria-label="Start all timers"
              colorScheme="green"
              size="sm"
              onClick={startAllTimers}
              alignSelf="flex-end"
              disabled={timers.length === 0}
            >
              <LuPlay />
            </IconButton>
            <IconButton
              aria-label="Reset all timers"
              colorScheme="yellow"
              size="sm"
              onClick={resetAllTimers}
              alignSelf="flex-end"
              disabled={timers.length === 0}
            >
              <LuRotateCcw />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      <Box flex="1" overflowY="auto" p={4}>
        {timers.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            No timers yet. Click the + button to add one.
          </Text>
        ) : (
          <VStack gap={2} align="stretch">
            {timers.map((timer) => (
              <Timer
                key={timer.id}
                timerName={timer.name}
                maxTime={timer.maxTime}
                interval={timer.interval}
                isRunning={runningTimers.has(timer.id)}
                onStateChange={(isRunning) => handleTimerStateChange(timer.id, isRunning)}
                onDelete={() => setTimers((prev) => prev.filter((t) => t.id !== timer.id))}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}
