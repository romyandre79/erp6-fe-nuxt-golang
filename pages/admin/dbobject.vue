<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <header class="flex items-center justify-between p-4 border-b bg-white">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Database Designer</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="addTableAtNextPosition" class="px-3 py-2 rounded bg-green-600 text-white">Add Table</button>
        <button @click="addArea" class="px-3 py-2 rounded bg-purple-600 text-white">Add Area</button>
        <button @click="saveToBackend" class="px-3 py-1 rounded bg-green-600 text-white">Save</button>
        <button @click="resetDesign" class="px-3 py-1 rounded bg-red-500 text-white">Reset</button>
        <button @click="aiSuggestRelations()" class="px-3 py-1 bg-purple-500 text-white rounded">
          AI Suggest Relations
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- canvas -->
      <div class="flex-1 relative p-4 bg-gray-100" @dragover.prevent @drop="onDropCanvas" ref="canvasRef" id="drawflow">
        <!-- SVG relations -->
        <div
          v-for="area in areas"
          :key="area.id"
          :data-area-id="area.id"
          class="absolute rounded-xl border border-purple-400 bg-purple-200/30"
          :style="{
            left: area.x + 'px',
            top: area.y + 'px',
            width: area.width + 'px',
            height: area.height + 'px',
          }"
          @mousedown="startAreaDrag(area, $event)"
        >
          <!-- header -->
          <div
            class="bg-purple-600 text-white text-xs px-2 py-1 rounded-t-xl cursor-move flex items-center justify-between"
          >
            <input v-model="area.name" class="bg-purple-600 outline-none flex-1 rounded px-2" />

            <!-- tombol delete di pojok kanan -->

            <button
              @click.stop="deleteArea(area.id)"
              class="ml-2 text-white hover:text-red-300 font-bold"
              title="Delete Area"
            >
              ✕
            </button>
          </div>
          <!-- resize handle -->
          <div
            class="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 cursor-se-resize rounded"
            @mousedown.stop="startAreaResize(area, $event)"
          ></div>
        </div>

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
        <div class="absolute left-4 bottom-4"></div>
      </div>

      <!-- properties panel -->
      <aside class="w-96 border-l bg-white p-4 overflow-auto">
        <div class="mt-4">
  <label class="text-sm font-semibold">AI Generate Table</label>
  <div class="flex gap-2 mt-1">
    <textarea v-model="aiDescription" placeholder="e.g. Customer table with id, name, email" class="flex-1 p-2 border rounded" />
    <button @click="aiGenerateTableFromDescription(aiDescription)" class="px-3 py-1 bg-yellow-500 text-white rounded">Generate</button>
  </div>
</div>

        <div v-if="selectedTable" class="space-y-4">
          <h2 class="text-lg font-semibold">Properties — {{ selectedTable.name || 'Untitled' }}</h2>

          <div>
            <label class="text-sm text-gray-600">Table Name</label>
            <input v-model="selectedTable.name" class="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label class="text-sm text-gray-600">Comment</label>
            <input v-model="selectedTable.comment" class="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label class="text-sm text-gray-600">Is Published</label>
            <input type="checkbox" v-model="selectedTable.ispublished" class="w-full mt-1 p-2 border rounded" />
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
                <select v-model="col.type" placeholder="type" class="w-36 p-2 border rounded">
                  <option value="auto">Auto Increment</option>
                  <option value="text">Text</option>
                  <option value="longtext">Long Text</option>
                  <option value="number">Number</option>
                  <option value="integer">Integer</option>
                  <option value="timestamp">Time stamp</option>
                  <option value="boolean">Boolean</option>
                </select>
                <input type="checkbox" v-model="col.allownull" placeholder="type" class="w-36 p-2 border rounded" />
                <input v-model="col.default" placeholder="default" class="flex-1 p-2 border rounded" />
                <button @click="removeColumn(idx)" class="px-2 py-1 bg-red-500 text-white rounded">-</button>
              </div>
              <div class="flex gap-2">
                <button @click="addColumn()" class="px-3 py-1 bg-blue-600 text-white rounded">Add Column</button>
                <button
                  @click="aiSuggestColumns(selectedTable)"
                  class="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  AI Suggest Types
                </button>
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

        <div class="mt-4">
          <h3 class="font-semibold">Relations</h3>
          <div v-if="relations.length">
            <div v-for="r in relations" :key="r.id" class="flex items-center justify-between mt-2">
              <div class="text-sm">{{ r.from.table }}.{{ r.from.col }} ➜ {{ r.to.table }}.{{ r.to.col ?? '-' }}</div>
              <div class="flex gap-2">
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

<script setup lang="ts">
import { ref, reactive, computed, watch, toRaw, onMounted } from 'vue';
import { useDbobjectStore } from '~/store/dbobject';
import { useToast } from '#imports';
import html2canvas from 'html2canvas';

let idSeq = 1;
let relSeq = 1;

const tables = reactive([]);
const relations = reactive([]);
const toast = useToast();

const areas = reactive([]);
let areaSeq = 1;

const activeArea = ref(null); // untuk drag/resize area
const areaMode = ref(null); // 'move' atau 'resize'
const areaOffset = ref({ x: 0, y: 0 });

const selectedId = ref(null);
const dragging = ref(null);
const offset = ref({ x: 0, y: 0 });
const canvasRef = ref(null);

const jsonPreview = ref('');
const store = useDbobjectStore();
const dbobject = ref<Dbobject>({
  dbobjectid: '',
  objectname: '',
  dbobjecttypeid: '',
  objectcontent: '',
  objectversion: '',
  ispublished: 0,
  comment: '',
});

// linking state for creating relations
const linkPreview = reactive({ active: false, from: null, sx: 0, sy: 0, path: '' });

function addTableAt(x = 40, y = 40) {
  const table = {
    id: idSeq++,
    dbid: '',
    name: `table_${idSeq}`,
    x,
    y,
    width: 240,
    columns: [
      { name: 'id', type: 'auto' },
      { name: 'name', type: 'text' },
    ],
  };
  tables.push(table);
}

function addTableAtNextPosition() {
  const spacingX = 340;
  const spacingY = 200;
  const perRow = 4;
  const index = tables.length;

  const row = Math.floor(index / perRow);
  const col = index % perRow;

  addTableAt(40 + col * spacingX, 40 + row * spacingY);
}

function createTableFromDBObject(obj, index) {
  let posX = 0;
  let posY = 0;
  let width = 120;
  const perRow = 4;

  const row = Math.floor(index / perRow);
  const col = index % perRow;

  let columns = [];
  if (obj.objectcontent) {
    try {
      const content = JSON.parse(obj.objectcontent);
      if (content?.table?.columns && Array.isArray(content.table.columns)) {
        columns = content.table.columns.map((c) => ({
          name: c.name || 'col',
          type: c.type || 'text',
          allownull: c.allownull ?? false,
          default: c.default ?? '',
        }));
      }
      posX = content?.table?.x ?? 40 + (index % 4) * 340;
      posY = content?.table?.y ?? 40 + Math.floor(index / 4) * 200;
      width = content?.table?.width ?? 240;

      if (content.areas && content.areas.length > 0) {
        content.areas.forEach((area) => {
          if (areas.find((x) => x.id == area.id) == undefined) {
            createAreaFromData(area);
          }
        });
      }
    } catch (e) {
      console.warn(`Invalid objectcontent JSON for ${obj.objectname}`, e);
    }
  }

  // use dbobjectid as dbid, but table.id must be unique local id
  const localId = idSeq++;

  return {
    id: localId,
    dbid: obj.dbobjectid ?? '',
    name: obj.objectname || `table_${index + 1}`,
    x: posX,
    y: posY,
    width: width,
    columns,
    ispublished: obj.ispublished == 1 ? true : false,
    comment: obj.comment ?? '',
  };
}

function createAreaFromData(data) {
  console.log('data ', data);
  const area = {
    id: data.id,
    name: data.name,
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    color: data.color,
    type: 'area',
  };

  areas.push(area);
  renderArea(area);
}

function renderArea(area) {
  const el = document.createElement('div');
  el.className = 'design-area';
  el.style.left = area.x + 'px';
  el.style.top = area.y + 'px';
  el.style.width = area.width + 'px';
  el.style.height = area.height + 'px';
  el.style.background = area.color || '#fef9c3';

  el.dataset.id = area.id;
  el.dataset.type = 'area';

  makeAreaDraggableAndResizable(el, area);
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

async function deleteArea(id) {
  if (!confirm('Are you sure to delete Area ?')) return;
  const idx = areas.findIndex((t) => t.id === id);
  if (idx >= 0) areas.splice(idx, 1);
}

async function deleteTable(id) {
  if (!confirm('Are you sure to delete Table?')) return;
  const idx = tables.findIndex((t) => t.id === id);
  const table = tables.find((t) => t.id === id);
  if (table.dbid) {
    await store.purgeTable(table.dbid);
  }
  if (idx >= 0) tables.splice(idx, 1);
  // remove relations referencing it
  for (let i = relations.length - 1; i >= 0; i--) {
    if (relations[i].from.table === id || relations[i].to.table === id) relations.splice(i, 1);
  }
}

function duplicateTable(table) {
  const copy = JSON.parse(JSON.stringify(table));
  copy.id = idSeq++;
  // reset dbid supaya dianggap entri baru saat save
  copy.dbid = '';
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

async function resetDesign() {
  if (!confirm('Reset design?')) return;
  await loadDesign();
}

function loadRelationsFromObjects(dbobjects, idMap) {
  relations.splice(0, relations.length);
  dbobjects.forEach((obj) => {
    if (!obj.objectcontent) return;
    let parsed;

    try {
      parsed = JSON.parse(obj.objectcontent);
    } catch {
      return;
    }

    if (!parsed.relations || !Array.isArray(parsed.relations)) return;

    parsed.relations.forEach((rel) => {
      const newFromTable = idMap[rel.from.table];
      const newToTable = idMap[rel.to.table];

      if (!newFromTable || !newToTable) return;

      const exists = relations.some(
        (r) =>
          r.from.table === newFromTable &&
          r.from.col === rel.from.col &&
          r.to.table === newToTable &&
          r.to.col === rel.to.col,
      );

      if (exists) return;

      relations.push({
        id: relSeq++,
        from: {
          table: newFromTable,
          col: rel.from.col,
          colName: rel.from.colName,
        },
        to: {
          table: newToTable,
          col: rel.to.col,
          colName: rel.to.colName,
        },
        path: '',
      });
    });
  });

  computeRelationsPaths();
}

async function loadDesign() {
  // reset local arrays
  tables.splice(0, tables.length);
  relations.splice(0, relations.length);
  areas.splice(0, areas.length);
  idSeq = 1;
  relSeq = 1;
  selectedId.value = null;

  await store.fetchAll();

  // dedupe backend list by dbobjectid (fall back ke objectname)
  const seen = new Set();
  const unique = [];
  const idMap = {};

  (store.dbobjects || []).forEach((obj) => {
    const key = obj?.dbobjectid ? String(obj.dbobjectid) : (obj?.objectname ?? '');
    if (!key) return; // skip invalid
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(obj);
    } else {
      console.debug('Skipping duplicate dbobject from store:', key);
    }
  });

  unique.forEach((obj, idx) => {
    const table = createTableFromDBObject(obj, idx);
    idMap[obj.dbobjectid] = table.id;
    tables.push(table);
  });

  // ensure idSeq is after max local id
  idSeq = Math.max(...tables.map((t) => t.id), 0) + 1;
  loadRelationsFromObjects(unique, idMap);
  computeRelationsPaths();
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

watch(tables, computeRelationsPaths, { deep: true });
watch(relations, computeRelationsPaths, { deep: true });

// SAVE
async function saveToBackend() {
  if (!tables.length) return alert('No tables to save');

  try {
    for (const table of toRaw(tables)) {
      const payloadObj = {
        table,
        relations: relations
          .filter((r) => r.from.table === table.id || r.to.table === table.id)
          .map((r) => ({
            id: r.id,
            from: { ...r.from, table: tables.find((t) => t.id === r.from.table)?.dbid },
            to: { ...r.to, table: tables.find((t) => t.id === r.to.table)?.dbid },
          })),
        areas,
      };

      const dbobj = {
        dbobjectid: table.dbid ? String(table.dbid) : '', // if empty -> create new
        objectname: table.name,
        dbobjecttypeid: '1',
        objectcontent: JSON.stringify(payloadObj),
        objectversion: '1',
        ispublished: table.ispublished ? 1 : 0,
        comment: table.comment || '',
      };

      // backend should return saved dbobject with dbobjectid
      const res = await store.saveTable(dbobj);
      // attempt to read returned id (adapt sesuai response shape)
      const returned = res?.data?.data ?? res;
      const newId = returned?.dbobjectid ?? returned?.dbobjectid ?? null;
      if (newId) {
        // update local table mapping
        const local = tables.find((t) => t.id === table.id);
        if (local) local.dbid = newId;
      }
    }
    toast.add({ title: 'Success', description: 'Runtime schema saved successfully', color: 'success' });
  } catch (err) {
    console.error(err);
    toast.add({ title: 'Error', description: String(err), color: 'error' });
  }
}

onMounted(async () => {
  await loadDesign();
});

function addArea() {
  ((areaSeq = areaSeq + 1),
    areas.push({
      id: areaSeq,
      name: 'Area ' + areaSeq,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      color: '#e3e9ff',
    }));
}

function startAreaDrag(area, ev) {
  activeArea.value = area;
  areaMode.value = 'move';
  areaOffset.value = {
    x: ev.clientX - area.x,
    y: ev.clientY - area.y,
  };

  window.addEventListener('mousemove', onAreaMouseMove);
  window.addEventListener('mouseup', stopAreaInteraction);
}

function startAreaResize(area, ev) {
  activeArea.value = area;
  areaMode.value = 'resize';
  areaOffset.value = {
    x: ev.clientX,
    y: ev.clientY,
  };

  window.addEventListener('mousemove', onAreaMouseMove);
  window.addEventListener('mouseup', stopAreaInteraction);
}

function onAreaMouseMove(ev) {
  if (!activeArea.value) return;
  const A = activeArea.value;

  if (areaMode.value === 'move') {
    A.x = ev.clientX - areaOffset.value.x;
    A.y = ev.clientY - areaOffset.value.y;
  }

  if (areaMode.value === 'resize') {
    const dx = ev.clientX - areaOffset.value.x;
    const dy = ev.clientY - areaOffset.value.y;
    A.width += dx;
    A.height += dy;
    areaOffset.value = { x: ev.clientX, y: ev.clientY };
  }
}

function stopAreaInteraction() {
  activeArea.value = null;
  areaMode.value = null;
  window.removeEventListener('mousemove', onAreaMouseMove);
  window.removeEventListener('mouseup', stopAreaInteraction);
}

function aiSuggestColumns(table) {
  if (!table || !table.columns) return;

  table.columns.forEach((col) => {
    const name = (col.name || '').toLowerCase();

    // heuristic type detection
    if (name.includes('id')) col.type = 'auto';
    else if (name.includes('date') || name.endsWith('at')) col.type = 'timestamp';
    else if (name.startsWith('is') || name.startsWith('has')) col.type = 'boolean';
    else if (name.includes('amount') || name.includes('price') || name.includes('total')) col.type = 'number';
    else col.type = 'text';
  });
}

function aiSuggestRelations() {
  const existingRelations = new Set(
    relations.map(r => `${r.from.table}_${r.from.col}-${r.to.table}_${r.to.col}`)
  );

  const primaryKeys = tables.reduce((acc, t) => {
    const pkCols = t.columns
      .map((c, idx) => (c.type === 'auto' ? idx : null))
      .filter(x => x !== null);
    acc[t.id] = pkCols; 
    return acc;
  }, {} as Record<number, number[]>);

  for (let i = 0; i < tables.length; i++) {
    const t1 = tables[i];
    for (let j = 0; j < tables.length; j++) {
      if (i === j) continue;
      const t2 = tables[j];

      t1.columns.forEach((col1, idx1) => {
        if (col1.name.toLowerCase() === t2.name.toLowerCase() + 'id') {
          if (!primaryKeys[t2.id] || primaryKeys[t2.id].length === 0) return;
          const idx2 = primaryKeys[t2.id][0];

          // cek duplikat
          const key = `${t1.id}_${idx1}-${t2.id}_${idx2}`;
          const revKey = `${t2.id}_${idx2}-${t1.id}_${idx1}`;
          if (existingRelations.has(key) || existingRelations.has(revKey)) return;

          relations.push({
            id: relSeq++,
            from: { table: t1.id, col: idx1, colName: col1.name },
            to: { table: t2.id, col: idx2, colName: t2.columns[idx2].name },
            path: '',
          });
          existingRelations.add(key);
        }
      });
    }
  }

  computeRelationsPaths();
  toast.add({ title: 'Auto Relations', description: 'Relations generated intelligently', color: 'success' });
}

function aiGenerateTableFromDescription(description: string) {
  if (!description) return;

  // buat nama tabel default: ambil kata pertama
  const words = description.trim().split(/\s+/);
  const tableName = words[0] || 'table_' + idSeq;

  // cek duplikat
  if (tables.some(t => t.name.toLowerCase() === tableName.toLowerCase())) {
    toast.add({
      title: 'Duplicate Table',
      description: `Table with name "${tableName}" already exists!`,
      color: 'warning',
    });
    return; // stop jika duplikat
  }

  // cari kolom: kata setelah 'with'
  let columnsPart = description.toLowerCase().split('with')[1] || '';
  columnsPart = columnsPart.replace(/and/g, ','); // normalize
  const colNames = columnsPart.split(',').map(c => c.trim()).filter(c => c);

  // buat tabel object
  const newTable = {
    id: idSeq++,
    dbid: '',
    name: tableName,
    x: 40 + (tables.length % 4) * 340,
    y: 40 + Math.floor(tables.length / 4) * 200,
    width: 240,
    columns: colNames.map(name => {
      let type = 'text';

      // logika AI: if 'id' + kata sama/mirip table → auto
      if (name.includes('id') && name.replace(/_/g,'').includes(tableName.toLowerCase())) {
        type = 'auto';
      } else if (name.includes('id')) {
        type = 'int';
      } else if (name.includes('date') || name.endsWith('at')) {
        type = 'timestamp';
      } else if (name.startsWith('is') || name.startsWith('has') || name.startsWith('recordstatus')) {
        type = 'boolean';
      } else if (name.includes('amount') || name.includes('price') || name.includes('total')) {
        type = 'number';
      }

      return { name, type };
    }),
    ispublished: false,
    comment: '',
  };

  tables.push(newTable);
  selectTable(newTable.id);
  computeRelationsPaths();

    aiSuggestRelations();

  toast.add({
    title: 'AI Table Generated',
    description: `Table "${tableName}" created!`,
    color: 'success',
  });
}



</script>

<style>
.design-area {
  position: absolute;
  border: 2px dashed #d4d4d8;
  border-radius: 6px;
  box-sizing: border-box;
}

.area-toolbar {
  position: absolute;
  top: -28px;
  right: 0;
  display: flex;
  gap: 4px;
}

.area-toolbar button {
  background: #1e293b;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.area-toolbar button:hover {
  background: #475569;
}
</style>
