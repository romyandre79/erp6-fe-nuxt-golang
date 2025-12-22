<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import { useAuth } from '~/composables/useAuth';

// Use specific layout
definePageMeta({
  layout: 'project'
});

const userStore = useUserStore();
const { login } = useAuth();
const router = useRouter();

// --- Registration State ---
const isRegistering = ref(false);
const registerForm = ref({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const registerError = ref('');
const registerSuccess = ref(false);

const handleRegister = async () => {
    registerError.value = '';
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        registerError.value = "Passwords do not match";
        return;
    }
    
    isRegistering.value = true;
    
    // Simulate API call for now (Frontend First approach)
    // In real implementation: await $fetch('/api/auth/register', { ... })
    
    setTimeout(() => {
        isRegistering.value = false;
        registerSuccess.value = true;
        // The user specifically asked: "system send email verify and cc romyandre79@gmail.com"
        // This will be handled by the backend.
    }, 1500);
};

// --- Kanban/Project Logic (Copied/Adapted from pages/admin/kanban.vue) ---
// We will simply placeholder this for now and ask the user if they want the FULL kanban implementation copied here,
// or if we should componentize 'kanban.vue' to avoid code duplication. 
// Given the instructions, I will implement a simplified version or reuse the component if I can refactor.
// But for "User Request: put it to page/project", I will put the board here.

const showArchived = ref(false);
const projects = ref([
    { id: 1, name: 'Website Redesign', description: 'Redesigning the corporate website', color: '#3b82f6', archived: false },
    { id: 2, name: 'Mobile App', description: 'Flutter mobile application', color: '#10b981', archived: false }
]);
const activeProject = ref(projects.value[0]);
const columns = ref([
    { title: 'To Do', status: 'todo', icon: '📋', color: '#e0e7ff' },
    { title: 'In Progress', status: 'in_progress', icon: '⚡', color: '#fef3c7' },
    { title: 'Done', status: 'done', icon: '✅', color: '#dcfce7' }
]);
const cards = ref([
    { id: 1, title: 'Research competitors', status: 'todo', priority: 'high', tags: ['Research'] },
    { id: 2, title: 'Design system', status: 'in_progress', priority: 'medium', tags: ['Design', 'UI'] },
    { id: 3, title: 'Setup Repo', status: 'done', priority: 'low', tags: ['DevOps'] }
]);

const getColumnCards = (status: string) => cards.value.filter(c => c.status === status);
const getColumnHeaderColor = (bg: string) => {
    // simplistic mapping or just return a default
    return '#4f46e5'; 
};

// --- Actions ---
const selectProject = (p: any) => activeProject.value = p;

</script>

<template>
  <div class="h-full flex flex-col">
  
    <!-- GUEST VIEW: Landing & Registration -->
    <div v-if="!userStore.isLoggedIn" class="flex-1 flex overflow-hidden">
        <!-- Hero Section -->
        <div class="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
            <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <div class="relative z-10 max-w-2xl">
                <UBadge color="blue" variant="soft" class="mb-6">Project Management Evolved</UBadge>
                <h1 class="text-5xl font-bold mb-6 leading-tight">
                    Manage your projects with <span class="text-blue-400">clarity</span> and <span class="text-purple-400">style</span>.
                </h1>
                <p class="text-lg text-gray-300 mb-8 leading-relaxed">
                    The ultimate tool for agile teams. Visualize efficient workflows, track progress in real-time, and collaborate seamlessly.
                </p>
                
                <div class="flex gap-4">
                    <div class="flex -space-x-4">
                         <UAvatar src="https://i.pravatar.cc/150?u=1" alt="User 1" class="border-2 border-slate-900" />
                         <UAvatar src="https://i.pravatar.cc/150?u=2" alt="User 2" class="border-2 border-slate-900" />
                         <UAvatar src="https://i.pravatar.cc/150?u=3" alt="User 3" class="border-2 border-slate-900" />
                         <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 bg-gray-700 text-xs text-white z-10">
                            +2k
                         </div>
                    </div>
                    <span class="flex items-center text-sm text-gray-400">Trusted by teams worldwide</span>
                </div>
            </div>
        </div>
        
        <!-- Registration Form -->
        <div class="w-full max-w-md bg-white dark:bg-gray-800 p-12 flex flex-col justify-center overflow-y-auto">
            <div v-if="!registerSuccess">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Started</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-8">Create your account to start managing projects.</p>
                
                <form @submit.prevent="handleRegister" class="space-y-4">
                    <UFormGroup label="Full Name" name="fullname">
                        <UInput v-model="registerForm.fullname" icon="i-heroicons-user" placeholder="John Doe" size="lg" required />
                    </UFormGroup>
                    
                    <UFormGroup label="Email Address" name="email">
                        <UInput v-model="registerForm.email" type="email" icon="i-heroicons-envelope" placeholder="you@example.com" size="lg" required />
                    </UFormGroup>
                    
                    <UFormGroup label="Password" name="password">
                        <UInput v-model="registerForm.password" type="password" icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg" required />
                    </UFormGroup>
                    
                    <UFormGroup label="Confirm Password" name="confirmPassword">
                        <UInput v-model="registerForm.confirmPassword" type="password" icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg" required />
                    </UFormGroup>

                    <UAlert v-if="registerError" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" :title="registerError" class="mt-4" />
                    
                    <UButton type="submit" block color="primary" size="lg" :loading="isRegistering" class="mt-6">
                        Create Account
                    </UButton>
                </form>
                
                <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? 
                    <NuxtLink to="../login" class="text-primary-600 font-medium hover:underline">Log in</NuxtLink>
                </div>
            </div>
            
            <div v-else class="text-center">
                 <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UIcon name="i-heroicons-check" class="w-8 h-8" />
                 </div>
                 <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
                 <p class="text-gray-600 dark:text-gray-400 mb-6">
                    We've sent a verification link to <strong>{{ registerForm.email }}</strong>.
                    <br>Please click the link to activate your account.
                 </p>
                 <UButton to="/auth/login" color="gray" variant="ghost">
                    Return to Login
                 </UButton>
            </div>
        </div>
    </div>

    <!-- LOGGED IN VIEW: Project Board (Adapted from Kanban) -->
    <div v-else class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="font-semibold text-gray-900 dark:text-white mb-3">Your Projects</h2>
                <UButton block icon="i-heroicons-plus" size="sm" color="gray" variant="solid">New Project</UButton>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1">
                <div 
                    v-for="project in projects" 
                    :key="project.id"
                    class="p-2 rounded-md cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    :class="activeProject?.id === project.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
                    @click="selectProject(project)"
                >
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: project.color }"></div>
                    <span class="text-sm font-medium truncate">{{ project.name }}</span>
                </div>
            </div>
        </div>
        
        <!-- Board Area -->
        <div class="flex-1 flex flex-col overflow-hidden bg-blue-50/50 dark:bg-gray-900">
             <!-- Board Header -->
             <div class="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ activeProject?.name }}</h2>
                <div class="flex -space-x-2 overflow-hidden">
                    <UAvatar size="xs" src="https://i.pravatar.cc/150?u=1" class="border-2 border-white dark:border-gray-800" />
                    <UAvatar size="xs" src="https://i.pravatar.cc/150?u=2" class="border-2 border-white dark:border-gray-800" />
                    <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-user-plus" class="ml-4 rounded-full" />
                </div>
             </div>
             
             <!-- Board Columns -->
             <div class="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div class="flex h-full gap-6">
                    <div 
                        v-for="column in columns" 
                        :key="column.status"
                        class="w-80 flex-shrink-0 flex flex-col max-h-full"
                    >
                        <!-- Column Header -->
                        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span class="font-semibold text-gray-700 dark:text-gray-200">{{ column.title }}</span>
                            <UBadge color="gray" size="xs">{{ getColumnCards(column.status).length }}</UBadge>
                        </div>
                        
                        <!-- Column Body -->
                        <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded-b-lg flex-1 overflow-y-auto space-y-2 min-h-0">
                            <div 
                                v-for="card in getColumnCards(column.status)" 
                                :key="card.id"
                                class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div class="flex items-start justify-between mb-2">
                                    <UBadge v-if="card.priority" :color="card.priority === 'high' ? 'red' : 'blue'" size="xs" variant="subtle">{{ card.priority }}</UBadge>
                                </div>
                                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ card.title }}</h4>
                                <div class="flex items-center gap-2 mt-3">
                                    <div class="flex -space-x-1">
                                        <UAvatar size="2xs" src="https://i.pravatar.cc/150?u=4" />
                                    </div>
                                    <div class="ml-auto flex gap-1">
                                        <UIcon name="i-heroicons-chat-bubble-left" class="w-3 h-3 text-gray-400" />
                                        <span class="text-xs text-gray-400">2</span>
                                    </div>
                                </div>
                            </div>
                            
                            <UButton block variant="ghost" color="gray" icon="i-heroicons-plus" class="mt-2 text-gray-500">Add Card</UButton>
                        </div>
                    </div>
                    
                    <!-- Add List Button -->
                    <div class="w-80 flex-shrink-0">
                        <UButton block color="gray" variant="soft" icon="i-heroicons-plus" class="h-10 bg-white/50 backdrop-blur">Add another list</UButton>
                    </div>
                </div>
             </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
