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
  
  // Advanced Properties
  language?: string;
  imports?: string;
  formatFactoryClass?: string;
  whenNoDataType?: string;
  titleOnNewPage?: boolean;
  summaryOnNewPage?: boolean;
  summaryWithPageHeaderAndFooter?: boolean;
  floatColumnFooter?: boolean;
  ignorePagination?: boolean;
  createBookmarks?: boolean;
  scriptletClass?: string;
  resourceBundle?: string;
  defaultDataAdapter?: string;
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
    loading: false,
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

    addBand(bandType: string, height: number = 50) {
      if (!this.currentTemplate) return;

      // Check if band already exists
      const existingBand = this.currentTemplate.bands.find((b) => b.type === bandType);
      if (existingBand) {
        // Band exists, maybe toggle visibility or just return?
        // User might expect it to 'appear' if it was hidden/removed.
        return;
      }

      // Add new band
      this.currentTemplate.bands.push({
        type: bandType,
        height: height,
        elements: []
      });
      
      // Sort bands based on standard order
      const order = ['title', 'pageHeader', 'columnHeader', 'detail', 'columnFooter', 'pageFooter', 'summary'];
      this.currentTemplate.bands.sort((a, b) => {
        return order.indexOf(a.type) - order.indexOf(b.type);
      });

      this.saveState();
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
      this.loading = true;
      const api = useApi();
      try {
        const dataForm = new FormData();
        dataForm.append('flowname', 'getreport');
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');
        dataForm.append('reportid', id.toString());

        const response = await api.post('/api/admin/execute-flow', dataForm);
        
        if (response.code === 200 && response.data) {
          const data = response.data.data || response.data; // Check structure
          
          let template: ReportTemplate;
          // The flow likely returns the record fields directly
          if (data.templatejson) {
            const parsed = JSON.parse(data.templatejson);
            template = {
              reportTemplateID: data.id || data.reporttemplateid, // Check what flow returns
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
              language: parsed.language || 'java',
              imports: parsed.imports || '',
              formatFactoryClass: parsed.formatFactoryClass || '',
              whenNoDataType: parsed.whenNoDataType || 'NoPages',
              titleOnNewPage: parsed.titleOnNewPage || false,
              summaryOnNewPage: parsed.summaryOnNewPage || false,
              summaryWithPageHeaderAndFooter: parsed.summaryWithPageHeaderAndFooter || false,
              floatColumnFooter: parsed.floatColumnFooter || false,
              ignorePagination: parsed.ignorePagination || false,
              createBookmarks: parsed.createBookmarks || false,
              scriptletClass: parsed.scriptletClass || '',
              resourceBundle: parsed.resourceBundle || '',
              defaultDataAdapter: parsed.defaultDataAdapter || '',
            };
          } else {
             // Fallback if no JSON (legacy or empty)
             // Use initialize logic or basic structure
             template = {
              reportTemplateID: data.id || data.reporttemplateid,
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
              language: 'java',
              whenNoDataType: 'NoPages'
            };
          }

          this.setCurrentTemplate(template);
          this.undoStack = [];
          this.redoStack = [];
        } else {
             throw new Error(response.message || 'Failed to load report');
        }
      } catch (error) {
        console.error('Failed to load template:', error);
        throw error;
      }
    },

    async saveTemplate() {
      if (!this.currentTemplate) return;
      this.loading = true;

      const api = useApi();
      const templateJSON = JSON.stringify({
        pageWidth: this.currentTemplate.pageWidth,
        pageHeight: this.currentTemplate.pageHeight,
        orientation: this.currentTemplate.orientation,
        margins: this.currentTemplate.margins,
        bands: this.currentTemplate.bands,
        // Advanced Properties
        language: this.currentTemplate.language,
        imports: this.currentTemplate.imports,
        formatFactoryClass: this.currentTemplate.formatFactoryClass,
        whenNoDataType: this.currentTemplate.whenNoDataType,
        titleOnNewPage: this.currentTemplate.titleOnNewPage,
        summaryOnNewPage: this.currentTemplate.summaryOnNewPage,
        summaryWithPageHeaderAndFooter: this.currentTemplate.summaryWithPageHeaderAndFooter,
        floatColumnFooter: this.currentTemplate.floatColumnFooter,
        ignorePagination: this.currentTemplate.ignorePagination,
        createBookmarks: this.currentTemplate.createBookmarks,
        scriptletClass: this.currentTemplate.scriptletClass,
        resourceBundle: this.currentTemplate.resourceBundle,
        defaultDataAdapter: this.currentTemplate.defaultDataAdapter
      });

      const dataForm = new FormData();
      dataForm.append('flowname', 'modifreport');
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');
      
      if (this.currentTemplate.reportTemplateID) {
          dataForm.append('reportid', this.currentTemplate.reportTemplateID.toString());
      }

      dataForm.append('reportname', this.currentTemplate.reportName);
      dataForm.append('reportdesc', this.currentTemplate.reportDesc);
      dataForm.append('reportcategory', this.currentTemplate.reportCategory);
      dataForm.append('reporttype', this.currentTemplate.reportType);
      dataForm.append('templatejson', templateJSON);
      dataForm.append('parameters', JSON.stringify(this.currentTemplate.parameters));
      dataForm.append('datasource', this.currentTemplate.dataSource);
      dataForm.append('pagewidth', this.currentTemplate.pageWidth.toString());
      dataForm.append('pageheight', this.currentTemplate.pageHeight.toString());
      dataForm.append('orientation', this.currentTemplate.orientation);

      try {
        const response = await api.post('/api/admin/execute-flow', dataForm);
        
        if (response.code === 200) {
           // Success
           // If new, update ID from response
           const data = response.data || response;
           if(data && (data.id || data.reporttemplateid) && !this.currentTemplate.reportTemplateID) {
               this.currentTemplate.reportTemplateID = data.id || data.reporttemplateid;
           }
        } else {
            throw new Error(response.message || 'Failed to save');
        }

      } catch (error) {
        console.error('Failed to save template:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    initializeNewTemplate() {
      const template: ReportTemplate = {
        reportName: 'New Report',
        reportDesc: '',
        reportCategory: 'General',
        reportType: 'Standard',
        pageWidth: 595,
        pageHeight: 842,
        orientation: 'portrait',
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
        language: 'java',
        whenNoDataType: 'NoPages',
        titleOnNewPage: false,
        summaryOnNewPage: false,
        summaryWithPageHeaderAndFooter: false,
        floatColumnFooter: false,
        ignorePagination: false,
        createBookmarks: false
      };
      this.setCurrentTemplate(template);
      this.undoStack = [];
      this.redoStack = [];
    },

    async printReport(id: number, format: 'pdf' | 'xls' = 'pdf', flowName: string = 'printreport', additionalParams: Record<string, any> = {}) {
      this.loading = true;
      try {
        const api = useApi();
        const dataForm = new FormData();
        dataForm.append('flowname', flowName);
        dataForm.append('reportid', id.toString());
        dataForm.append('format', format);
        
        for(const key in additionalParams) {
          dataForm.append(key, additionalParams[key]);
        }

        // Check if donlotFile exists on api (it might be extended)
        if (typeof (api as any).donlotFile === 'function') {
           await (api as any).donlotFile('/api/admin/execute-flow', dataForm, `Report_${id}.${format}`);
        } else {
           // Fallback blob download
           const response = await api.post('/api/admin/execute-flow', dataForm, { responseType: 'blob' });
           const blob = new Blob([response]);
           const link = document.createElement('a');
           link.href = window.URL.createObjectURL(blob);
           link.download = `Report_${id}.${format}`;
           link.click();
        }
      } finally {
        this.loading = false;
      }
    },
  }
})