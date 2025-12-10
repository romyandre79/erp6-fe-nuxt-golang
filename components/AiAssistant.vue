<template>
  <div>
    <!-- Floating Button -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <button 
          @click="toggleOpen" 
          class="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :class="{ 'rotate-0': !isOpen, 'rotate-90': isOpen }"
        >
            <!-- Unread Badge -->
            <span v-if="totalUnread > 0 && !isOpen" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                {{ totalUnread > 99 ? '99+' : totalUnread }}
            </span>
            <span v-if="!isOpen">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                    <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 9.75a.75.75 0 0 1 1.5 0v.812a.75.75 0 0 1-1.5 0v-.812Zm2.25-.812a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812Zm0 2.25a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812ZM9 15a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812Zm0 2.25a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812ZM15 9.75a.75.75 0 0 1 1.5 0v.812a.75.75 0 0 1-1.5 0v-.812Zm2.25-.812a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812Zm0 2.25a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812ZM4.5 4.5a.75.75 0 0 1 1.5 0v.812a.75.75 0 0 1-1.5 0v-.812Zm2.25-.812a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812Zm0 2.25a.75.75 0 0 1 .75.75v.812a.75.75 0 0 1-.75.75v-.812Z" clip-rule="evenodd" />
                </svg>
            </span>
             <span v-else>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
             </span>
        </button>
    </div>

    <!-- Main Window -->
    <transition name="fade-slide">
      <div v-if="isOpen" class="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 h-[600px]">
        
        <!-- Tabs Header -->
        <div class="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex">
            <button 
                @click="activeTab = 'ai'"
                class="flex-1 py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-colors"
                :class="activeTab === 'ai' ? 'text-indigo-600 bg-white dark:bg-gray-800 border-t-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
                AI Assistant
            </button>
            <button 
                @click="activeTab = 'people'"
                class="flex-1 py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-colors"
                :class="activeTab === 'people' ? 'text-indigo-600 bg-white dark:bg-gray-800 border-t-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
                People
            </button>
        </div>

        <!-- Content: AI Tab -->
        <div v-if="activeTab === 'ai'" class="flex-1 flex flex-col min-h-0">
             <!-- AI Header -->
            <div class="bg-indigo-600 p-3 text-white flex gap-2 items-center text-sm shadow-sm">
                 <i class="fa-solid fa-robot"></i>
                 <span>Ask me to create widgets or menus!</span>
            </div>
             <!-- Messages -->
             <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" ref="aiMessagesContainer">
                <div v-for="(msg, idx) in aiMessages" :key="idx" :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
                    <div :class="['max-w-[85%] rounded-lg px-4 py-2 text-sm', msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-600']">
                    {{ msg.text }}
                    </div>
                </div>
             </div>
             <!-- Input -->
             <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form @submit.prevent="sendAiMessage" class="flex gap-2">
                    <input v-model="aiInput" type="text" placeholder="Type a command..." class="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="submit" class="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                        <i class="fa-solid fa-paper-plane px-1"></i>
                    </button>
                </form>
             </div>
        </div>

        <!-- Content: People Tab -->
        <div v-else class="flex-1 flex flex-col min-h-0">
            
            <!-- User List -->
            <div v-if="!selectedUser" class="flex-1 overflow-y-auto p-2 space-y-1">
                 <div v-if="loadingUsers" class="text-center p-4 text-gray-500">Loading users...</div>
                 <div v-else-if="users.length === 0" class="text-center p-4 text-gray-500">No users found.</div>
                 <div 
                    v-for="user in users" 
                    :key="user.useraccessid"
                    @click="selectUser(user)"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                 >
                    <div class="relative">
                        <img :src="getProfilePhoto(user)" @error="handleImageError" class="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <span v-if="user.isonline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ user.realname }}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
                    </div>
                     <div v-if="unreadCounts[user.useraccessid]" class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {{ unreadCounts[user.useraccessid] }}
                     </div>
                    <i class="fa-solid fa-chevron-right text-gray-300"></i>
                 </div>
            </div>

            <!-- Chat Room -->
            <div v-else class="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900">
                <!-- Chat Header -->
                <div class="bg-white dark:bg-gray-800 p-3 flex items-center gap-3 shadow-sm z-10">
                    <button @click="selectedUser = null" class="text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="flex items-center gap-2 flex-1">
                        <div class="relative">
                           <img :src="getProfilePhoto(selectedUser)" @error="handleImageError" class="w-8 h-8 rounded-full" />
                           <span v-if="selectedUser.isonline" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <span class="font-semibold text-sm">{{ selectedUser.realname }}</span>
                    </div>
                    <button @click="startVideoCall" class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors" title="Video Call">
                        <i class="fa-solid fa-video"></i>
                    </button>
                </div>

                <!-- Chat Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatMessagesContainer">
                     <div v-for="(msg, idx) in chatHistory[selectedUser.useraccessid] || []" :key="idx" :class="['flex', msg.senderId === myUserId ? 'justify-end' : 'justify-start']">
                        <div :class="['max-w-[75%] rounded-xl px-4 py-2 text-sm relative', msg.senderId === myUserId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 rounded-tl-none']">
                            <p>{{ msg.text }}</p>
                            <p class="text-[10px] opacity-70 mt-1 text-right">{{ formatTime(msg.timestamp) }}</p>
                        </div>
                    </div>
                </div>

                 <!-- Chat Input -->
                <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <form @submit.prevent="sendChatMessage" class="flex gap-2">
                        <input v-model="chatInput" type="text" placeholder="Message..." class="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="submit" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                            <i class="fa-solid fa-paper-plane px-1"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </transition>

     <!-- Video Call Overlay -->
     <div v-if="isInCall" class="fixed bottom-24 right-[400px] z-50 w-80 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 flex flex-col">
        <div class="relative h-60 bg-gray-900">
             <video ref="remoteVideo" autoplay playsinline class="w-full h-full object-cover"></video>
             <div class="absolute bottom-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
                 <video ref="localVideo" autoplay playsinline muted class="w-full h-full object-cover"></video>
             </div>
             <div class="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
                 {{ callStatus }}
             </div>
        </div>
        <div class="p-4 bg-gray-800 flex justify-center gap-4">
             <button @click="endCall" class="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
                 <i class="fa-solid fa-phone-slash text-xl"></i>
             </button>
        </div>
     </div>
     
     <!-- Incoming Call Modal -->
     <div v-if="incomingCall" class="fixed top-6 right-6 z-50 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-l-4 border-green-500 w-72 animate-bounce-in">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                 <i class="fa-solid fa-video text-xl animate-pulse"></i>
            </div>
            <div>
                <h4 class="font-bold text-gray-900 dark:text-white">Incoming Call</h4>
                <p class="text-sm text-gray-500">{{ incomingCall.callerName }}</p>
            </div>
        </div>
        <div class="flex gap-2">
            <button @click="answerCall" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm">Accept</button>
            <button @click="rejectCall" class="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg font-medium text-sm">Decline</button>
        </div>
     </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/store/user';
import { useAuth } from '~/composables/useAuth';
import { useApi } from '~/composables/useApi';
import { useNotificationStore } from '~/store/notification';

const isOpen = ref(false);
const activeTab = ref<'ai' | 'people'>('ai');
const aiInput = ref('');
const aiMessages = ref<{text: string, sender: 'user'|'ai'}[]>([]);
const aiConversationState = ref(''); // Track conversation state
const users = ref<any[]>([]);
const loadingUsers = ref(false);
const selectedUser = ref<any>(null);
const chatInput = ref('');
const chatHistory = ref<Record<number, {text: string, senderId: number, timestamp: string}[]>>({});
const unreadCounts = ref<Record<number, number>>({});
const userStore = useUserStore();
const myUserId = computed(() => userStore.user?.userid);
const totalUnread = computed(() => Object.values(unreadCounts.value).reduce((sum, count) => sum + count, 0));
const aiMessagesContainer = ref<HTMLElement|null>(null);
const chatMessagesContainer = ref<HTMLElement|null>(null);
const notificationStore = useNotificationStore(); // Access socket

const { get, post } = useApi();

// Video Call State
const isInCall = ref(false);
const localVideo = ref<HTMLVideoElement|null>(null);
const remoteVideo = ref<HTMLVideoElement|null>(null);
const peerConnection = ref<RTCPeerConnection|null>(null);
const localStream = ref<MediaStream|null>(null);
const callStatus = ref('Connecting...');
const incomingCall = ref<any>(null);

const { token: authStateToken } = storeToRefs(userStore);
// Or just use computed
const token = computed(() => userStore.token);
let socket: WebSocket | null = null; 

// --- General ---

const toggleOpen = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && activeTab.value === 'people' && users.value.length === 0) {
        fetchUsers();
    }
};

watch(activeTab, (val) => {
    if (val === 'people' && users.value.length === 0) fetchUsers();
});

const scrollToBottom = async (container: HTMLElement|null) => {
    await nextTick();
    if (container) container.scrollTop = container.scrollHeight;
};

// --- AI Chat ---
const sendAiMessage = async () => {
    if(!aiInput.value.trim()) return;
    const text = aiInput.value;
    aiMessages.value.push({ text, sender: 'user' });
    aiInput.value = '';
    await scrollToBottom(aiMessagesContainer.value);

    // Call execute-flow API with AI command
    // Response will come via WebSocket, not from API response
    try {
        const formData = new FormData();
        formData.append('flowname', 'aicommand');
        formData.append('menu', 'admin');
        formData.append('search', 'false');
        formData.append('command', text);
        formData.append('user_id', String(myUserId.value || ''));
        formData.append('conversation_state', aiConversationState.value); // Send conversation state
        
        await post('/api/admin/execute-flow', formData);
        // Don't add response here - it will come via WebSocket
    } catch(e) {
        aiMessages.value.push({ text: "Error connecting to AI.", sender: 'ai' });
    }
};

// --- People / Users ---
const fetchUsers = async () => {
    loadingUsers.value = true;
    try {
        // Use execute-flow to get user list
        const formData = new FormData();
        formData.append('flowname', 'getuserlist');
        formData.append('menu', 'admin');
        formData.append('search', 'true');
        formData.append('action', 'getuserlist');
        formData.append('senderid', String(myUserId.value || ''));
        
        const { data }: any = await post('/api/admin/execute-flow', formData);
        users.value = data?.result || data?.data || data || [];
        // Init unread counts if needed
        users.value.forEach((u: any) => {
            if (!unreadCounts.value[u.useraccessid]) unreadCounts.value[u.useraccessid] = 0;
        });
    } catch(e) {
        console.error(e);
    } finally {
        loadingUsers.value = false;
    }
};

const selectUser = (user: any) => {
    selectedUser.value = user;
    if (user && unreadCounts.value[user.useraccessid]) {
        unreadCounts.value[user.useraccessid] = 0;
    }
    
    // Fetch History
    fetchChatHistory(user.useraccessid);

    nextTick(() => scrollToBottom(chatMessagesContainer.value));
};

const fetchChatHistory = async (targetId: number) => {
    try {
        // Use execute-flow to get chat history
        const formData = new FormData();
        formData.append('flowname', 'chat');
        formData.append('menu', 'admin');
        formData.append('search', 'true');
        formData.append('action', 'gethistory');
        formData.append('targetid', String(targetId));
        formData.append('senderid', String(myUserId.value || ''));
        
        const { data }: any = await post('/api/admin/execute-flow', formData);
        const history = data?.result || data?.data || data || [];
        if(history) {
             // Map backend definition: senderid -> senderId, created_at -> timestamp
             chatHistory.value[targetId] = history.map((d: any) => ({
                 text: d.message,
                 senderId: d.senderid,
                 timestamp: d.created_at
             }));
        }
    } catch(e) {
        console.error("Failed to load history", e);
    }
};

const getProfilePhoto = (user: any) => {
    const config = useRuntimeConfig();
    if (user && user.userphoto) {
        if (user.userphoto.startsWith('http')) return user.userphoto;
        const photo = user.userphoto.replace(/^\//, '');
        return `${config.public.apiBase}/useraccess/${photo}`;
    }
    return `${config.public.apiBase}/useraccess/admin.png`;
};

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    const config = useRuntimeConfig();
    img.src = `${config.public.apiBase}/useraccess/admin.png`;
};

const initWebSocket = () => {
    // Prevent multiple connections
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

    const config = useRuntimeConfig();
    
    if (!token.value) {
        console.error("No token for WS");
        return;
    }

    // Close existing if checking?
    if (socket) socket.close();

    let wsBase = config.public.apiBase.replace('http', 'ws');
    const wsUrl = `${wsBase}/api/ws/notifications?token=${token.value}`;

    console.log("Connecting to Chat WS:", wsUrl);
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
        console.log("Chat WS Connected");
    };

    socket.onmessage = async (event) => {
        try {
            const payload = JSON.parse(event.data);
            handleWsMessage(payload);
        } catch (e) {
            console.error("WS Message Parse Error", e);
        }
    };

    socket.onclose = (e) => {
        console.log("Chat WS Closed", e.code, e.reason);
        socket = null;
    };

    socket.onerror = (e) => {
        console.error("Chat WS Error", e);
    };
};

onMounted(() => {
    // Watch token changes only after hydration
    watch(() => token.value, (newVal) => {
        if (newVal) {
            initWebSocket();
        } else {
            if(socket) socket.close();
            socket = null;
        }
    }, { immediate: true });
});


const handleWsMessage = async (payload: any) => {
    console.log("WS Msg:", payload);
    
    // AI Chat Message (from backend workflow)
    if (payload.type === 'chat' && payload.message) {
        // This is an AI response from the backend
        aiMessages.value.push({ 
            text: payload.message, 
            sender: 'ai' 
        });
        
        // Save conversation state for next message
        if (payload.conversation_state) {
            aiConversationState.value = payload.conversation_state;
        }
        
        // Auto-open AI tab if closed
        if (!isOpen.value) {
            isOpen.value = true;
            activeTab.value = 'ai';
        } else if (activeTab.value !== 'ai') {
            activeTab.value = 'ai';
        }
        
        await scrollToBottom(aiMessagesContainer.value);
        return;
    }
    
    // Person-to-Person Chat Message
    if (payload.type === 'chat' && payload.senderid) {
        const senderId = payload.senderid;
        
        // Ensure reactivity for new keys
        if (!chatHistory.value[senderId]) {
            chatHistory.value[senderId] = [];
        }
        
        chatHistory.value[senderId].push({
            text: payload.data.text,
            senderId: senderId,
            timestamp: payload.data.timestamp || new Date().toISOString()
        });
        
        // If chat is OPEN with this user
        if (selectedUser.value && selectedUser.value.useraccessid === senderId && isOpen.value && activeTab.value === 'people') {
             await scrollToBottom(chatMessagesContainer.value);
        } else {
             // Increment Unread
             if (!unreadCounts.value[senderId]) unreadCounts.value[senderId] = 0;
             unreadCounts.value[senderId]++;
        }
    }
    
    // Status Update
    else if (payload.type === 'status_update') {
        const user = users.value.find(u => u.useraccessid === payload.user_id);
        if (user) {
            user.isonline = payload.isonline;
        }
    }

    // WebRTC Signals
    else if (payload.type === 'offer') {
        handleIncomingOffer(payload);
    } else if (payload.type === 'answer') {
        handleIncomingAnswer(payload);
    } else if (payload.type === 'candidate') {
        handleIncomingCandidate(payload);
    }
};

const sendChatMessage = () => {
    if (!chatInput.value.trim() || !selectedUser.value) return;
    const text = chatInput.value;
    const targetId = selectedUser.value.useraccessid;
    const timestamp = new Date().toISOString();

    console.log("Attempting to send chat to", targetId, "via socket state:", socket?.readyState);

    // Send via WS
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({
            type: 'chat',
            targetid: targetId,
            data: { text, timestamp }
        });
        socket.send(payload);
        console.log("Sent payload:", payload);
    } else {
        console.error("Socket not open!");
    }

    // Update Local History
    if (!chatHistory.value[targetId]) chatHistory.value[targetId] = [];
    chatHistory.value[targetId].push({
        text,
        senderId: myUserId.value,
        timestamp
    });
    chatInput.value = '';
    scrollToBottom(chatMessagesContainer.value);
};

const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- WebRTC Video Call ---

const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const startVideoCall = async () => {
    if (!selectedUser.value) return;
    isInCall.value = true;
    callStatus.value = "Calling " + selectedUser.value.realname + "...";
    
    await setupLocalStream();
    createPeerConnection(selectedUser.value.useraccessid);
    
    // Create Offer
    const offer = await peerConnection.value!.createOffer();
    await peerConnection.value!.setLocalDescription(offer);
    
    sendSignal('offer', offer);
};

const setupLocalStream = async () => {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideo.value) localVideo.value.srcObject = localStream.value;
    } catch (e) {
        console.error("Error accessing media devices", e);
        alert("Could not access camera/microphone.");
        isInCall.value = false;
    }
};

const createPeerConnection = (targetUserId: number) => {
    peerConnection.value = new RTCPeerConnection(rtcConfig);
    
    // Add local tracks
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => {
            peerConnection.value!.addTrack(track, localStream.value!);
        });
    }
    
    // Handle remote stream
    peerConnection.value.ontrack = (event) => {
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = event.streams[0];
        }
    };
    
    // Ice Candidates
    peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
            // Need to pass targetUserId context. 
            // Since we are initiator, we know target. 
            // But for receiver, they need to know sender.
            // Simplified: we store activeCallTargetId if needed.
            sendSignal('candidate', event.candidate, targetUserId); // Pass target explicitly if possible, or use active scope
        }
    };
};

const sendSignal = (type: string, data: any, targetId?: number) => {
    const target = targetId || selectedUser.value?.useraccessid || incomingCall.value?.senderid;
    if (socket && target) {
        socket.send(JSON.stringify({
            type,
            targetid: target,
            data
        }));
    }
};

// Handle Incoming Signals
const handleIncomingOffer = async (payload: any) => {
    // Show Incoming Call Modal
    const callerId = payload.senderid;
    const callerName = users.value.find(u => u.useraccessid === callerId)?.realname || 'Unknown User';
    
    incomingCall.value = {
        senderid: callerId,
        callerName,
        offer: payload.data
    };
};

const answerCall = async () => {
    if (!incomingCall.value) return;
    const callerId = incomingCall.value.senderid;
    const offer = incomingCall.value.offer;
    incomingCall.value = null; // Hide modal
    
    isInCall.value = true;
    callStatus.value = "Connected";
    
    await setupLocalStream();
    createPeerConnection(callerId);
    
    await peerConnection.value!.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.value!.createAnswer();
    await peerConnection.value!.setLocalDescription(answer);
    
    sendSignal('answer', answer, callerId);
};

const rejectCall = () => {
    incomingCall.value = null;
    // Optionally send 'reject' signal
};

const handleIncomingAnswer = async (payload: any) => {
    if (peerConnection.value) {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(payload.data));
        callStatus.value = "Connected";
    }
};

const handleIncomingCandidate = async (payload: any) => {
    if (peerConnection.value) {
        await peerConnection.value.addIceCandidate(new RTCIceCandidate(payload.data));
    }
};

const endCall = () => {
    if (peerConnection.value) peerConnection.value.close();
    peerConnection.value = null;
    
    if (localStream.value) {
        localStream.value.getTracks().forEach(t => t.stop());
        localStream.value = null;
    }
    
    isInCall.value = false;
    callStatus.value = '';
};

onMounted(() => {
    // Watcher handles init
});

</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.animate-bounce-in {
    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
</style>
