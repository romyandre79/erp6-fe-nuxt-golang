<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Project Sidebar -->
    <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Projects</h2>
        <UButton 
          block 
          color="primary" 
          icon="i-heroicons-plus" 
          size="sm"
          @click="openProjectModal(null)"
        >
          New Project
        </UButton>
        
        <!-- Archive Toggle -->
        <div class="mt-3 flex items-center justify-between">
          <label class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer" @click="showArchived = !showArchived">
            Show Archived
          </label>
          <input 
            type="checkbox" 
            v-model="showArchived"
            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <!-- Project List -->
      <div class="flex-1 overflow-y-auto p-2">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="mb-2 p-3 rounded-lg cursor-pointer transition-colors"
          :class="[
            activeProject?.id === project.id 
              ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500' 
              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent',
            project.archived ? 'opacity-60' : ''
          ]"
          @click="selectProject(project)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div 
                class="w-3 h-3 rounded-full flex-shrink-0" 
                :style="{ backgroundColor: project.color || '#3b82f6' }"
              ></div>
              <span class="font-medium text-sm text-gray-900 dark:text-white truncate">
                {{ project.name }}
              </span>
              <UIcon 
                v-if="project.archived" 
                name="i-heroicons-archive-box" 
                class="w-3 h-3 text-gray-400 flex-shrink-0"
              />
            </div>
            <div class="flex gap-1">
              <UButton 
                v-if="!project.archived"
                icon="i-heroicons-pencil" 
                size="2xs" 
                color="gray" 
                variant="ghost"
                @click.stop="openProjectModal(project)"
              />
              <UButton 
                :icon="project.archived ? 'i-heroicons-arrow-uturn-left' : 'i-heroicons-archive-box'" 
                size="2xs" 
                :color="project.archived ? 'blue' : 'gray'" 
                variant="ghost"
                @click.stop="toggleArchiveProject(project)"
              />
              <UButton 
                icon="i-heroicons-trash" 
                size="2xs" 
                color="red" 
                variant="ghost"
                @click.stop="openDeleteModal(project)"
              />
            </div>
          </div>
          <p v-if="project.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {{ project.description }}
          </p>
        </div>

        <div v-if="projects.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No projects yet. Create one to get started!
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ activeProject?.name || 'Select a Project' }}
          </h1>
          <div v-if="activeProject" class="flex gap-2">
            <UButton 
              icon="i-heroicons-chart-bar" 
              color="blue" 
              variant="soft"
              @click="openStatisticsModal"
            >
              Statistics
            </UButton>
            <UButton 
              icon="i-heroicons-users" 
              color="purple" 
              variant="soft"
              @click="openMembersModal"
            >
              Members
            </UButton>
            <UButton 
              icon="i-heroicons-cog-6-tooth" 
              color="gray" 
              variant="soft"
              @click="openColumnManager"
            >
              Manage Columns
            </UButton>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ activeProject?.description || 'Choose a project from the sidebar to view its kanban board' }}
        </p>
      </div>

      <!-- Kanban Board -->
      <div v-if="activeProject" class="flex-1 overflow-hidden p-6">
    <div class="kanban-board w-full overflow-x-auto" style="display: block;">
      <div class="flex flex-row gap-4 pb-4" style="display: flex; flex-direction: row; min-height: 600px; flex-wrap: nowrap;">
        
        <!-- Dynamic Columns -->
        <div 
          v-for="(column, index) in columns" 
          :key="column.status"
          class="kanban-column" 
          style="min-width: 320px; width: 320px; flex-shrink: 0;"
          @drop="onDrop($event, column.status)"
          @dragover.prevent
          @dragenter.prevent
        >
          <UCard :ui="{ body: { padding: 'p-3' }, header: { padding: 'p-0' } }">
            <template #header>
              <div 
                class="flex items-center justify-between px-4 py-3 rounded-t-lg cursor-move"
                :style="{ backgroundColor: getColumnHeaderColor(column.color) }"
                draggable="true"
                @dragstart="onColumnDragStart($event, index)"
                @dragover.stop="onColumnDragOver($event, index)"
                @dragend="onColumnDragEnd"
                @contextmenu.prevent="openColumnContextMenu($event, column, index)"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-bars-3" class="w-4 h-4 text-white/80" />
                  <span class="text-lg">{{ column.icon }}</span>
                  <h3 class="font-semibold text-white">{{ column.title }}</h3>
                  <UBadge color="white" variant="solid" class="bg-white/20 text-white border-0">
                    {{ getColumnCards(column.status).length }}
                  </UBadge>
                </div>
                <UButton 
                  icon="i-heroicons-plus" 
                  size="xs" 
                  color="white"
                  variant="ghost"
                  class="text-white hover:bg-white/20"
                  @click.stop="openCreateModal(column.status)" 
                />
              </div>
            </template>
            <!-- Card List with Vertical Scroll -->
            <div class="overflow-y-auto space-y-3" style="max-height: calc(100vh - 300px);">
              <UCard
                v-for="card in getColumnCards(column.status)"
                :key="card.id"
                class="cursor-move hover:shadow-lg transition-shadow"
                :ui="{ body: { padding: 'p-4' } }"
                draggable="true"
                @dragstart="onDragStart($event, card)"
                @dragend="onDragEnd"
                @click.stop="openEditModal(card)"
              >
                <div v-if="card.priority" class="mb-3">
                  <UBadge :color="getPriorityColor(card.priority)" variant="subtle" size="xs">
                    {{ card.priority }}
                  </UBadge>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ card.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{{ card.description }}</p>
                <div v-if="card.tags?.length" class="flex flex-wrap gap-1 mb-3">
                  <UBadge v-for="(tag, idx) in card.tags" :key="idx" color="blue" variant="soft" size="xs">
                    {{ tag }}
                  </UBadge>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div v-if="card.assignee" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-user-circle" class="w-4 h-4" />
                    <span>{{ card.assignee }}</span>
                  </div>
                  <div v-if="card.duedate" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    <span :class="{ 'text-red-500 font-medium': isOverdue(card.duedate) }">
                      {{ formatDate(card.duedate) }}
                    </span>
                  </div>
                </div>
              </UCard>
            </div>
          </UCard>
        </div>

      </div>
    </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <UIcon name="i-heroicons-folder-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Project Selected</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Select a project from the sidebar to view its board</p>
          <UButton color="primary" @click="openProjectModal(null)">
            Create Your First Project
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Project Create/Edit Modal -->
  <div 
    v-if="isProjectModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="closeProjectModal"
  >
    <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingProject?.id ? 'Edit Project' : 'Create Project' }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              size="sm"
              @click="closeProjectModal"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
            <UInput v-model="editingProject.name" placeholder="My Project" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <UTextarea v-model="editingProject.description" placeholder="Project description..." :rows="3" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <USelectMenu
              v-model="editingProject.companyid"
              :items="companies.map(c => ({ label: c.companyname, id: c.companyid }))"
              value-key="id"
              placeholder="Select company"
              searchable
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                v-model="editingProject.startdate"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                v-model="editingProject.enddate"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
            <div class="flex gap-2">
              <div
                v-for="color in projectColors"
                :key="color"
                class="w-8 h-8 rounded-full cursor-pointer border-2 transition-all"
                :class="editingProject.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
                :style="{ backgroundColor: color }"
                @click="editingProject.color = color"
              ></div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="closeProjectModal">
              Cancel
            </UButton>
            <UButton color="primary" @click="saveProject">
              {{ editingProject?.id ? 'Save' : 'Create' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div 
    v-if="isDeleteModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="isDeleteModalOpen = false"
  >
    <div class="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Project?</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{{ projectToDelete?.name }}"? All cards and data will be lost.
        </p>
        <div class="flex gap-2 justify-center">
          <UButton color="gray" variant="ghost" @click="isDeleteModalOpen = false">
            Cancel
          </UButton>
          <UButton color="red" @click="confirmDeleteProject">
            Delete
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Column Manager Modal -->
  <div 
    v-if="isColumnManagerOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="closeColumnManager"
  >
    <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manage Columns</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm" @click="closeColumnManager" />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Existing Columns -->
          <div class="space-y-2">
            <div 
              v-for="(column, index) in columns" 
              :key="column.status"
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <!-- Icon Input -->
              <UInput 
                v-model="column.icon" 
                placeholder="📋" 
                size="sm" 
                class="w-16"
                :ui="{ base: 'text-center text-lg' }"
              />
              
              <!-- Title Input -->
              <UInput 
                v-model="column.title" 
                placeholder="Column Title" 
                size="sm" 
                class="flex-1"
              />
              
              <!-- Status Key Input -->
              <UInput 
                v-model="column.status" 
                placeholder="status_key" 
                size="sm" 
                class="w-32"
              />
              
              <!-- Color Picker -->
              <div class="relative">
                <input
                  v-model="column.color"
                  type="color"
                  class="w-10 h-8 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                  :title="column.color"
                />
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-1">
                <UButton 
                  icon="i-heroicons-arrow-up" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="index === 0"
                  @click="moveColumn(index, -1)"
                />
                <UButton 
                  icon="i-heroicons-arrow-down" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="index === columns.length - 1"
                  @click="moveColumn(index, 1)"
                />
                <UButton 
                  icon="i-heroicons-trash" 
                  size="xs" 
                  color="red" 
                  variant="ghost"
                  @click="deleteColumn(index)"
                />
              </div>
            </div>
          </div>

          <!-- Add New Column -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <UButton 
              block 
              color="primary" 
              variant="soft" 
              icon="i-heroicons-plus"
              @click="addColumn"
            >
              Add Column
            </UButton>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="closeColumnManager">Cancel</UButton>
            <UButton color="primary" @click="saveColumns">Save Columns</UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>

  <!-- Trello-Style Card Detail Modal    <!-- Card Details Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
      <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <UCard 
          class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full my-8 shadow-xl"
          @click.stop
          @paste="handlePaste"
          :ui="{ body: { padding: 'p-0' }, header: { padding: 'px-6 py-4' }, ring: '', divide: '' }"
        >
        <template #header>
          <div class="flex items-start justify-between">
            <div class="flex-1 pr-4">
              <div class="flex items-start gap-3 mb-2">
                <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1 flex-shrink-0" />
                <UInput
                  v-model="editingCard.title"
                  placeholder="Card title"
                  size="xl"
                  :ui="{ base: 'font-semibold text-xl w-full' }"
                  class="flex-1"
                />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 ml-9">
                in list <span class="font-medium">{{ getColumnName(editingCard.status) }}</span>
              </p>
            </div>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              class="flex-shrink-0"
              @click="closeModal"
            />
          </div>
        </template>

        <div class="grid grid-cols-12 gap-6 p-6">
          <!-- Main Content (Left Side) -->
          <div class="col-span-9 space-y-6">
            
            <!-- Description Section -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="i-heroicons-bars-3-bottom-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h3>
              </div>
              <UTextarea
                v-model="editingCard.description"
                placeholder="Add a more detailed description..."
                :rows="5"
                class="w-full"
              />
            </div>

            <!-- Attachments Section -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-paper-clip" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments</h3>
                </div>
                <label class="cursor-pointer">
                  <UButton
                    icon="i-heroicons-plus"
                    size="xs"
                    color="gray"
                    variant="soft"
                    as="span"
                  >
                    Add
                  </UButton>
                  <input
                    type="file"
                    multiple
                    @change="handleFileUpload"
                    class="hidden"
                  />
                </label>
              </div>
              
              <!-- Attachments List -->
              <div v-if="editingCard.attachments && editingCard.attachments.length > 0" class="space-y-3">
                <div
                  v-for="(file, idx) in editingCard.attachments"
                  :key="idx"
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden"
                >
                  <!-- File info row -->
                  <div class="flex items-center justify-between p-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <UIcon 
                        :name="file.type?.startsWith('image/') ? 'i-heroicons-photo' : 'i-heroicons-document'" 
                        class="w-5 h-5 text-gray-500 flex-shrink-0" 
                      />
                      <div class="flex-1 min-w-0">
                        <button
                          @click="viewAttachment(file)"
                          class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline truncate block text-left"
                        >
                          {{ file.name }}
                        </button>
                        <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                      </div>
                    </div>
                    <UButton
                      icon="i-heroicons-trash"
                      size="xs"
                      color="red"
                      variant="ghost"
                      @click="removeAttachment(idx)"
                    />
                  </div>
                  
                  <!-- Image preview -->
                  <div v-if="file.type?.startsWith('image/') && file.preview" class="px-3 pb-3">
                    <img 
                      :src="file.preview" 
                      :alt="file.name"
                      class="max-w-full h-auto rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90"
                      style="max-height: 300px;"
                      @click="viewAttachment(file)"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Empty state -->
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic py-2">
                No attachments yet. Click "Add" or paste (Ctrl+V) to attach files.
              </div>
            </div>

            <!-- Time Tracking Section -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Tracking</h3>
                </div>
                <UButton 
                  icon="i-heroicons-plus" 
                  size="xs" 
                  color="primary" 
                  variant="soft"
                  @click="addTimeEntry"
                >
                  Add Entry
                </UButton>
              </div>
              
              <!-- Time Entries List -->
              <div v-if="editingCard.timeEntries && editingCard.timeEntries.length > 0" class="space-y-3">
                <div
                  v-for="(entry, idx) in editingCard.timeEntries"
                  :key="idx"
                  class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div class="grid grid-cols-2 gap-2 mb-2">
                    <!-- Start DateTime -->
                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Start
                      </label>
                      <input
                        v-model="entry.start"
                        type="datetime-local"
                        class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <!-- End DateTime -->
                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        End
                      </label>
                      <input
                        v-model="entry.end"
                        type="datetime-local"
                        class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <!-- Note -->
                  <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Note (optional)
                    </label>
                    <input
                      v-model="entry.note"
                      type="text"
                      placeholder="What did you work on?"
                      class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <!-- Duration & Remove -->
                  <div class="flex items-center justify-between">
                    <div v-if="entry.start && entry.end" class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {{ calculateEntryDuration(entry) }}
                    </div>
                    <UButton 
                      icon="i-heroicons-trash" 
                      size="2xs" 
                      color="red" 
                      variant="ghost"
                      @click="removeTimeEntry(idx)"
                    />
                  </div>
                </div>
                
                <!-- Total Duration -->
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Time Logged:</span>
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ calculateTotalDuration }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic py-2">
                No time entries yet. Click "Add Entry" to start tracking time.
              </div>
            </div>

            <!-- Activity Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-heroicons-list-bullet" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity</h3>
              </div>
              <div class="space-y-3">
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-user" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <UTextarea
                      placeholder="Write a comment..."
                      :rows="2"
                      class="w-full"
                    />
                    <div class="mt-2">
                      <UButton size="xs" color="primary">Save</UButton>
                    </div>
                  </div>
                </div>
                
                <!-- Sample Activity -->
                <div v-if="isEditMode" class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
                    {{ editingCard.assignee?.charAt(0) || 'U' }}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm">
                      <span class="font-semibold">{{ editingCard.assignee || 'User' }}</span>
                      <span class="text-gray-500 dark:text-gray-400"> added this card to {{ getColumnName(editingCard.status) }}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Just now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar (Right Side) -->
          <div class="col-span-3 space-y-4">
            <!-- Card Details Section -->
            <div>
              <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Card Details</h4>
              <div class="space-y-3">
                <!-- Priority -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <UIcon name="i-heroicons-flag" class="w-3 h-3 inline mr-1" />
                    Priority
                  </label>
                  <select
                    v-model="editingCard.priority"
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <!-- Assignee -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <UIcon name="i-heroicons-user" class="w-3 h-3 inline mr-1" />
                    Assignee
                  </label>
                  <USelectMenu
                    v-model="editingCard.assignee"
                    :items="activeProject?.members?.map((u: any) => ({ label: u.realname || u.email, id: u.userid || u.email })) || []"
                    value-key="id"
                    placeholder="Select assignee"
                    searchable
                    class="w-full"
                  />
                  <!-- Show assignee avatar if assigned -->
                  <div v-if="editingCard.assignee" class="mt-2 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                      {{ editingCard.assignee.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ editingCard.assignee }}</span>
                  </div>
                </div>

                <!-- Tags/Labels -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <UIcon name="i-heroicons-tag" class="w-3 h-3 inline mr-1" />
                    Labels
                  </label>
                  <UInput 
                    v-model="tagsInput" 
                    placeholder="tag1, tag2, tag3" 
                    size="sm"
                    @blur="updateTags"
                  />
                  <!-- Show existing tags -->
                  <div v-if="parseTagsArray(editingCard.tags).length > 0" class="mt-2 flex flex-wrap gap-1">
                    <UBadge
                      v-for="(tag, idx) in parseTagsArray(editingCard.tags)"
                      :key="idx"
                      color="blue"
                      variant="soft"
                      size="sm"
                    >
                      {{ tag }}
                    </UBadge>
                  </div>
                </div>

                <!-- Due Date -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 inline mr-1" />
                    Due Date
                  </label>
                  <UInput 
                    v-model="editingCard.duedate" 
                    type="date" 
                    size="sm" 
                  />
                </div>
              </div>
            </div>

            <!-- Actions Section -->
            <div>
              <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Actions</h4>
              <div class="space-y-2">
                <UButton 
                  block 
                  color="primary" 
                  variant="solid" 
                  size="sm" 
                  class="justify-start" 
                  @click="saveCard"
                >
                  <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
                  {{ isEditMode ? 'Save' : 'Create' }}
                </UButton>
                <UButton
                  v-if="isEditMode"
                  block
                  color="red"
                  variant="soft"
                  size="sm"
                  class="justify-start"
                  @click="deleteCard"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
                  Delete
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <!-- Statistics Modal -->
  <div 
    v-if="isStatisticsModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="closeStatisticsModal"
  >
    <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Project Statistics</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm" @click="closeStatisticsModal" />
          </div>
        </template>

        <div v-if="projectStats" class="space-y-6">
          <!-- Overview Cards -->
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ projectStats.totalCards }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ projectStats.doneCards }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ projectStats.completionRate }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Progress</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="font-medium">Overall Progress</span>
              <span class="text-gray-600 dark:text-gray-400">{{ projectStats.completionRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                class="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                :style="{ width: projectStats.completionRate + '%' }"
              ></div>
            </div>
          </div>

          <!-- Cards by Status -->
          <div>
            <h4 class="font-semibold mb-3">Cards by Status</h4>
            <div class="space-y-2">
              <div v-for="item in projectStats.cardsByStatus" :key="item.status" class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
                <span class="flex-1 text-sm">{{ item.status }}</span>
                <span class="font-semibold">{{ item.count }}</span>
              </div>
            </div>
          </div>

          <!-- Project Info -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Project created {{ projectStats.daysSinceCreation }} days ago
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <!-- Template Selection Modal -->
  <div 
    v-if="isTemplateModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="() => isTemplateModalOpen = false"
  >
    <div class="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Choose a Template</h3>
        </template>

        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="template in projectTemplates"
            :key="template.id"
            class="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            @click="selectTemplate(template)"
          >
            <div class="text-4xl mb-3">{{ template.icon }}</div>
            <h4 class="font-semibold mb-1">{{ template.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ template.description }}</p>
            <div class="mt-3 text-xs text-gray-500">
              {{ template.columns.length }} columns
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <!-- Members Modal -->
  <div 
    v-if="isMembersModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4"
    @click.self="closeMembersModal"
  >
    <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Project Members</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm" @click="closeMembersModal" />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Add Member Form -->
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 class="font-medium mb-3">Add New Member</h4>
            <div class="flex gap-2">
              <USelectMenu
                v-model="newMemberEmail"
                              :items="users.map(c => ({ label: c.username, id: c.useraccessid }))"
              value-key="id"
                searchable
                placeholder="Search user"
                class="flex-1"
              />
              <select v-model="newMemberRole" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <UButton icon="i-heroicons-plus" color="primary" @click="addMember">Add</UButton>
            </div>
          </div>

          <!-- Members List -->
          <div class="space-y-2">
            <div
              v-for="member in activeProject?.members"
              :key="member.userId"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {{ member.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div>
                  <div class="font-medium">{{ member.name }}</div>
                  <div class="text-sm text-gray-500">{{ member.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <select 
                  :value="member.role"
                  @change="updateMemberRole(member, $event.target.value)"
                  class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  :disabled="member.role === 'owner'"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                <UButton 
                  v-if="member.role !== 'owner'"
                  icon="i-heroicons-trash" 
                  size="xs" 
                  color="red" 
                  variant="ghost"
                  @click="removeMember(member)"
                />
              </div>
            </div>
            <div v-if="!activeProject?.members || activeProject.members.length === 0" class="text-center py-8 text-gray-500">
              No members yet. Add someone to collaborate!
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '#imports';

definePageMeta({
  layout: 'auth',
});

const toast = useToast();
const api = useApi();

// Project Management
const projects = ref<any[]>([]);
const activeProject = ref<any>(null);
const isProjectModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingProject = ref<any>({});
const projectToDelete = ref<any>(null);
const showArchived = ref(false);

// Helper function to convert ISO datetime to datetime-local format
// Converts: "2025-12-21T09:00:00Z" -> "2025-12-21T09:00"
const formatDateTimeForInput = (isoDateTime: string) => {
  if (!isoDateTime) return '';
  
  // Remove 'Z' and milliseconds if present
  // Input: "2025-12-21T09:00:00Z" or "2025-12-21T09:00:00.000Z"
  // Output: "2025-12-21T09:00"
  return isoDateTime.replace(/\.\d{3}Z$/, '').replace('Z', '').slice(0, 16);
};

// Helper function to convert ISO date to date input format
// Converts: "2025-12-21T00:00:00Z" or "2025-12-21" -> "2025-12-21"
const formatDateForInput = (isoDate: string) => {
  if (!isoDate) return '';
  
  // Extract just the date part (YYYY-MM-DD)
  // Handle both "2025-12-21T00:00:00Z" and "2025-12-21" formats
  return isoDate.split('T')[0];
};

// Users list for assignee dropdown
const users = ref<any[]>([]);

// Load users from API
const loadUsers = async () => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchuserauth');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    if (res.data?.data && Array.isArray(res.data.data)) {
      users.value = res.data.data;
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

// Load project members
const loadProjectMembers = async () => {
  if (!activeProject.value || !activeProject.value.projectid) return;
  
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchprojectmember');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('search', 'true');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    if (res.data?.data && Array.isArray(res.data.data)) {
      activeProject.value.members = res.data.data;
      console.log('Project members loaded:', activeProject.value.members);
    } else {
        activeProject.value.members = [];
    }
  } catch (error) {
    console.error('Error loading project members:', error);
    activeProject.value.members = [];
  }
};

// Companies list for project company dropdown
const companies = ref<any[]>([]);

// Load companies from API
const loadCompanies = async () => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchcompanyauth');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    console.log('=== COMPANY RESPONSE DEBUG ===');
    console.log('Full response:', JSON.stringify(res, null, 2));
    console.log('res.data type:', typeof res.data);
    console.log('res.data:', res.data);
    
    // Try multiple possible structures
    let companyData = null;
    
    // Option 1: res.data.data.data (nested)
    if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
      companyData = res.data.data.data;
      console.log('✅ Found at res.data.data.data');
    }
    // Option 2: res.data.data (single nested)
    else if (res.data?.data && Array.isArray(res.data.data)) {
      companyData = res.data.data;
      console.log('✅ Found at res.data.data');
    }
    // Option 3: res.data (direct)
    else if (Array.isArray(res.data)) {
      companyData = res.data;
      console.log('✅ Found at res.data');
    }
    
    if (companyData && companyData.length > 0) {
      companies.value = companyData;
      console.log('✅ Companies loaded:', companies.value);
    } else {
      console.error('❌ No company data found in any expected location');
      console.log('Available keys in res:', Object.keys(res));
      console.log('Available keys in res.data:', res.data ? Object.keys(res.data) : 'N/A');
    }
  } catch (error) {
    console.error('❌ Error loading companies:', error);
  }
};

// ========== ADVANCED FEATURES ==========

// Project Templates
const projectTemplates = [
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Agile software development workflow',
    icon: '💻',
    columns: [
      { status: 'backlog', title: 'Backlog', icon: '📋', color: '#6b7280' },
      { status: 'todo', title: 'To Do', icon: '📝', color: '#3b82f6' },
      { status: 'inprogress', title: 'In Progress', icon: '⚡', color: '#f59e0b' },
      { status: 'codereview', title: 'Code Review', icon: '👀', color: '#8b5cf6' },
      { status: 'testing', title: 'Testing', icon: '🧪', color: '#ec4899' },
      { status: 'done', title: 'Done', icon: '✅', color: '#10b981' },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Plan and execute marketing campaigns',
    icon: '📢',
    columns: [
      { status: 'ideas', title: 'Ideas', icon: '💡', color: '#f59e0b' },
      { status: 'planning', title: 'Planning', icon: '📋', color: '#3b82f6' },
      { status: 'inprogress', title: 'In Progress', icon: '⚡', color: '#8b5cf6' },
      { status: 'review', title: 'Review', icon: '👀', color: '#ec4899' },
      { status: 'published', title: 'Published', icon: '✅', color: '#10b981' },
    ]
  },
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch',
    icon: '📄',
    columns: [
      { status: 'backlog', title: 'Backlog', icon: '📋', color: '#6b7280' },
      { status: 'todo', title: 'To Do', icon: '📝', color: '#3b82f6' },
      { status: 'inprogress', title: 'In Progress', icon: '⚡', color: '#f59e0b' },
      { status: 'review', title: 'Review', icon: '👀', color: '#8b5cf6' },
      { status: 'done', title: 'Done', icon: '✅', color: '#10b981' },
    ]
  }
];

const isTemplateModalOpen = ref(false);
const selectedTemplate = ref<any>(null);

// Statistics Modal
const isStatisticsModalOpen = ref(false);

const projectStats = computed(() => {
  if (!activeProject.value) return null;
  
  const projectCards = tasks.value;
  const totalCards = projectCards.length;
  const doneCards = projectCards.filter((c: any) => c.status === 'done').length;
  const completionRate = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;
  
  // Cards by status
  const cardsByStatus = columns.value.map((col: any) => ({
    status: col.title,
    count: projectCards.filter((c: any) => c.status === col.status).length,
    color: col.color
  }));
  
  // Project age
  const createdDate = new Date(activeProject.value.createdat || activeProject.value.createdAt);
  const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    totalCards,
    doneCards,
    completionRate,
    cardsByStatus,
    daysSinceCreation
  };
});

// Members Management
const isMembersModalOpen = ref(false);
const newMemberEmail = ref('');
const newMemberRole = ref('member');

// Load projects on mount
onMounted(async () => {
  await loadProjects();
  await loadUsers();
  await loadCompanies();
});

// Load projects from API
const loadProjects = async () => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchprojects');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    // Filter by archive status - MySQL uses 0/1 for BOOLEAN
    dataForm.append('archived', showArchived.value ? '1' : '0');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    if (res.data && Array.isArray(res.data.data)) {
      projects.value = res.data.data.map((data: any)=>({
        ...data,
        startdate: formatDateTimeForInput(data.startdate),
        enddate: formatDateTimeForInput(data.enddate)
      }));
      console.log(projects.value)
      
      // Set first project if none selected
      if (!activeProject.value && projects.value.length > 0) {
        activeProject.value = projects.value[0];
        await loadCards();
        await loadColumns();
      }
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to load projects',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};

// Load cards for active project
const loadCards = async () => {
  if (!activeProject.value) return;
  
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'getcards');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('search', 'true');
    
    let res = await api.post('/api/admin/execute-flow', dataForm);
    
    if (res.data && Array.isArray(res.data.data)) {
      tasks.value = res.data.data.map((card: any) => ({
        ...card,
        tags: Array.isArray(card.tags) ? card.tags : (card.tags ? JSON.parse(card.tags) : []),
        timeEntries: card.timeEntries || [],
        attachments: card.attachments || []
      }));
      
      for (let i = 0; i < tasks.value.length; i++) {
        const card = tasks.value[i];
        let dataForm = new FormData();
        dataForm.append('flowname', 'getcardtime');
        dataForm.append('menu', 'admin');
        dataForm.append('cardid', card.cardid.toString());
        dataForm.append('search', 'true');
        
        let res = await api.post('/api/admin/execute-flow', dataForm);
        
        if (res.data && Array.isArray(res.data.data)) {
          // Convert ISO datetime to datetime-local format for input fields
          tasks.value[i].timeEntries = res.data.data.map((entry: any) => ({
            ...entry,
            start: formatDateTimeForInput(entry.startdatetime),
            end: formatDateTimeForInput(entry.enddatetime)
          }));
        }

        dataForm = new FormData();
        dataForm.append('flowname', 'getcardattachment');
        dataForm.append('menu', 'admin');
        dataForm.append('cardid', card.cardid.toString());
        dataForm.append('search', 'true');
        
        res = await api.post('/api/admin/execute-flow', dataForm);
        
        if (res.data && Array.isArray(res.data.data)) {
          tasks.value[i].attachments = res.data.data;
        }
      }
    }
  } catch (error) {
    console.error('Error loading cards:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to load cards',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Load columns for active project
const loadColumns = async () => {
  if (!activeProject.value) return;
  
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'getprojectcolumns');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('search', 'true');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    if (res.data && Array.isArray(res.data.data)) {
      columns.value = res.data.data.sort((a, b) => a.position - b.position);
    }
  } catch (error) {
    console.error('Error loading columns:', error);
    // Use default columns if load fails
    columns.value = [
      { status: 'backlog', title: 'Backlog', icon: '📋', color: '#6b7280' },
      { status: 'todo', title: 'To Do', icon: '📝', color: '#3b82f6' },
      { status: 'inprogress', title: 'In Progress', icon: '⚡', color: '#f59e0b' },
      { status: 'review', title: 'Review', icon: '👀', color: '#8b5cf6' },
      { status: 'done', title: 'Done', icon: '✅', color: '#10b981' },
    ];
  }
};
// Select project
const selectProject = async (project: any) => {
  activeProject.value = project;
  await loadCards();
  await loadColumns();
  await loadProjectMembers();
};
// Save project (create or update)
const saveProject = async () => {
  if (!editingProject.value.name) {
    toast.add({
      title: 'Validation Error',
      description: 'Project name is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  if (!editingProject.value.companyid) {
    toast.add({
      title: 'Validation Error',
      description: 'Company is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  if (!editingProject.value.description) {
    toast.add({
      title: 'Validation Error',
      description: 'Description is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  if (!editingProject.value.startdate) {
    toast.add({
      title: 'Validation Error',
      description: 'start date is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  if (!editingProject.value.enddate) {
    toast.add({
      title: 'Validation Error',
      description: 'end date is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  try {
    const dataForm = new FormData();
    
    dataForm.append('flowname', 'modifproject');
    if (editingProject.value.projectid) {
      dataForm.append('projectid', editingProject.value.projectid.toString());
    }
    
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'false');
    dataForm.append('name', editingProject.value.name || '');
    dataForm.append('description', editingProject.value.description || '');
    dataForm.append('color', editingProject.value.color || '#3b82f6');
    dataForm.append('companyid', editingProject.value.companyid);
    dataForm.append('startdate', editingProject.value.startdate || '');
    dataForm.append('enddate', editingProject.value.enddate || '');
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    toast.add({
      title: editingProject.value.projectid ? 'Project Updated' : 'Project Created',
      description: editingProject.value.projectid 
        ? 'Project has been updated successfully' 
        : 'Project has been created successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
    closeProjectModal();
    await loadProjects();
    
    // Select newly created project
    if (!editingProject.value.projectid && res.data?.projectid) {
      const newProject = projects.value.find(p => p.projectid === res.data.projectid);
      if (newProject) {
        await selectProject(newProject);
      }
    }
  } catch (error) {
    console.error('Error saving project:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to save project',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Delete project
const confirmDeleteProject = async () => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'deleteproject');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', projectToDelete.value.projectid.toString());
    
    await api.post('/api/admin/execute-flow', dataForm);
    toast.add({
      title: 'Project Deleted',
      description: 'Project has been deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
    isDeleteModalOpen.value = false;
    projectToDelete.value = null;
    
    await loadProjects();
    
    // Select another project if deleted project was active
    if (activeProject.value?.projectid === projectToDelete.value?.projectid) {
      const firstActive = projects.value.find(p => !p.archived);
      if (firstActive) {
        await selectProject(firstActive);
      } else {
        activeProject.value = null;
      }
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to delete project',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Archive/Unarchive project
const toggleArchiveProject = async (project: any) => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'archiveproject');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', project.projectid.toString());
    dataForm.append('archived', (!project.archived).toString());
    
    await api.post('/api/admin/execute-flow', dataForm);
    toast.add({
      title: project.archived ? 'Project Restored' : 'Project Archived',
      description: project.archived ? 'Project has been restored' : 'Project has been archived',
      color: 'green',
      icon: project.archived ? 'i-heroicons-arrow-uturn-left' : 'i-heroicons-archive-box',
    });
    
    await loadProjects();
    
    // If archiving the active project, switch to another
    if (!project.archived && activeProject.value?.projectid === project.projectid) {
      const firstActive = projects.value.find(p => !p.archived);
      if (firstActive) {
        await selectProject(firstActive);
      } else {
        activeProject.value = null;
      }
    }
  } catch (error) {
    console.error('Error archiving project:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to update project',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Save card (create or update)
const saveCard = async () => {
  if (!editingCard.value.title) {
    toast.add({
      title: 'Validation Error',
      description: 'Card title is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  try {
    const dataForm = new FormData();
    
    dataForm.append('flowname', 'modifcard');

    if (editingCard.value.cardid) {
      dataForm.append('cardid', editingCard.value.cardid.toString());
    }
    
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('menu', 'admin');
    dataForm.append('search', false);
    dataForm.append('title', editingCard.value.title);
    dataForm.append('description', editingCard.value.description || '');
    dataForm.append('status', editingCard.value.status);
    dataForm.append('assignee', editingCard.value.assignee || '');
    dataForm.append('duedate', editingCard.value.duedate || '');
    dataForm.append('priority', editingCard.value.priority || 'medium');
    dataForm.append('tags', JSON.stringify(editingCard.value.tags || []));
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    // Save time entries if any
    if (editingCard.value.timeEntries && editingCard.value.timeEntries.length > 0) {
      const cardid = editingCard.value.cardid || res.data?.cardid;
      if (cardid) {
        await saveTimeEntries(cardid, editingCard.value.timeEntries);
      }
    }
    toast.add({
      title: editingCard.value.cardid ? 'Card Updated' : 'Card Created',
      description: editingCard.value.cardid 
        ? 'Card has been updated successfully' 
        : 'Card has been created successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
    closeModal();
    await loadCards();
  } catch (error) {
    console.error('Error saving card:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to save card',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Delete card
const deleteCard = async () => {
  if (!editingCard.value.cardid) return;
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'deletecard');
    dataForm.append('menu', 'admin');
    dataForm.append('cardid', editingCard.value.cardid.toString());
    
    await api.post('/api/admin/execute-flow', dataForm);
    toast.add({
      title: 'Card Deleted',
      description: 'Card has been deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
    closeModal();
    await loadCards();
  } catch (error) {
    console.error('Error deleting card:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to delete card',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Save time entries
const saveTimeEntries = async (cardid: number, entries: any[]) => {
  for (const entry of entries) {
    if (!entry.start || !entry.end) continue;
    
    try {
      const dataForm = new FormData();
      
      if (entry.cardtimeentryid) {
        dataForm.append('flowname', 'updatetimeentry');
        dataForm.append('cardtimeentryid', entry.cardtimeentryid.toString());
      } else {
        dataForm.append('flowname', 'createtimeentry');
        dataForm.append('cardid', cardid.toString());
      }
      
      dataForm.append('menu', 'admin');
      dataForm.append('startdatetime', entry.start);
      dataForm.append('enddatetime', entry.end);
      dataForm.append('note', entry.note || '');
      
      await api.post('/api/admin/execute-flow', dataForm);
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  }
};
// Save columns
const saveColumns = async () => {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'saveprojectcolumns');
    dataForm.append('menu', 'admin');
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('columns', JSON.stringify(columns.value));
    
    await api.post('/api/admin/execute-flow', dataForm);
    
    toast.add({
      title: 'Columns Saved',
      description: 'Column configuration has been updated',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
    
    closeColumnManager();
  } catch (error) {
    console.error('Error saving columns:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to save columns',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0 && editingCard.value.cardid) {
    for (const file of Array.from(files)) {
      try {
        const dataForm = new FormData();
        dataForm.append('flowname', 'uploadattachment');
        dataForm.append('menu', 'admin');
        dataForm.append('cardid', editingCard.value.cardid.toString());
        dataForm.append('file', file);
        
        const res = await api.post('/api/admin/execute-flow', dataForm);
        
        if (res.data) {
          const attachment: any = {
            cardattachmentid: res.data.cardattachmentid,
            filename: res.data.filename,
            originalfilename: file.name,
            filepath: res.data.filepath,
            filesize: file.size,
            mimetype: file.type,
          };
          // Generate preview for images
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              attachment.preview = e.target?.result;
            };
            reader.readAsDataURL(file);
          }
          if (!editingCard.value.attachments) {
            editingCard.value.attachments = [];
          }
          editingCard.value.attachments.push(attachment);
        }
        
        toast.add({
          title: 'File Uploaded',
          description: `${file.name} uploaded successfully`,
          color: 'green',
          icon: 'i-heroicons-check-circle',
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.add({
          title: 'Upload Failed',
          description: `Failed to upload ${file.name}`,
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle',
        });
      }
    }
  }
};
// Remove attachment
const removeAttachment = async (index: number) => {
  const attachment = editingCard.value.attachments[index];
  
  if (attachment.cardattachmentid) {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'deleteattachment');
      dataForm.append('menu', 'admin');
      dataForm.append('cardattachmentid', attachment.cardattachmentid.toString());
      
      await api.post('/api/admin/execute-flow', dataForm);
      
      toast.add({
        title: 'Attachment Removed',
        description: 'File has been deleted',
        color: 'orange',
        icon: 'i-heroicons-trash',
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.add({
        title: 'Error',
        description: 'Failed to delete attachment',
        color: 'red',
        icon: 'i-heroicons-exclamation-triangle',
      });
      return;
    }
  }
  
  editingCard.value.attachments.splice(index, 1);
};

const projectColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

// Column Management
const columns = ref([
  { status: 'backlog', title: 'Backlog', icon: '📋', color: '#6b7280' },
  { status: 'todo', title: 'To Do', icon: '📝', color: '#3b82f6' },
  { status: 'inprogress', title: 'In Progress', icon: '⚡', color: '#f59e0b' },
  { status: 'review', title: 'Review', icon: '👀', color: '#8b5cf6' },
  { status: 'done', title: 'Done', icon: '✅', color: '#10b981' },
]);

const isColumnManagerOpen = ref(false);

const openColumnManager = () => {
  isColumnManagerOpen.value = true;
};

const closeColumnManager = () => {
  isColumnManagerOpen.value = false;
};

const addColumn = () => {
  const newColumn = {
    status: `column_${Date.now()}`,
    title: 'New Column',
    icon: '📌',
    color: '#6b7280',
  };
  columns.value.push(newColumn);
};

const deleteColumn = (index: number) => {
  if (columns.value.length <= 1) {
    toast.add({
      title: 'Cannot Delete',
      description: 'You must have at least one column',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
    return;
  }
  columns.value.splice(index, 1);
};

const moveColumn = (index: number, direction: number) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= columns.value.length) return;
  
  const temp = columns.value[index];
  columns.value[index] = columns.value[newIndex];
  columns.value[newIndex] = temp;
};

// Column Drag and Drop

const draggedColumnIndex = ref<number | null>(null);

const onColumnDragStart = (event: DragEvent, index: number) => {
  draggedColumnIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', ''); // Required for Firefox
  }
  // Add visual feedback
  (event.target as HTMLElement).style.opacity = '0.5';
};

const onColumnDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  
  // Reorder columns while dragging
  if (draggedColumnIndex.value !== null && draggedColumnIndex.value !== index) {
    const draggedColumn = columns.value[draggedColumnIndex.value];
    columns.value.splice(draggedColumnIndex.value, 1);
    columns.value.splice(index, 0, draggedColumn);
    draggedColumnIndex.value = index;
  }
};

const onColumnDragEnd = (event: DragEvent) => {
  // Reset opacity
  (event.target as HTMLElement).style.opacity = '1';
  draggedColumnIndex.value = null;
  
  toast.add({
    title: 'Column Moved',
    description: 'Column order has been updated',
    color: 'blue',
    icon: 'i-heroicons-arrows-right-left',
  });
};

// Column Context Menu
const contextMenuColumn = ref<any>(null);
const contextMenuIndex = ref<number | null>(null);

const openColumnContextMenu = (event: MouseEvent, column: any, index: number) => {
  contextMenuColumn.value = column;
  contextMenuIndex.value = index;
  openColumnManager();
};

// Column Header Color Helper
const getColumnHeaderColor = (color: string) => {
  // If it's already a hex color, return it
  if (color.startsWith('#')) {
    return color;
  }
  
  // Fallback for old color names (for backward compatibility)
  const colorMap: Record<string, string> = {
    gray: '#6b7280',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
  };
  return colorMap[color] || color;
};

// Project CRUD Operations

const closeProjectModal = () => {
  isProjectModalOpen.value = false;
  editingProject.value = {};
};

const openDeleteModal = (project: any) => {

  projectToDelete.value = project;
  isDeleteModalOpen.value = true;
};

// Filtered projects - now filtered on backend, so just return all
const filteredProjects = computed(() => {
  return projects.value;
});

// Watch for archive toggle changes and reload projects
watch(showArchived, async () => {
  await loadProjects();
});


const getProjectActions = (project: any) => {
  return [[
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      click: () => openProjectModal(project),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => openDeleteModal(project),
    },
  ]];
};

// Sample tasks data (filtered by project) - now loaded from API
const tasks = ref<any[]>([]);

// Drag and drop

const draggedCard = ref<any>(null);
const isDragging = ref(false);

const onDragStart = (event: DragEvent, card: any) => {
  isDragging.value = true;
  draggedCard.value = card;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDragEnd = () => {
  // Small delay to prevent click event from firing after drag
  setTimeout(() => {
    isDragging.value = false;
  }, 100);
};

const handleCardClick = (card: any) => {
  // Don't open modal if we just finished dragging
  if (isDragging.value) {
    return;
  }
  openEditModal(card);
};

const onDrop = (event: DragEvent, newStatus: string) => {
  event.preventDefault();
  
  if (!draggedCard.value) return;
  
  const oldStatus = draggedCard.value.status;
  if (oldStatus === newStatus) {
    draggedCard.value = null;
    return;
  }

  // Update card status
  draggedCard.value.status = newStatus;
  
  toast.add({
    title: 'Card Moved',
    description: `Moved to ${getColumnName(newStatus)}`,
    color: 'green',
    icon: 'i-heroicons-check-circle',
  });

  draggedCard.value = null;
};

// Modal state
const isModalOpen = ref(false);
const isEditMode = ref(false);
const editingCard = ref<any>({
  id: null,
  title: '',
  description: '',
  status: '',
  assignee: '',
  duedate: '',
  priority: 'medium',
  tags: [],
  attachments: [],
  timeEntries: [],
});
const tagsInput = ref('');

// Time Tracking Functions
const addTimeEntry = () => {
  if (!editingCard.value.timeEntries) {
    editingCard.value.timeEntries = [];
  }
  
  editingCard.value.timeEntries.push({
    start: '',
    end: '',
    note: ''
  });
};

const removeTimeEntry = (index: number) => {
  editingCard.value.timeEntries.splice(index, 1);
  toast.add({
    title: 'Time Entry Removed',
    color: 'orange',
    icon: 'i-heroicons-clock',
  });
};

const calculateEntryDuration = (entry: any) => {
  if (!entry.start || !entry.end) return '';
  
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  
  if (end <= start) return 'Invalid';
  
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    const remainingMins = diffMins % 60;
    return `${diffDays}d ${remainingHours}h ${remainingMins}m`;
  } else if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  } else {
    return `${diffMins}m`;
  }
};

const calculateTotalDuration = computed(() => {
  if (!editingCard.value.timeEntries || editingCard.value.timeEntries.length === 0) {
    return '0m';
  }
  
  let totalMs = 0;
  
  editingCard.value.timeEntries.forEach((entry: any) => {
    if (entry.start && entry.end) {
      const start = new Date(entry.start);
      const end = new Date(entry.end);
      
      if (end > start) {
        totalMs += end.getTime() - start.getTime();
      }
    }
  });
  
  const totalMins = Math.floor(totalMs / 60000);
  const totalHours = Math.floor(totalMins / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  if (totalDays > 0) {
    const remainingHours = totalHours % 24;
    const remainingMins = totalMins % 60;
    return `${totalDays}d ${remainingHours}h ${remainingMins}m`;
  } else if (totalHours > 0) {
    const remainingMins = totalMins % 60;
    return `${totalHours}h ${remainingMins}m`;
  } else {
    return `${totalMins}m`;
  }
});

// Calculate duration between start and end datetime (legacy - keeping for compatibility)
const calculateDuration = computed(() => {
  return '';
});

// Handle paste event for clipboard images

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  
  if (!items) return;
  
  let imageFound = false;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Check if the item is an image
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      
      if (file) {
        if (!editingCard.value.attachments) {
          editingCard.value.attachments = [];
        }
        
        // Generate a filename with timestamp
        const timestamp = new Date().getTime();
        const extension = file.type.split('/')[1] || 'png';
        const filename = `pasted-image-${timestamp}.${extension}`;
        
        const attachment: any = {
          name: filename,
          size: file.size,
          type: file.type,
          file: file,
        };
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result;
        };
        reader.readAsDataURL(file);
        
        editingCard.value.attachments.push(attachment);
        imageFound = true;
      }
    }
  }
  
  if (imageFound) {
    toast.add({
      title: 'Image Pasted',
      description: 'Screenshot added to attachments',
      color: 'green',
      icon: 'i-heroicons-photo',
    });
  }
};

// View attachment (open in new tab or download)
const viewAttachment = (file: any) => {
  if (file.preview || file.file) {
    const url = file.preview || URL.createObjectURL(file.file);
    
    if (file.type?.startsWith('image/')) {
      // Open image in new tab
      window.open(url, '_blank');
    } else {
      // Download file
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    }
  }
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const openCreateModal = (status: string) => {
  isEditMode.value = false;
  editingCard.value = {
    id: Date.now(),
    projectId: activeProject.value?.id,
    title: '',
    description: '',
    status,
    assignee: '',
    duedate: '',
    priority: 'medium',
    tags: [],
  };
  tagsInput.value = '';
  isModalOpen.value = true;
};

const openEditModal = (card: any) => {
  isEditMode.value = true;
  editingCard.value = { ...card };
  // Load tags into input field
  tagsInput.value = parseTagsArray(card.tags).join(', ');
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingCard.value = {
    id: null,
    title: '',
    description: '',
    status: '',
    assignee: '',
    duedate: '',
    priority: 'medium',
    tags: [],
  };
  tagsInput.value = '';
};

// Helper functions for ADD TO CARD buttons

const focusAssignee = () => {
  toast.add({
    title: 'Assignee',
    description: 'Scroll down to set the assignee in Card Details section',
    color: 'blue',
    icon: 'i-heroicons-user-plus',
  });
};

const focusTags = () => {
  toast.add({
    title: 'Labels',
    description: 'Use the Tags input in the Labels section above to add tags',
    color: 'blue',
    icon: 'i-heroicons-tag',
  });
};

const focusDueDate = () => {
  toast.add({
    title: 'Due Date',
    description: 'Scroll down to set the due date in Card Details section',
    color: 'blue',
    icon: 'i-heroicons-calendar',
  });
};

const showAttachmentInfo = () => {
  toast.add({
    title: 'Attachments',
    description: 'Attachment feature coming soon!',
    color: 'gray',
    icon: 'i-heroicons-paper-clip',
  });
};

// Tag helper functions
const parseTagsArray = (tags: any) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
  }
  return [];
};

const updateTags = () => {
  if (tagsInput.value) {
    const newTags = tagsInput.value.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    editingCard.value.tags = newTags;
  }
};

// Helper functions
const getColumnCards = (status: string) => {
  if (!activeProject.value) return [];
  return tasks.value.filter((card) => card.status === status && card.projectId === activeProject.value.id);
};

const getColumnName = (status: string) => {
  const names: Record<string, string> = {
    backlog: 'Backlog',
    todo: 'To Do',
    inprogress: 'In Progress',
    review: 'Review',
    done: 'Done',
  };
  return names[status] || status;
};

const getPriorityColor = (priority: string) => {
  const p = priority?.toLowerCase();
  if (p === 'high' || p === 'urgent') return 'red';
  if (p === 'medium') return 'yellow';
  return 'green';
};

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (date: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// ========== ADVANCED FEATURES FUNCTIONS ==========

// Project Modal Functions
const openProjectModal = (project: any) => {
  if (project) {
    // Edit existing project - format dates for input
    editingProject.value = { 
      ...project,
      startdate: formatDateForInput(project.startdate),
      enddate: formatDateForInput(project.enddate)
    };
    isProjectModalOpen.value = true;
  } else {
    // New project - show template selection
    isTemplateModalOpen.value = true;
  }
};

// Statistics Functions
const openStatisticsModal = () => {
  isStatisticsModalOpen.value = true;
};

const closeStatisticsModal = () => {
  isStatisticsModalOpen.value = false;
};

// Template Functions
const selectTemplate = (template: any) => {
  selectedTemplate.value = template;
  isTemplateModalOpen.value = false;
  
  editingProject.value = {
    projectid: null,
    name: '',
    description: '',
    color: projectColors[0],
    archived: false,
    companyid: null,
    startdate: '',
    enddate: '',
    template: template.id
  };
  
  // Set columns from template
  if (template.columns) {
    columns.value = [...template.columns];
  }
  
  isProjectModalOpen.value = true;
};

// Members Management Functions
const openMembersModal = async () => {
  await loadUsers();
  isMembersModalOpen.value = true;
};

const closeMembersModal = () => {
  isMembersModalOpen.value = false;
  newMemberEmail.value = '';
  newMemberRole.value = 'member';
};

const addMember = async () => {
  if (!newMemberEmail.value || !activeProject.value) return;
  
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'modifprojectmember');
    dataForm.append('menu', 'admin');
    dataForm.append('search', false);
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('userid', newMemberEmail.value);
    dataForm.append('role', newMemberRole.value);
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    toast.add({
      title: 'Member Added',
      description: `${newMemberEmail.value} has been added to the project`,
      color: 'green',
      icon: 'i-heroicons-user-plus',
    });
    
    newMemberEmail.value = '';
    // Reload project members
    await loadProjectMembers();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to add member',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};

const removeMember = async (member: any) => {
  if (!activeProject.value) return;
  
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'purgeprojectmember');
    dataForm.append('menu', 'admin');
    dataForm.append('search', false);
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('userid', member.memberid.toString());
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    toast.add({
      title: 'Member Removed',
      description: `${member.name} has been removed from the project`,
      color: 'orange',
      icon: 'i-heroicons-user-minus',
    });
    
    // Reload project members
    await loadProjectMembers();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to remove member',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};

const updateMemberRole = async (member: any, newRole: string) => {
  if (!activeProject.value) return;
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'modifprojectmember');
    dataForm.append('menu', 'admin');
    dataForm.append('search', false);
    dataForm.append('projectid', activeProject.value.projectid.toString());
    dataForm.append('memberid', member.memberid.toString());
    dataForm.append('role', newRole);
    
    const res = await api.post('/api/admin/execute-flow', dataForm);
    
    member.role = newRole;
    
    toast.add({
      title: 'Role Updated',
      description: `${member.name}'s role has been updated to ${newRole}`,
      color: 'blue',
      icon: 'i-heroicons-shield-check',
    });
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to update role',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor-move:active {
  cursor: grabbing;
}
</style>
