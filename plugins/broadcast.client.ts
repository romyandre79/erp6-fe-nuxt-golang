export default defineNuxtPlugin(() => {
  const userStore = useUserStore();
  const themeStore = useThemeStore();
  
  // Use a unique name for the channel
  const channel = new BroadcastChannel('erp6_app_channel');

  channel.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
      case 'logout':
        // Only trigger if we are currently logged in to avoid loop/redundancy
        if (userStore.token) {
           // Pass true/flag to indicate this is a remote trigger if needed, 
           // but standard logout clears state which is what we want.
           // To avoid infinite loop, the sender should not listen to its own message, 
           // but `BroadcastChannel` excludes the sender by default.
           // However, if we call `userStore.logout()`, we must ensure 
           // that `userStore.logout()` doesn't broadcast AGAIN if it's a response to a broadcast.
           userStore.logout(false); // Pass 'false' to say "don't broadcast this logout"
        }
        break;

      case 'theme_change':
        if (payload?.theme && themeStore.theme !== payload.theme) {
          themeStore.applyTheme(payload.theme, false); // Pass 'false' to don't broadcast
        }
        break;
    }
  };

  return {
    provide: {
      broadcast: channel
    }
  };
});
