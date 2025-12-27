// stores/workflow.ts
import { defineStore } from 'pinia';
import { useApi } from '../composables/useApi';

export const useProjectStore = defineStore('projects', () => {
    const api = useApi();
    const loading = ref(false);
	const error = ref();
	
	const loadUsers = async () => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'searchuserauth');
		dataForm.append('menu', 'admin');
		dataForm.append('search', 'true');
		
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.error('Error loading users:', e);
		error.value = e
	  }
	};
	
	const loadProjects = async (showArchived: any) => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'searchprojects');
		dataForm.append('menu', 'admin');
		dataForm.append('search', 'true');
		// Filter by archive status - MySQL uses 0/1 for BOOLEAN
		dataForm.append('archived', showArchived ? '1' : '0');
		
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.error('Error loading projects:', e);
		error.value = e
	  }
	};
	
	const loadProjectMembers = async (activeProject: any) => {
	  if (!activeProject || !activeProject.projectid) return;
	  
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'searchprojectmember');
		dataForm.append('menu', 'admin');
		dataForm.append('projectid', activeProject.projectid.toString());
		dataForm.append('search', 'true');
		
		return await api.post('/api/admin/execute-flow', dataForm) as any;
	  } catch (e) {
		console.error('Error loading project members:', e);
		error.value = e
	  }
	};
	
	const loadRoles = async() => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'searchcombogroupauth');
		dataForm.append('menu', 'admin');
		dataForm.append('search', 'true');
		
		return await api.post('/api/admin/execute-flow', dataForm);
		
	  } catch (e) {
		console.error('Error loading roles:', e);
		error.value = e
	  }
	};
	
	const loadProjectTemplates = async () => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'searchprojecttemplates');
		dataForm.append('menu', 'admin');
		dataForm.append('search', 'true');
		
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.error('Error loading project templates:', e);
		error.value = e
	  }
	};
	
	const loadCards = async (activeProject: any) => {
	  if (!activeProject) return;
	  
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'getcards');
		dataForm.append('menu', 'admin');
		dataForm.append('projectid', activeProject.projectid.toString());
		dataForm.append('search', 'true');
		
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.log('error load card ',e)
		error.value = e
	  }
	};
	
	const getCardTime = async (cardid: any) => {
		if (!cardid) return;
		try {
			const dataForm = new FormData();
			dataForm.append('flowname', 'getcardtime');
			dataForm.append('menu', 'admin');
			dataForm.append('cardid', cardid.toString());
			dataForm.append('search', 'true');
			
			return await api.post('/api/admin/execute-flow', dataForm);
		} catch (e) {
			console.log('error cardd time ',e)
			error.value = e
		}
	}
	
	const getCardAttachment = async(cardid: any) => {
		if (!cardid) return;
			const dataForm = new FormData();
			dataForm.append('flowname', 'getcardattachment');
			dataForm.append('menu', 'admin');
			dataForm.append('cardid', cardid.toString());
			dataForm.append('search', 'true');
			
			return await api.post('/api/admin/execute-flow', dataForm);
		try {
		} catch (e) {
			console.log('error card attach ',e)
			error.value = e
		}
	}
	
	const getCardComment = async(cardid: any) => {
		if (!cardid) return;
			const dataForm = new FormData();
			dataForm.append('flowname', 'getcardcomment');
			dataForm.append('menu', 'admin');
			dataForm.append('cardid', cardid.toString());
			dataForm.append('search', 'true');
			
			return await api.post('/api/admin/execute-flow', dataForm);
		try {
		} catch (e) {
			console.log('error card attach ',e)
			error.value = e
		}
	}
	
	// Save columns
	const saveColumns = async (data: any, columns: any) => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'modifprojectcolumns');
		dataForm.append('menu', 'admin');
		dataForm.append('search', false);
		dataForm.append('projectid', data);
		dataForm.append('columns', JSON.stringify(columns));
		
		const res = await api.post('/api/admin/execute-flow', dataForm);
		
		return res
	  } catch (e) {
		console.error('Error saving columns:', e);
		error.value = e
	  }
	};
	
	// Save time entries
	const saveTimeEntries = async (cardid: number, entries: any[]) => {
	  for (const entry of entries) {
		if (!entry.start || !entry.end) continue;
		
		try {
		  const dataForm = new FormData();

		  dataForm.append('flowname', 'modiftimeentry');
		  if (entry.cardtimeentryid) {
			dataForm.append('cardtimeentryid', entry.cardtimeentryid.toString());
		  }      
		  dataForm.append('cardid', cardid.toString());
		  dataForm.append('menu', 'admin');
		  dataForm.append('search', false);
		  dataForm.append('startdatetime', entry.start.replace('T', ' '));
		  dataForm.append('enddatetime', entry.end.replace('T', ' '));
		  dataForm.append('note', entry.note || '');
		  
		  await api.post('/api/admin/execute-flow', dataForm);
		} catch (e) {
		  console.error('Error saving time entry:', e);
		  error.value = e
		}
	  }
	};
	
	// Save attachment
	const saveAttachment = async (cardid: number, attachments: any[]) => {
	    for (const att of attachments) {
			if (att.file && !att.cardattachmentid) {
				try {
					const dataForm = new FormData();
					dataForm.append('flowname', 'uploadattachment');
					dataForm.append('menu', 'admin');
					dataForm.append('projectid', activeProject.projectid.toString());
					dataForm.append('cardid', cardid.toString());
					dataForm.append('file', att.file);
					await api.post('/api/admin/execute-flow', dataForm);
				} catch (e) {
					console.error('Error uploading pending attachment', e);
					error.value = e
				}
			}
		}
	};

    const saveCard = async (data: any, activeProject: any) => {
        try {
            loading.value = true;
            const dataForm = new FormData();
            
            dataForm.append('flowname', 'modifcard');

            if (data.cardid) {
                dataForm.append('cardid', data.cardid.toString());
            }
            
            dataForm.append('projectid', activeProject.projectid.toString());
            dataForm.append('menu', 'admin');
            dataForm.append('search', 'false');
            dataForm.append('title', data.title);
            dataForm.append('description', data.description || '');
            dataForm.append('status', data.status);
            
            let assignee = data.assignee;
            if (Array.isArray(assignee)) assignee = assignee[0];
            
            if (assignee && typeof assignee === 'object') assignee = assignee.id || assignee.userid || assignee.email;
                dataForm.append('assignee', assignee || '');
            
                let startdate = data.startdate || '';
            
            if (startdate) startdate = startdate.replace('T', ' ').split('.')[0].replace('Z', '');
                dataForm.append('startdate', startdate);
            
            let enddate = data.enddate || '';
            if (enddate) enddate = enddate.replace('T', ' ').split('.')[0].replace('Z', '');
                dataForm.append('enddate', enddate);
            
            dataForm.append('priority', data.priority || 'medium');
            dataForm.append('tags', JSON.stringify(data.tags || []));
            
            const res = await api.post('/api/admin/execute-flow', dataForm) as any;
            
			// Save time entries if any
			const cardid = data.cardid || res.data?.cardid;
			if (cardid) {
				if (data.timeEntries && data.timeEntries.length > 0) {
					await saveTimeEntries(cardid, data.timeEntries);
				}
				if (data.attachments && data.attachments.length > 0) {
					await saveAttachment(cardid,data.attachments);
				}
            }
			return res
        } catch (e) {
            console.error('Error saving card:', e);
			error.value = e
        } finally {
            loading.value = false;
        }
    };

    return {
		error,
		loadUsers,
		loadCards,
		loadProjects,
		loadProjectMembers,
		loadProjectTemplates,
		loadRoles,
		getCardTime,
		getCardAttachment,
		getCardComment,
        saveCard,
		saveTimeEntries,
		saveAttachment,
		saveColumns
    };
})