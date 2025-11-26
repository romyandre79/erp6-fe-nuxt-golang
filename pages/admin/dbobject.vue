<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <header class="flex items-center justify-between p-4 border-b bg-white">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Database Designer — Nuxt + Tailwind</h1>
        <p class="text-sm text-gray-500">drag & drop, relasi, import/export JSON, save via API</p>
      </div>
      <div class="flex items-center gap-2">
        <input @change="onLoadFile" ref="fileInput" type="file" accept="application/json" class="hidden" />
        <button @click="$refs.fileInput.click()" class="px-3 py-1 rounded bg-white border">Load JSON</button>
        <button @click="downloadJSON" class="px-3 py-1 rounded bg-blue-600 text-white">Download JSON</button>
        <button @click="saveToBackend" class="px-3 py-1 rounded bg-green-600 text-white">Save to Backend</button>
        <button @click="resetDesign" class="px-3 py-1 rounded bg-red-500 text-white">Reset</button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- canvas -->
      <div class="flex-1 relative p-4 bg-gray-100" @dragover.prevent @drop="onDropCanvas" ref="canvasRef">
        <!-- SVG relations -->
        <svg class="absolute inset-0 pointer-events-none" style="overflow: visible">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="black" />
            </marker>
          </defs>

          <g v-for="rel in relations" :key="rel.id">
            <path :d="rel.path" stroke="black" stroke-width="2" fill="none" marker-end="url(#arrow)" />
          </g>

          <!-- live preview line while linking -->
          <path
            v-if="linkPreview.active"
            :d="linkPreview.path"
            stroke="gray"
            stroke-width="2"
            fill="none"
            stroke-dasharray="6 4"
          />
        </svg>

        <!-- tables -->
        <div
          v-for="table in tables"
          :key="table.id"
          class="absolute shadow-lg rounded border bg-white cursor-move"
          :style="{ left: table.x + 'px', top: table.y + 'px', width: table.width + 'px' }"
          draggable="true"
          @dragstart="onDragStart(table, $event)"
          @dblclick="selectTable(table.id)"
          :data-table-id="table.id"
        >
          <div class="flex items-center justify-between p-2 bg-gray-800 text-white rounded-t">
            <div class="font-medium">{{ table.name || 'table_' + table.id }}</div>
            <div class="flex gap-1">
              <button @click.stop="duplicateTable(table)" title="Duplicate" class="text-xs px-2">⧉</button>
              <button @click.stop="deleteTable(table.id)" title="Delete" class="text-xs px-2">✕</button>
            </div>
          </div>

          <div class="p-2 text-xs">
            <div v-for="(col, i) in table.columns" :key="i" class="flex items-center gap-2" :data-col-index="i">
              <span class="w-6 text-gray-600">{{ i + 1 }}</span>
              <span class="flex-1 truncate">{{ col.name }}</span>
              <span class="text-gray-500 text-[11px]">{{ col.type || '' }}</span>

              <!-- small handle to start linking -->
              <button
                @pointerdown.stop.prevent="startLink(table.id, i, $event)"
                class="w-4 h-4 rounded-full bg-blue-500"
                title="Start relation"
              ></button>
            </div>
          </div>
        </div>

        <!-- add table button pinned bottom-left -->
        <div class="absolute left-4 bottom-4">
          <button @click="addTableAt(40, 40)" class="px-3 py-2 rounded bg-green-600 text-white">Add Table</button>
        </div>
      </div>

      <!-- properties panel -->
      <aside class="w-96 border-l bg-white p-4 overflow-auto">
        <div v-if="selectedTable" class="space-y-4">
          <h2 class="text-lg font-semibold">Properties — {{ selectedTable.name || 'Untitled' }}</h2>

          <div>
            <label class="text-sm text-gray-600">Table Name</label>
            <input v-model="selectedTable.name" class="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label class="text-sm text-gray-600">Position</label>
            <div class="flex gap-2 mt-1">
              <input type="number" v-model.number="selectedTable.x" class="w-1/3 p-2 border rounded" />
              <input type="number" v-model.number="selectedTable.y" class="w-1/3 p-2 border rounded" />
              <input type="number" v-model.number="selectedTable.width" class="w-1/3 p-2 border rounded" />
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600">Columns</label>
            <div class="mt-2 space-y-2">
              <div v-for="(col, idx) in selectedTable.columns" :key="idx" class="flex items-center gap-2">
                <input v-model="col.name" placeholder="name" class="flex-1 p-2 border rounded" />
                <input v-model="col.type" placeholder="type" class="w-36 p-2 border rounded" />
                <button @click="removeColumn(idx)" class="px-2 py-1 bg-red-500 text-white rounded">-</button>
              </div>
              <div class="flex gap-2">
                <button @click="addColumn()" class="px-3 py-1 bg-blue-600 text-white rounded">Add Column</button>
                <button @click="autoTypes()" class="px-3 py-1 bg-gray-200 rounded">Auto Types</button>
              </div>
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600">Raw JSON</label>
            <textarea
              v-model="jsonPreview"
              rows="6"
              class="w-full p-2 border rounded mt-1 text-xs font-mono"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button @click="applyJSONToSelected" class="px-3 py-1 bg-green-600 text-white rounded">Apply</button>
              <button @click="copyJSONToClipboard" class="px-3 py-1 bg-indigo-600 text-white rounded">Copy</button>
            </div>
          </div>
        </div>

        <div v-else class="text-gray-500">
          <p>Pilih tabel di kanvas (double-click) untuk mengedit properties.</p>
          <p class="mt-2 text-sm">Atau gunakan tombol Add Table untuk membuat baru.</p>
        </div>

        <hr class="my-4" />

        <div>
          <h3 class="font-semibold">Export / Import</h3>
          <pre class="mt-2 text-xs bg-gray-50 p-2 border rounded max-h-44 overflow-auto font-mono">{{
            JsonExport
          }}</pre>
        </div>

        <div class="mt-4">
          <h3 class="font-semibold">Relations</h3>
          <div v-if="relations.length">
            <div v-for="r in relations" :key="r.id" class="flex items-center justify-between mt-2">
              <div class="text-sm">{{ r.from.table }}.{{ r.from.col }} ➜ {{ r.to.table }}.{{ r.to.col ?? '-' }}</div>
              <div class="flex gap-2">
                <button @click="editRelation(r.id)" class="px-2 py-1 bg-gray-200 rounded">Edit</button>
                <button @click="removeRelation(r.id)" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm">No relations</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, toRaw, nextTick } from 'vue';

let idSeq = 1;
let relSeq = 1;

const tables = reactive([]);
const relations = reactive([]);

const selectedId = ref(null);
const dragging = ref(null);
const offset = ref({ x: 0, y: 0 });
const canvasRef = ref(null);

const jsonPreview = ref('');

// linking state for creating relations
const linkPreview = reactive({ active: false, from: null, sx: 0, sy: 0, path: '' });

function makeTable(x = 60, y = 60) {
  return {
    id: idSeq++,
    name: `table_${idSeq - 1}`,
    x,
    y,
    width: 220,
    columns: [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar' },
    ],
  };
}

function addTableAt(x, y) {
  tables.push(makeTable(x, y));
}

function selectTable(id) {
  selectedId.value = id;
  const t = tables.find((x) => x.id === id);
  jsonPreview.value = t ? JSON.stringify(t, null, 2) : '';
}

const selectedTable = computed(() => tables.find((t) => t.id === selectedId.value) || null);

function onDragStart(table, ev) {
  dragging.value = table.id;
  const rect = ev.target.getBoundingClientRect();
  offset.value = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
}

function onDropCanvas(ev) {
  const canvas = canvasRef.value.getBoundingClientRect();
  if (!dragging.value) return;
  const table = tables.find((t) => t.id === dragging.value);
  if (!table) return;
  table.x = ev.clientX - canvas.left - offset.value.x;
  table.y = ev.clientY - canvas.top - offset.value.y;
  dragging.value = null;
  computeRelationsPaths();
}

function deleteTable(id) {
  const idx = tables.findIndex((t) => t.id === id);
  if (idx >= 0) tables.splice(idx, 1);
  // remove relations referencing it
  for (let i = relations.length - 1; i >= 0; i--) {
    if (relations[i].from.table === id || relations[i].to.table === id) relations.splice(i, 1);
  }
}

function duplicateTable(table) {
  const copy = JSON.parse(JSON.stringify(table));
  copy.id = idSeq++;
  copy.x += 20;
  copy.y += 20;
  copy.name = table.name + '_copy';
  tables.push(copy);
  computeRelationsPaths();
}

function addColumn() {
  if (selectedTable.value) selectedTable.value.columns.push({ name: 'new_col', type: 'varchar' });
}
function removeColumn(idx) {
  if (selectedTable.value) selectedTable.value.columns.splice(idx, 1);
}

function autoTypes() {
  if (!selectedTable.value) return;
  selectedTable.value.columns.forEach((c) => {
    const n = (c.name || '').toLowerCase();
    if (n.includes('id')) c.type = 'int';
    else if (n.includes('date') || n.includes('at')) c.type = 'datetime';
    else if (n.startsWith('is_') || n.startsWith('is')) c.type = 'boolean';
    else c.type = c.type || 'varchar';
  });
  jsonPreview.value = JSON.stringify(selectedTable.value, null, 2);
}

function applyJSONToSelected() {
  if (!selectedTable.value) return;
  try {
    const obj = JSON.parse(jsonPreview.value);
    selectedTable.value.name = obj.name || selectedTable.value.name;
    selectedTable.value.x = Number(obj.x ?? selectedTable.value.x);
    selectedTable.value.y = Number(obj.y ?? selectedTable.value.y);
    selectedTable.value.width = Number(obj.width ?? selectedTable.value.width);
    if (Array.isArray(obj.columns)) selectedTable.value.columns = obj.columns;
    computeRelationsPaths();
    alert('Applied to selected table');
  } catch (e) {
    alert('Invalid JSON');
  }
}

function copyJSONToClipboard() {
  navigator.clipboard.writeText(jsonPreview.value).then(() => alert('Copied'));
}

const JsonExport = computed(() => JSON.stringify({ tables: toRaw(tables), relations: toRaw(relations) }, null, 2));

function downloadJSON() {
  const blob = new Blob([JsonExport.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function onLoadFile(ev) {
  const f = ev.target.files?.[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(reader.result);
      if (obj && Array.isArray(obj.tables)) {
        tables.splice(0, tables.length, ...obj.tables.map((t) => ({ ...t })));
        relations.splice(
          0,
          relations.length,
          ...(Array.isArray(obj.relations) ? obj.relations.map((r) => ({ ...r })) : []),
        );
        idSeq = Math.max(...tables.map((t) => t.id), 0) + 1;
        relSeq = Math.max(...relations.map((r) => r.id), 0) + 1;
        selectedId.value = null;
        computeRelationsPaths();
      } else {
        alert('Invalid design file');
      }
    } catch (e) {
      alert('Failed to parse file');
    }
  };
  reader.readAsText(f);
  ev.target.value = '';
}

function resetDesign() {
  if (!confirm('Reset design?')) return;
  tables.splice(0, tables.length);
  relations.splice(0, relations.length);
  idSeq = 1;
  relSeq = 1;
  selectedId.value = null;
}

// Relation creation: pointerdown on a column starts linking, pointerup over target column finishes
function startLink(tableId, colIndex, ev) {
  const canvas = canvasRef.value.getBoundingClientRect();
  const t = tables.find((x) => x.id === tableId);
  if (!t) return;
  const colY = t.y + 36 + colIndex * 24; // approx y inside table
  linkPreview.active = true;
  linkPreview.from = { table: tableId, col: colIndex };
  linkPreview.sx = t.x + t.width;
  linkPreview.sy = colY;
  updatePreviewPath(ev.clientX - canvas.left, ev.clientY - canvas.top);

  const moveHandler = (e) => updatePreviewPath(e.clientX - canvas.left, e.clientY - canvas.top);
  const upHandler = (e) => finishLink(e, moveHandler, upHandler);
  window.addEventListener('pointermove', moveHandler);
  window.addEventListener('pointerup', upHandler);
}

function updatePreviewPath(px, py) {
  linkPreview.path = makePath(linkPreview.sx, linkPreview.sy, px, py);
}

function finishLink(ev, moveHandler, upHandler) {
  window.removeEventListener('pointermove', moveHandler);
  window.removeEventListener('pointerup', upHandler);
  if (!linkPreview.active) return;
  const canvas = canvasRef.value.getBoundingClientRect();
  // detect which table/column is under pointer
  const x = ev.clientX - canvas.left;
  const y = ev.clientY - canvas.top;
  let target = null;
  for (const t of tables) {
    if (x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + 200) {
      // estimate column index
      const idx = Math.floor((y - (t.y + 36)) / 24);
      if (idx >= 0 && idx < t.columns.length) {
        target = { table: t.id, col: idx };
        break;
      }
    }
  }

  if (target) {
    const rel = {
      id: relSeq++,
      from: {
        table: linkPreview.from.table,
        col: linkPreview.from.col,
        colName: tables.find((t) => t.id === linkPreview.from.table).columns[linkPreview.from.col].name,
      },
      to: {
        table: target.table,
        col: target.col,
        colName: tables.find((t) => t.id === target.table).columns[target.col].name,
      },
      path: '',
    };
    relations.push(rel);
    computeRelationsPaths();
  }

  linkPreview.active = false;
  linkPreview.path = '';
}

function makePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

function computeRelationsPaths() {
  // compute path for each relation
  relations.forEach((r) => {
    const A = tables.find((t) => t.id === r.from.table);
    const B = tables.find((t) => t.id === r.to.table);
    if (!A || !B) return;
    const y1 = A.y + 36 + r.from.col * 24;
    const x1 = A.x + A.width;
    const y2 = B.y + 36 + r.to.col * 24;
    const x2 = B.x;
    r.path = makePath(x1, y1, x2, y2);
  });
}

function removeRelation(id) {
  const idx = relations.findIndex((r) => r.id === id);
  if (idx >= 0) relations.splice(idx, 1);
}
function editRelation(id) {
  alert('Edit relation not implemented yet');
}

watch(tables, computeRelationsPaths, { deep: true });
watch(relations, computeRelationsPaths, { deep: true });

// SAVE
async function saveToBackend() {
  const payload = { tables: toRaw(tables), relations: toRaw(relations) };
  try {
    await $fetch('/api/designer/save', { method: 'POST', body: payload });
    alert('Saved to backend');
  } catch (e) {
    console.error(e);
    alert('Failed to save to backend');
  }
}

// init sample
addTableAt(40, 40);
addTableAt(320, 120);
// EXPORT JSON
function exportJSON() {
  const payload = {
    tables: toRaw(tables),
    relations: toRaw(relations),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'db-designer.json';
  a.click();
  URL.revokeObjectURL(url);
}

// IMPORT JSON
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const data = JSON.parse(ev.target.result);
    tables.splice(0, tables.length, ...(data.tables || []));
    relations.splice(0, relations.length, ...(data.relations || []));
    computeRelationPoints();
  };
  reader.readAsText(file);
}
</script>

<style scoped>
/* small tweaks */
</style>
