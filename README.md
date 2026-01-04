# Capella ERP v6 Front End

## Setup
1. Clone from branch Develop
2. run: bun install, if not exist, install from : https://bun.com/
3. after finish, configure .env   

## Run
run: bun run dev

## Build
run: bun run build

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



FormRender Hard Lock Implementation Guide
Overview
Add SAP-style record locking to FormRender.vue when master.props.lock = true.

Implementation Steps
1. Add Helper Function to Get Master Node
Add after 
getPrimary()
 function (around line 148):

function getMaster() {
  let node: any;
  parsedSchema.value.forEach((element) => {
    if (element.type == 'master') {
      node = element;
    }
  });
  return node;
}
function getAction(type: string) {
  let actionNode: any;
  parsedSchema.value.forEach((element: any) => {
    if (element.type == 'action') {
      actionNode = element;
    }
  });
  
  // Map action types to workflow properties
  const actionMap = {
    'get': actionNode?.props?.onGet,
    'create': actionNode?.props?.onCreate,
    'update': actionNode?.props?.onUpdate,
    'purge': actionNode?.props?.onPurge,
    'pdf': actionNode?.props?.onPdf,
    'xls': actionNode?.props?.onXls,
    'upload': actionNode?.props?.onUpload,
    'lock': actionNode?.props?.onLockFlow,  // NEW
  };
  
  return actionMap[type] || null;
}
2. Modify 
edit()
 Function
Replace the master modal edit section (around line 211-248) with:

} else {
  // Handle master modal edit (existing logic)
  const master = getMaster();
  const lockEnabled = master?.props?.lock === true;
  const flow = getAction('get');
  
  if (flow && selectedRows.value.length > 0) {
    const primary = getPrimary();
    
    // 🔒 Try to lock record if locking is enabled
    if (lockEnabled) {
      const lockFlow = getAction('lock');
      if (lockFlow) {
        const lockForm = new FormData();
        lockForm.append('flowname', lockFlow);
        lockForm.append('menu', 'admin');
        lockForm.append('tablename', props.menuName);  // Use menu name as table name
        lockForm.append('recordid', selectedRows.value[0][primary]);
        
        try {
          const lockRes = await Api.post('api/admin/execute-flow', lockForm);
          if (lockRes.code === 401 && lockRes.error === 'RECORD_LOCKED') {
            // Record is locked by another user
            toast.add({
              title: 'Record Locked',
              description: lockRes.details || 'This record is being edited by another user',
              color: 'error',
              timeout: 5000
            });
            return; // Don't open the form
          }
        } catch (err) {
          console.error('Failed to lock record:', err);
          toast.add({
            title: 'Lock Error',
            description: 'Failed to lock record. Please try again.',
            color: 'error'
          });
          return;
        }
      }
    }
    
    // Continue with existing edit logic
    modalTitle.value = 'Edit Data';
    modalDescription.value = '';
    modalRefs[key].value = true;
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append(primary, selectedRows.value[0][primary]);
    
    try {
      const res = await Api.post('api/admin/execute-flow', dataForm);
      if (res.code == 200) {
        const record = res.data.data;
        for (const key in record) {
          formData.value[key] = record[key];
        }
        
        // 🔥 Load detail table data if exists
        for (const key in record) {
          if (Array.isArray(record[key]) && record[key].length > 0) {
            formData.value[key] = [...record[key]];
          }
        }
        
        tableRef.value.setData(primary, selectedRows.value[0][primary]);
      } else if (res.code == 401 && res.error == 'INVALID_TOKEN') {
        navigateTo('/login');
      }
    } catch (err) {
      console.error('Gagal ambil data:', err);
    }
  }
}
3. Modify 
close()
 Function
Replace the close function (around line 268-283) with:

async function close(key: string) {
  try {
    const master = getMaster();
    const lockEnabled = master?.props?.lock === true;
    const primary = getPrimary();
    
    // 🔓 Unlock record if locking is enabled
    if (lockEnabled && selectedRows.value && selectedRows.value.length > 0) {
      const unlockFlow = getAction('lock'); // Same workflow, but for unlock
      if (unlockFlow) {
        const unlockForm = new FormData();
        unlockForm.append('flowname', unlockFlow);
        unlockForm.append('menu', 'admin');
        unlockForm.append('action', 'unlock');  // Add action parameter
        unlockForm.append('tablename', props.menuName);
        unlockForm.append('recordid', selectedRows.value[0][primary]);
        
        try {
          await Api.post('api/admin/execute-flow', unlockForm);
          console.log('Record unlocked successfully');
        } catch (err) {
          console.error('Failed to unlock record:', err);
        }
      }
    }
    
    if (selectedRows.value && selectedRows.value.length > 0 && selectedRows.value[0][primary]) {
      tableRef.value.setData(primary, selectedRows.value[0][primary]);
    }
    tableRef.value.setDataIsDetail(false);
  } catch (e) {
    console.error('Error closing modal:', e);
  } finally {
    if (modalRefs[key]) {
      modalRefs[key].value = false;
    }
  }
}
4. Add WebSocket Listener for Lock Notifications
Add in the <script setup> section, after the imports:

import { useWebSocket } from '../composables/useWebSocket';
// WebSocket for lock notifications
const { socket } = useWebSocket();
onMounted(() => {
  if (socket.value) {
    socket.value.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle record locked notification
        if (data.type === 'record_locked') {
          const master = getMaster();
          const primary = getPrimary();
          
          // Check if this affects the currently selected record
          if (data.tablename === props.menuName && 
              selectedRows.value.length > 0 &&
              data.recordid === selectedRows.value[0][primary]) {
            
            toast.add({
              title: 'Record Locked',
              description: `${data.locked_by_name} is now editing this record`,
              color: 'warning',
              timeout: 5000
            });
            
            // Optionally close the form if it's open
            const openModal = Object.keys(modalRefs).find(k => modalRefs[k].value === true);
            if (openModal) {
              close(openModal);
            }
          }
        }
        
        // Handle record unlocked notification
        if (data.type === 'record_unlocked') {
          if (data.tablename === props.menuName) {
            toast.add({
              title: 'Record Available',
              description: `${data.unlocked_by_name} finished editing. Record is now available.`,
              color: 'success',
              timeout: 3000
            });
          }
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    });
  }
});
5. Create Lock/Unlock Workflow
In the workflow designer, create a workflow named lock_record:

Components:

Start node
Decision node: Check action parameter
If action == "unlock" → go to UnlockRecord
Else → go to LockRecord
LockRecord component:
tablename: $tablename
recordid: $recordid
UnlockRecord component:
tablename: $tablename
recordid: $recordid
End node
6. Configure Master Component
In the form designer, set the master component properties:

lock
: true
In action node, set onLockFlow: lock_record
Testing
Enable locking: Set master.props.lock = true in form designer
Test lock: User A opens a record → should lock successfully
Test conflict: User B tries to open same record → should see "Record Locked" error
Test unlock: User A closes form → record should unlock
Test notification: User B should see "Record Available" notification
Benefits
✅ Prevents concurrent editing conflicts
✅ Real-time notifications to all users
✅ Automatic unlock on form close
✅ Works like SAP - familiar UX
✅ Configurable per form (lock = true/false)

---

## Form Designer Locking (Schema)

Prevents concurrent modification of the form design itself.

### How it works

1. **Locking**:
   - `pages/admin/form-designer/[...slug].vue` calls `acquireLock` on mount.
   - Passes `design=true` to `getMenuForm` to bypass the runtime block.
   - **Heartbeat**: Automatically refreshes the lock every 60 seconds to prevent expiration.

2. **Unlocking**:
   - `pages/admin/form-designer/[...slug].vue` calls `releaseLock` on `onBeforeUnmount`.
   - Ensures lock is released when navigator leaves.

3. **Runtime Blocking**:
   - `pages/admin/[...slug].vue` handles `423 Locked` error.
   - Displays **Under Maintenance** page if the form is being designed.

### Maintenance Mode UI

If a user hits a locked form:
- Visual: Large "Under Maintenance" card
- Action: "Go Back" button
- Details: Shows who is locking it (if backend provides info)
## Prettier
run: bun run format



Kanban/Trello Component Implementation - Complete Walkthrough
🎉 Implementation Summary
I've successfully created a complete Trello-like Kanban board component system that integrates seamlessly with your existing form designer and rendering system.

📁 Files Created/Modified
1. Component Definitions - 
types/components.ts
Added three new component types to the layoutContainers array:

kanban - Main board container with configurable field mappings
kanbancolumn - Individual columns (To Do, In Progress, etc.)
kanbancard - Card template (for future customization)
2. Kanban Board Component - 
KanbanBoard.vue
A fully-featured Vue component with:

✅ Drag-and-drop functionality
✅ Customizable columns with color themes
✅ Column limits (WIP limits)
✅ Priority badges (high/medium/low)
✅ Due date tracking with overdue highlighting
✅ Tags/labels support
✅ Assignee display
✅ Dark mode support
✅ Responsive design
✅ Empty state handling
3. Form Renderer Integration - 
FormRender.vue
Updated to support Kanban rendering:

Added KanbanBoard import
Added 
renderKanban()
 function with workflow integration
Handles status change events
Manages card updates
Integrates with modal system for card editing
4. Demo Page - 
kanban-demo.vue
A working demonstration page with:

Sample kanban board configuration
8 sample tasks across different columns
Example of all features (priorities, tags, due dates, etc.)
5. Documentation - 
kanban_usage_guide.md
Comprehensive guide covering:

Component properties
Data structure
Usage examples
Workflow integration
Best practices
Use cases
🚀 Key Features
Drag and Drop
Cards can be dragged between columns to change their status. The component automatically:

Updates the card's status field
Triggers the onUpdateStatus workflow
Shows visual feedback during dragging
Prevents drops if column limit is reached
Configurable Field Mapping
Map your database fields to kanban properties:

{
  primary: 'taskid',           // Unique identifier
  titlefield: 'taskname',      // Card title
  descriptionfield: 'notes',   // Card description
  statusfield: 'stage',        // Current status
  assigneefield: 'owner',      // Assigned person
  duedatefield: 'deadline',    // Due date
  priorityfield: 'importance', // Priority level
  tagsfield: 'categories'      // Tags/labels
}
Column Customization
Create custom workflows with unlimited columns:

{
  type: 'kanbancolumn',
  props: {
    title: 'In Review',
    status: 'review',
    color: 'purple',
    limit: 3  // Max 3 cards in this column
  }
}
Priority System
Automatic color coding:

High/Urgent → Red badge
Medium → Yellow badge
Low → Green badge
Due Date Tracking
Compact date display (e.g., "Dec 25")
Overdue dates highlighted in red
Calendar icon for visual clarity
📝 How to Use in Form Designer
Step 1: Add to Your Form Schema
In the Form Designer (pages/admin/form-designer), you can now drag the Kanban Board component from the sidebar.

Step 2: Configure Properties
Set up the kanban board properties:

Key: Unique identifier (e.g., project_tasks)
Primary: Your primary key field name
Field Mappings: Map to your database columns
Workflows: Set onUpdateStatus to your backend flow
Step 3: Add Columns
Drag Kanban Column components into the Kanban Board and configure:

Title (displayed name)
Status (value to set when card is in this column)
Color (visual theme)
Limit (max cards, 0 = unlimited)
Step 4: Connect to Backend
Create a workflow that handles status updates:

// Your backend receives:
{
  flowname: "update_task_status",
  id: 123,
  status: "inprogress",  // New status
  // ... all other card fields
}
🎨 Visual Design
The Kanban board features:

Modern Card Design: Clean white cards with subtle shadows
Color-Coded Columns: Top border indicates column type
Smooth Animations: Hover effects and transitions
Dark Mode: Fully supports dark theme
Responsive: Horizontal scroll on mobile
Professional Look: Matches your existing ERP design
🔄 Workflow Integration
Status Change Event
When a card is dragged to a new column:

Card status is updated locally
onStatusChange event is emitted
Backend workflow is called (if configured)
Success/error toast notification shown
Card Click Event
When a card is clicked:

Card data is loaded into formData
Modal is opened (if configured via modalkey prop)
User can edit card details
Save triggers onUpdate workflow
📊 Example Use Cases
1. Project Management
Columns: Backlog → To Do → In Progress → Review → Done

2. Sales Pipeline
Columns: Lead → Contacted → Qualified → Proposal → Won/Lost

3. Support Tickets
Columns: New → Assigned → In Progress → Resolved → Closed

4. Content Workflow
Columns: Draft → Review → Approved → Published

5. Recruitment
Columns: Applied → Screening → Interview → Offer → Hired

🧪 Testing the Demo
Visit the demo page to see it in action:

/admin/kanban-demo
The demo includes:

5 custom columns with different colors
8 sample tasks with various priorities
Tags, assignees, and due dates
Drag-and-drop functionality
Column limits demonstration
🎯 Next Steps
Try the Demo: Visit /admin/kanban-demo to see the component in action
Use in Form Designer: Open Form Designer and add the Kanban Board component
Configure Your Workflow: Set up backend flows for status updates
Customize Columns: Create columns that match your business process
Connect Your Data: Point the source prop to your API endpoint
💡 Tips
Start Simple: Begin with 3-4 columns, add more as needed
Set WIP Limits: Use column limits to prevent bottlenecks
Use Priorities: Help users focus on important tasks
Keep Descriptions Short: They're truncated to 2 lines
Tags for Categorization: Use tags to filter/group related tasks
✨ Voilà! Your Trello-like Kanban Board is Ready!
You can now:

✅ Add Kanban boards to any form via the Form Designer
✅ Drag and drop cards between columns
✅ Track tasks with priorities, due dates, and assignees
✅ Customize columns to match your workflow
✅ Integrate with your backend workflows
✅ Use it for project management, sales, support, and more!
Just put the component in your form designer, configure the properties, and voilà - you have a fully functional Trello-like application! 🎉


What I've Done:
1. ✅ Added Component Type Definition
Added kanbanboard component type to 
types/components.ts
 with all necessary props:

Project management workflows (create, update, delete)
Card management workflows (create, update, delete, move)
Customizable columns
Data source configuration
2. ✅ Component Already Exists
The KanbanBoard.vue component already exists in your components folder and is ready to use!

3. ✅ Created Integration Guide
Created a comprehensive guide showing:

How to add Kanban Board in Form Designer
All required backend workflows
Database schema suggestions
Customization options


Form Select
[
  {
    "type": "select",
    "key": "country_id",
    "label": "Country",
    "source": "get_countries",
    "props": {
      "key": "country_id",
      "text": "Country",
      "source": "get_countries"
    }
  },
  {
    "type": "select",
    "key": "state_id",
    "label": "State",
    "source": "get_states",
    "props": {
      "key": "state_id",
      "text": "State",
      "source": "get_states",
      "dependency": [
        { "key": "country_id", "param": "country_id" }
      ]
    }
  }
]
