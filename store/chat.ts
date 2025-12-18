import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    // Map of userId -> [messages]
    conversations: {} as Record<number, any[]>,
    // List of active users we are chatting with
    activeUsers: [] as any[],
    // Unread counts per user
    unreadCounts: {} as Record<number, number>
  }),

  actions: {
    addMessage(message: any) {
      // Determine the "other" person in the chat
      // If I am sender, other is receiver. If I am receiver, other is sender.
      // But here we need to know "my" ID. 
      // For incoming messages (where I am receiver), message.senderid is the other person.
      // For outgoing messages (where I am sender), message.receiverid is the other person.
      
      // Since we don't have easy access to "my" ID here without importing user store (which might cause loop),
      // let's assume the component handling this knows who the conversation is with.
      
      // However, for storage, we key by the "partner" ID.
      // When receiving a message, senderid is the partner.
      
      const partnerId = message.senderid
      
      if (!this.conversations[partnerId]) {
        this.conversations[partnerId] = []
      }
      
      // Check for duplicate
      if (!this.conversations[partnerId].find(m => m.chatid === message.chatid)) {
        this.conversations[partnerId].push(message)
        
        // Increment unread if message is not from me (which incoming always is)
        if (!this.unreadCounts[partnerId]) this.unreadCounts[partnerId] = 0
        this.unreadCounts[partnerId]++
      }
    },
    
    // Called when we actively send a message, to append it to our local view immediately
    addSentMessage(partnerId: number, message: any) {
       if (!this.conversations[partnerId]) {
        this.conversations[partnerId] = []
      }
      this.conversations[partnerId].push(message)
    },

    setHistory(partnerId: number, messages: any[]) {
      this.conversations[partnerId] = messages
    },
    
    markRead(partnerId: number) {
      this.unreadCounts[partnerId] = 0
      // Also update messages?
    }
  }
})
