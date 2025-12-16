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
