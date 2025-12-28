import { ref, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

export function useUnsavedChanges() {
  const isDirty = ref(false);

  const markDirty = () => {
    isDirty.value = true;
  };

  const markClean = () => {
    isDirty.value = false;
  };

  // Browser refresh/close
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty.value) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  // Client-side navigation
  onBeforeRouteLeave((to, from, next) => {
    if (isDirty.value) {
      const answer = window.confirm('You have unsaved changes. Do you really want to leave?');
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });

  return {
    isDirty,
    markDirty,
    markClean,
  };
}
