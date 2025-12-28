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

	const loadCompanies = async () => {
		try {
			const dataForm = new FormData();
			dataForm.append('flowname', 'searchcompanyauth');
			dataForm.append('menu', 'admin');
			dataForm.append('search', 'true');
			
			return await api.post('/api/admin/execute-flow', dataForm);
		} catch (e) {
			console.error('❌ Error loading companies:', e);
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
            if (data.position !== undefined && data.position !== null) dataForm.append('position', data.position.toString());
            if (data.posgantt !== undefined && data.posgantt !== null) dataForm.append('posgantt', data.posgantt.toString());
            
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

	const saveGanttTaskPositions = async (ganttTasks: any) => {
		try {
			const ganttTasksList = ganttTasks.value;
			
			// Save each task's position to backend
			for (let index = 0; index < ganttTasksList.length; index++) {
			const task = ganttTasksList[index];
			const dataForm = new FormData();
			dataForm.append('flowname', 'modifcard');
			dataForm.append('menu', 'admin');
			dataForm.append('search', 'false');
			dataForm.append('cardid', task.cardid.toString());
			dataForm.append('projectid', activeProject.value.projectid.toString());
			dataForm.append('posgantt', index.toString());
			if (task.position !== undefined && task.position !== null) dataForm.append('position', task.position.toString());
			
			// Include other required fields to avoid clearing them
			dataForm.append('title', task.title || '');
			dataForm.append('description', task.description || '');
			dataForm.append('status', task.status || '');
			dataForm.append('priority', task.priority || 'medium');
			
			// Handle assignee
			let assignee = task.assignee;
			if (Array.isArray(assignee)) assignee = assignee[0];
			if (assignee && typeof assignee === 'object') assignee = assignee.id || assignee.userid || assignee.email;
			dataForm.append('assignee', assignee || '');
			
			// Handle dates
			let startdate = task.startdate || task.enddate;
			if (startdate) startdate = startdate.replace('T', ' ').split('.')[0].replace('Z', '');
			dataForm.append('startdate', startdate);
			
			let enddate = task.enddate || '';
			if (enddate) enddate = enddate.replace('T', ' ').split('.')[0].replace('Z', '');
			dataForm.append('enddate', enddate);
			
			// Handle tags
			let tags = task.tags || [];
			if (typeof tags === 'string') {
				try { tags = JSON.parse(tags); } catch(e) { tags = []; }
			}
			dataForm.append('tags', JSON.stringify(tags));
			
			await api.post('/api/admin/execute-flow', dataForm);
			}
			
			// Update local tasks with new positions
			tasks.value = tasks.value.map((task: any) => {
			const taskIndex = ganttTasksList.findIndex((t: any) => t.cardid === task.cardid);
			if (taskIndex !== -1) {
				return { ...task, posgantt: taskIndex };
			}
			return task;
			});
			
			toast.add({
			title: 'Order Saved',
			description: 'Task order has been updated',
			color: 'green',
			icon: 'i-heroicons-check-circle',
			});
		} catch (error) {
			console.error('Error saving gantt task positions:', error);
			toast.add({
			title: 'Error',
			description: 'Failed to save task order',
			color: 'red',
			icon: 'i-heroicons-exclamation-triangle',
			});
		}
		};

	const saveAsTemplate = async (newTemplateName: any, newTemplateDescription: any, newTemplateIcon: any, columns: any) => {
		try {
			const dataForm = new FormData();
			dataForm.append('flowname', 'modifprojecttemplate');
			dataForm.append('menu', 'admin');
			dataForm.append('search', 'false');
			dataForm.append('name', newTemplateName);
			dataForm.append('description', newTemplateDescription);
			dataForm.append('icon', newTemplateIcon);
			dataForm.append('columns', JSON.stringify(columns));

			return await api.post('/api/admin/execute-flow', dataForm);
		} catch (e) {
			console.error('Error saving template:', e);
			error.value = error
		}
	};
	
	const saveProject = async (editingProject: any, columns: any) => {
	  try {
		const dataForm = new FormData();
		
		dataForm.append('flowname', 'modifproject');
		if (editingProject.value.projectid) {
		  dataForm.append('projectid', editingProject.value.projectid.toString());
		}
		
		dataForm.append('menu', 'admin');
		dataForm.append('search', 'false');
		dataForm.append('name', editingProject.name);
		dataForm.append('description', editingProject.description);
		dataForm.append('color', editingProject.color);
		dataForm.append('companyid', editingProject.companyid);
		dataForm.append('startdate', editingProject.startdate);
		dataForm.append('enddate', editingProject.enddate);
		dataForm.append('columns', JSON.stringify(columns));
				
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.error('Error saving project:', e);
		error.value = e
	  }
	};
	
	const confirmDeleteProject = async (projectToDelete: any) => {
	  try {
		const dataForm = new FormData();
		dataForm.append('flowname', 'deleteproject');
		dataForm.append('menu', 'admin');
		dataForm.append('projectid', projectToDelete.projectid.toString());
		
		return await api.post('/api/admin/execute-flow', dataForm);
	  } catch (e) {
		console.error('Error deleting project:', e);
		error.value = e
	  }
	};

    return {
		error,
		loadUsers,
		loadCompanies,
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
		saveColumns,
		saveAsTemplate,
		saveProject,
		saveGanttTaskPositions,
		confirmDeleteProject
    };
})