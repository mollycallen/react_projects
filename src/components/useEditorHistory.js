import { useState, useCallback } from 'react'

/**
 * A custom React hook for managing text editor state with undo/redo functionality
 * @param {any} initialState - The initial state of the editor
 * @return {Object} - Object containing current state, functions to update, undo, and redo changes
 */
function useEditorHistory (initialState) {
  // State to track the current position in history
  const [position, setPosition] = useState(0)

  // State to store the history of all changes
  const [history, setHistory] = useState([initialState])

  // Get the current state based on position
  const currentState = history[position]

  // Function to add a new change to the history
  const setState = useCallback(
    newState => {
      // If we made changes after undoing some changes,
      // we need to remove the "future" states that were undone
      const newHistory = history.slice(0, position + 1)

      // Add the new state to history
      setHistory([...newHistory, newState])

      // Update position to point to the new state
      setPosition(position + 1)
    },
    [history, position]
  )

  // Function to make it easier to update state based on previous state
  const updateState = useCallback(
    updater => {
      const newState =
        typeof updater === 'function' ? updater(currentState) : updater

      setState(newState)
    },
    [currentState, setState]
  )

  // Function to undo the last change
  const undo = useCallback(() => {
    if (position > 0) {
      setPosition(position - 1)
    }
  }, [position])

  // Function to redo a previously undone change
  const redo = useCallback(() => {
    if (position < history.length - 1) {
      setPosition(position + 1)
    }
  }, [position, history])

  // Check if undo/redo operations are available
  const canUndo = position > 0
  const canRedo = position < history.length - 1

  return {
    state: currentState,
    setState: updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    position
  }
}

export default useEditorHistory
