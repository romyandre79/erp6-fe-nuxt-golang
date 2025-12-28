import { ref, reactive, computed, watch, toRaw, onMounted } from 'vue';

export function useCanvas() {
  const tables = reactive<any[]>([]);
  const relations = reactive<any[]>([]);
  const areas = reactive<any[]>([]);

  const zoom = ref(1);
  const zoomStep = 0.1;
  const minZoom = 0.2;
  const maxZoom = 3;

  const dragging = ref<any>(null);
  const offset = ref({ x: 0, y: 0 });
  const activeArea = ref<any>(null);
  const areaMode = ref<string | null>(null);
  const areaOffset = ref({ x: 0, y: 0 });
  const activeAreaTables = ref<any[]>([]);

  // Linking state
  const linkPreview = reactive<{ active: boolean; from: any; sx: number; sy: number; path: string }>({
    active: false,
    from: null,
    sx: 0,
    sy: 0,
    path: '',
  });

  // Zoom controls
  function zoomIn() {
    zoom.value = Math.min(zoom.value + zoomStep, maxZoom);
  }
  function zoomOut() {
    zoom.value = Math.max(zoom.value - zoomStep, minZoom);
  }
  function resetZoom() {
    zoom.value = 1;
  }

  // Path helper
  function makePath(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  }

  // Relations
  function computeRelationsPaths() {
    relations.forEach((r) => {
      const A = tables.find((t) => t.id === r.from.table);
      const B = tables.find((t) => t.id === r.to.table);
      if (!A || !B) return;

      // Update indices dynamically based on names
      if (r.from.colName) {
        const idx = A.columns.findIndex((c: any) => c.name === r.from.colName);
        if (idx !== -1) r.from.col = idx;
      }
      if (r.to.colName) {
        const idx = B.columns.findIndex((c: any) => c.name === r.to.colName);
        if (idx !== -1) r.to.col = idx;
      }

      const y1 = A.y + 36 + r.from.col * 24;
      const x1 = A.x + A.width;
      const y2 = B.y + 36 + r.to.col * 24;
      const x2 = B.x;
      r.path = makePath(x1, y1, x2, y2);
    });
  }

  watch(tables, computeRelationsPaths, { deep: true });
  watch(relations, computeRelationsPaths, { deep: true });

  return {
    tables,
    relations,
    areas,
    zoom,
    dragging,
    offset,
    activeArea,
    areaMode,
    areaOffset,
    activeAreaTables,
    linkPreview,
    zoomIn,
    zoomOut,
    resetZoom,
    makePath,
    computeRelationsPaths,
  };
}
