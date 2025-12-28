import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export interface UndoRedoOptions {
  historyLimit?: number;
  enableKeyboardShortcuts?: boolean;
}

/**
 * Composable for undo/redo functionality
 * @param initialState - Initial state to track
 * @param options - Configuration options
 * @returns Undo/redo methods and state
 */
export function useUndoRedo<T>(initialState: T, options: UndoRedoOptions = {}) {
  const { historyLimit = 50, enableKeyboardShortcuts = true } = options;

  // History stacks
  const past = ref<T[]>([]);
  const present = ref<T>(JSON.parse(JSON.stringify(initialState)));
  const future = ref<T[]>([]);

  // Computed properties
  const canUndo = computed(() => past.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  /**
   * Record a new state in history
   */
  const record = (newState: T) => {
    // Don't record if state hasn't changed
    const currentStateStr = JSON.stringify(present.value);
    const newStateStr = JSON.stringify(newState);

    if (currentStateStr === newStateStr) {
      return;
    }

    // Add current state to past
    past.value.push(JSON.parse(JSON.stringify(present.value)));

    // Limit history size
    if (past.value.length > historyLimit) {
      past.value.shift();
    }

    // Update present state
    present.value = JSON.parse(JSON.stringify(newState));

    // Clear future (new action invalidates redo)
    future.value = [];
  };

  /**
   * Undo last change
   */
  const undo = () => {
    if (!canUndo.value) return null;

    // Move current state to future
    future.value.unshift(JSON.parse(JSON.stringify(present.value)));

    // Restore previous state
    const previousState = past.value.pop();
    if (previousState) {
      present.value = JSON.parse(JSON.stringify(previousState));
      return present.value;
    }

    return null;
  };

  /**
   * Redo last undone change
   */
  const redo = () => {
    if (!canRedo.value) return null;

    // Move current state to past
    past.value.push(JSON.parse(JSON.stringify(present.value)));

    // Restore next state
    const nextState = future.value.shift();
    if (nextState) {
      present.value = JSON.parse(JSON.stringify(nextState));
      return present.value;
    }

    return null;
  };

  /**
   * Clear all history
   */
  const clear = () => {
    past.value = [];
    future.value = [];
  };

  /**
   * Reset to a specific state and clear history
   */
  const reset = (newState: T) => {
    past.value = [];
    future.value = [];
    present.value = JSON.parse(JSON.stringify(newState));
  };

  // Keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

    // Undo: Ctrl+Z (or Cmd+Z on Mac)
    if (ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      const newState = undo();
      if (newState) {
        // Emit event for external listeners
        window.dispatchEvent(new CustomEvent('undo-redo:undo', { detail: newState }));
      }
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z (or Cmd+Shift+Z on Mac)
    if ((ctrlKey && event.key === 'y') || (ctrlKey && event.shiftKey && event.key === 'z')) {
      event.preventDefault();
      const newState = redo();
      if (newState) {
        // Emit event for external listeners
        window.dispatchEvent(new CustomEvent('undo-redo:redo', { detail: newState }));
      }
    }
  };

  // Register keyboard shortcuts
  if (enableKeyboardShortcuts) {
    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  }

  return {
    // State
    present,
    canUndo,
    canRedo,

    // Methods
    record,
    undo,
    redo,
    clear,
    reset,

    // History info
    historySize: computed(() => past.value.length),
    futureSize: computed(() => future.value.length),
  };
}
