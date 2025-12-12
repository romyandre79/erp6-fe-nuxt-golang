// Report Components TypeScript Definitions

export interface ReportComponent {
  type: string;
  label: string;
  icon: string;
  category: 'basic' | 'data' | 'charts' | 'special';
  props: Record<string, any>;
}

export const reportComponents: ReportComponent[] = [
  // Basic Elements
  {
    type: 'staticText',
    label: 'Static Text',
    icon: 'i-heroicons-document-text',
    category: 'basic',
    props: {
      text: 'Label',
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      fontSize: 12,
      fontFamily: 'Arial',
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
      backgroundColor: 'transparent',
      alignment: 'left',
      verticalAlignment: 'top',
      border: { style: 'none', width: 0, color: '#000000' },
    },
  },
  {
    type: 'textField',
    label: 'Text Field',
    icon: 'i-heroicons-variable',
    category: 'basic',
    props: {
      expression: '$F{fieldName}',
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      fontSize: 12,
      fontFamily: 'Arial',
      pattern: '',
      isBlankWhenNull: true,
      color: '#000000',
      alignment: 'left',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'i-heroicons-photo',
    category: 'basic',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      source: '',
      scaleMode: 'retainShape',
      hAlign: 'center',
      vAlign: 'middle',
    },
  },
  {
    type: 'line',
    label: 'Line',
    icon: 'i-heroicons-minus',
    category: 'basic',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 1,
      direction: 'horizontal',
      lineWidth: 1,
      lineStyle: 'solid',
      color: '#000000',
    },
  },
  {
    type: 'rectangle',
    label: 'Rectangle',
    icon: 'i-heroicons-square-2-stack',
    category: 'basic',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: '#000000',
      backgroundColor: 'transparent',
      radius: 0,
    },
  },
  {
    type: 'ellipse',
    label: 'Ellipse',
    icon: 'i-heroicons-circle-stack',
    category: 'basic',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: '#000000',
      backgroundColor: 'transparent',
    },
  },

  // Data Elements
  {
    type: 'table',
    label: 'Data Table',
    icon: 'i-heroicons-table-cells',
    category: 'data',
    props: {
      x: 0,
      y: 0,
      width: 500,
      height: 200,
      columns: [],
      dataSource: '',
      headerHeight: 30,
      rowHeight: 25,
      headerStyle: { backgroundColor: '#f0f0f0', bold: true },
      rowStyle: {},
      alternateRowColor: '#f9f9f9',
    },
  },

  // Charts
  {
    type: 'barChart',
    label: 'Bar Chart',
    icon: 'i-heroicons-chart-bar',
    category: 'charts',
    props: {
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      title: 'Chart Title',
      categoryExpression: '$F{category}',
      valueExpression: '$F{value}',
      orientation: 'vertical',
      showLegend: true,
      showLabels: true,
    },
  },
  {
    type: 'pieChart',
    label: 'Pie Chart',
    icon: 'i-heroicons-chart-pie',
    category: 'charts',
    props: {
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      title: 'Chart Title',
      keyExpression: '$F{category}',
      valueExpression: '$F{value}',
      showLegend: true,
      showLabels: true,
      showPercentages: true,
    },
  },
  {
    type: 'lineChart',
    label: 'Line Chart',
    icon: 'i-heroicons-chart-bar-square',
    category: 'charts',
    props: {
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      title: 'Chart Title',
      categoryExpression: '$F{category}',
      valueExpression: '$F{value}',
      showLegend: true,
      showMarkers: true,
    },
  },

  // Special Elements
  {
    type: 'barcode',
    label: 'Barcode',
    icon: 'i-heroicons-qr-code',
    category: 'special',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      type: 'Code128',
      expression: '$F{barcodeValue}',
      showText: true,
      textPosition: 'bottom',
    },
  },
  {
    type: 'pageNumber',
    label: 'Page Number',
    icon: 'i-heroicons-hashtag',
    category: 'special',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      format: 'Page {0} of {1}',
      fontSize: 10,
      alignment: 'center',
    },
  },
  {
    type: 'currentDate',
    label: 'Current Date',
    icon: 'i-heroicons-calendar',
    category: 'special',
    props: {
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      pattern: 'dd/MM/yyyy',
      fontSize: 10,
      alignment: 'left',
    },
  },
];

// Band types for JasperReports
export const bandTypes = [
  { type: 'title', label: 'Title', defaultHeight: 50 },
  { type: 'pageHeader', label: 'Page Header', defaultHeight: 30 },
  { type: 'columnHeader', label: 'Column Header', defaultHeight: 30 },
  { type: 'detail', label: 'Detail', defaultHeight: 100 },
  { type: 'columnFooter', label: 'Column Footer', defaultHeight: 30 },
  { type: 'pageFooter', label: 'Page Footer', defaultHeight: 30 },
  { type: 'summary', label: 'Summary', defaultHeight: 50 },
];

// Page sizes
export const pageSizes = [
  { name: 'A4 Portrait', width: 595, height: 842, orientation: 'portrait' },
  { name: 'A4 Landscape', width: 842, height: 595, orientation: 'landscape' },
  { name: 'Letter Portrait', width: 612, height: 792, orientation: 'portrait' },
  { name: 'Letter Landscape', width: 792, height: 612, orientation: 'landscape' },
  { name: 'Legal Portrait', width: 612, height: 1008, orientation: 'portrait' },
  { name: 'Legal Landscape', width: 1008, height: 612, orientation: 'landscape' },
  { name: 'Custom', width: 595, height: 842, orientation: 'portrait' },
];
