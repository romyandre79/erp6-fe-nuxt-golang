import { defineStore } from 'pinia';

export interface ReportElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

export interface ReportBand {
  type: string;
  height: number;
  elements: ReportElement[];
}

export interface ReportTemplate {
  reportTemplateID?: number;
  reportName: string;
  reportDesc: string;
  reportCategory: string;
  reportType: string;
  pageWidth: number;
  pageHeight: number;
  orientation: string;
  margins: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  bands: ReportBand[];
  parameters: any[];
  dataSource: string;
}

export const useReportStore = defineStore('report', {
  state: () => ({
    currentTemplate: null as ReportTemplate | null,
    selectedElement: null as ReportElement | null,
    selectedBand: null as string | null,
    zoom: 100,
    gridSize: 10,
    snapToGrid: true,
    showGrid: true,
    showRulers: true,
    undoStack: [] as any[],
    redoStack: [] as any[],
  }),

  actions: {
    setCurrentTemplate(template: ReportTemplate | null) {
      this.currentTemplate = template;
    },

    selectElement(element: ReportElement | null) {
      this.selectedElement = element;
    },

    selectBand(bandType: string | null) {
      this.selectedBand = bandType;
    },

    addElement(bandType: string, element: ReportElement) {
      if (!this.currentTemplate) return;

      const band = this.currentTemplate.bands.find((b) => b.type === bandType);
      if (band) {
        band.elements.push(element);
        this.saveState();
      }
    },

    updateElement(elementId: string, updates: Partial<ReportElement>) {
      if (!this.currentTemplate) return;

      for (const band of this.currentTemplate.bands) {
        const element = band.elements.find((e) => e.id === elementId);
        if (element) {
          Object.assign(element, updates);
          this.saveState();
          break;
        }
      }
    },

    deleteElement(elementId: string) {
      if (!this.currentTemplate) return;

      for (const band of this.currentTemplate.bands) {
        const index = band.elements.findIndex((e) => e.id === elementId);
        if (index !== -1) {
          band.elements.splice(index, 1);
          this.selectedElement = null;
          this.saveState();
          break;
        }
      }
    },

    updateBandHeight(bandType: string, height: number) {
      if (!this.currentTemplate) return;

      const band = this.currentTemplate.bands.find((b) => b.type === bandType);
      if (band) {
        band.height = height;
        this.saveState();
      }
    },

    setZoom(zoom: number) {
      this.zoom = Math.max(25, Math.min(400, zoom));
    },

    toggleGrid() {
      this.showGrid = !this.showGrid;
    },

    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid;
    },

    toggleRulers() {
      this.showRulers = !this.showRulers;
    },

    setGridSize(size: number) {
      this.gridSize = size;
    },

    saveState() {
      if (!this.currentTemplate) return;

      // Save current state to undo stack
      this.undoStack.push(JSON.parse(JSON.stringify(this.currentTemplate)));

      // Limit undo stack size
      if (this.undoStack.length > 50) {
        this.undoStack.shift();
      }

      // Clear redo stack when new action is performed
      this.redoStack = [];
    },

    undo() {
      if (this.undoStack.length === 0) return;

      const previousState = this.undoStack.pop();
      if (this.currentTemplate) {
        this.redoStack.push(JSON.parse(JSON.stringify(this.currentTemplate)));
      }
      this.currentTemplate = previousState;
    },

    redo() {
      if (this.redoStack.length === 0) return;

      const nextState = this.redoStack.pop();
      if (this.currentTemplate) {
        this.undoStack.push(JSON.parse(JSON.stringify(this.currentTemplate)));
      }
      this.currentTemplate = nextState;
    },

    async loadTemplate(id: number) {
      const api = useApi();
      try {
        // Update to use new server endpoint
        // NOTE: The base URL of `api` might need to be changed if Report Server is on different port.
        // Assuming Nuxt proxy or same domain for now.
        // If separate, we might need a full URL.
        const response = await api.get(`/api/v1/designs/${id}`);
        if (response.code === 200 || response.reporttemplateid) { // Handle different response wrappers if any
          const data = response.data || response; // Handle wrapped or direct response
          
          // Parse JSON template if it exists
          let template: ReportTemplate;
          if (data.templatejson) {
            const parsed = JSON.parse(data.templatejson);
            template = {
              reportTemplateID: data.reporttemplateid,
              reportName: data.reportname,
              reportDesc: data.reportdesc,
              reportCategory: data.reportcategory,
              reportType: data.reporttype,
              pageWidth: parsed.pageWidth || data.pagewidth,
              pageHeight: parsed.pageHeight || data.pageheight,
              orientation: parsed.orientation || data.orientation,
              margins: parsed.margins || { left: 20, right: 20, top: 20, bottom: 20 },
              bands: parsed.bands || [],
              parameters: data.parameters ? JSON.parse(data.parameters) : [],
              dataSource: data.datasource || '',
            };
          } else {
            // Create new template structure
            template = {
              reportTemplateID: data.reporttemplateid,
              reportName: data.reportname,
              reportDesc: data.reportdesc,
              reportCategory: data.reportcategory,
              reportType: data.reporttype,
              pageWidth: data.pagewidth || 595,
              pageHeight: data.pageheight || 842,
              orientation: data.orientation || 'portrait',
              margins: { left: 20, right: 20, top: 20, bottom: 20 },
              bands: [
                { type: 'title', height: 50, elements: [] },
                { type: 'pageHeader', height: 30, elements: [] },
                { type: 'columnHeader', height: 30, elements: [] },
                { type: 'detail', height: 100, elements: [] },
                { type: 'columnFooter', height: 30, elements: [] },
                { type: 'pageFooter', height: 30, elements: [] },
                { type: 'summary', height: 50, elements: [] },
              ],
              parameters: [],
              dataSource: '',
            };
          }

          this.setCurrentTemplate(template);
          this.undoStack = [];
          this.redoStack = [];
        }
      } catch (error) {
        console.error('Failed to load template:', error);
        throw error;
      }
    },

    async saveTemplate() {
      if (!this.currentTemplate) return;

      const api = useApi();
      const templateJSON = JSON.stringify({
        pageWidth: this.currentTemplate.pageWidth,
        pageHeight: this.currentTemplate.pageHeight,
        orientation: this.currentTemplate.orientation,
        margins: this.currentTemplate.margins,
        bands: this.currentTemplate.bands,
      });

      const payload = {
        reportname: this.currentTemplate.reportName,
        reportdesc: this.currentTemplate.reportDesc,
        reportcategory: this.currentTemplate.reportCategory,
        reporttype: this.currentTemplate.reportType,
        templatejson: templateJSON,
        parameters: JSON.stringify(this.currentTemplate.parameters),
        datasource: this.currentTemplate.dataSource,
        pagewidth: this.currentTemplate.pageWidth,
        pageheight: this.currentTemplate.pageHeight,
        orientation: this.currentTemplate.orientation,
      };

      try {
        if (this.currentTemplate.reportTemplateID) {
          // Update existing
          await api.put(`/api/v1/designs/${this.currentTemplate.reportTemplateID}`, payload);
        } else {
          // Create new
          const response = await api.post('/api/v1/designs', payload);
          // Check response structure
          const data = response.data || response;
          if ((response.code === 200 || response.message === "Design saved") && data) {
            this.currentTemplate.reportTemplateID = data.reporttemplateid;
          }
        }
      } catch (error) {
        console.error('Failed to save template:', error);
        throw error;
      }
    },
  },
});
// Note: We also need to update the list fetching in index.vue, and the Create/Update calls in saveTemplate.
// But wait, saveTemplate uses /api/admin/report-templates...
// Let's update saveTemplate as well.
