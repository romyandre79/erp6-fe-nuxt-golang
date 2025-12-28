<template>
  <div class="p-4">
    <FormRender :schema="schema" menuName="orgchart_demo" title="Organization Chart Demo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const schema = ref({
  components: [
    {
      type: 'title',
      props: {
        text: 'Company Structure',
        class: 'text-2xl font-bold mb-4',
      },
    },
    {
      type: 'orgchart',
      props: {
        key: 'main_org_chart',
        source: 'get_org_structure', // Replace with actual flow
        onCreate: 'create_org_node',
        onUpdate: 'update_org_node',
        onDelete: 'delete_org_node',
        modalKey: 'modal_node_detail',
        config: {
          nodeKey: 'id',
          parentKey: 'parent_id',
          labelKey: 'name',
          titleKey: 'position',
          imageKey: 'avatar',
        },
        class: 'h-[800px] shadow-lg rounded-xl',
      },
    },
    // --- Modal for Adding/Editing Nodes ---
    {
      type: 'modal',
      props: {
        key: 'modal_node_detail', // Matches modalKey in orgchart
        text: 'Position Details',
        class: 'max-w-2xl',
      },
      children: [
        {
          type: 'hidden',
          props: { key: 'id' },
        },
        {
          type: 'hidden',
          props: { key: 'parent_id' },
        },
        {
          type: 'row',
          children: [
            {
              type: 'col',
              props: { class: 'w-full md:w-1/2 p-2' },
              children: [
                {
                  type: 'text',
                  props: {
                    key: 'name',
                    label: 'Name',
                    place: 'e.g. John Doe',
                    required: true,
                  },
                },
                {
                  type: 'text',
                  props: {
                    key: 'position',
                    label: 'Position Title',
                    place: 'e.g. CEO',
                    required: true,
                  },
                },
              ],
            },
            {
              type: 'col',
              props: { class: 'w-full md:w-1/2 p-2' },
              children: [
                {
                  type: 'select',
                  props: {
                    key: 'status',
                    label: 'Status',
                    source: 'get_status_options', // Example: Active, Vacant
                    required: true,
                  },
                },
                {
                  type: 'image',
                  props: {
                    key: 'avatar',
                    label: 'Avatar',
                    isinput: true,
                  },
                },
              ],
            },
          ],
        },
        // --- Employee List (Detail Table) ---
        {
          type: 'title',
          props: { text: 'Assigned Employees', class: 'text-lg font-semibold mt-4 mb-2' },
        },
        {
          type: 'detailtable',
          props: {
            key: 'members', // Data key in the node object
            class: 'mb-4',
          },
          children: [
            {
              type: 'columns',
              children: [
                { type: 'text', props: { key: 'employee_id', label: 'ID' } },
                { type: 'text', props: { key: 'name', label: 'Name' } },
                { type: 'text', props: { key: 'role', label: 'Role' } },
              ],
            },
          ],
        },
        // --- Action Buttons ---
        {
          type: 'buttons',
          props: { class: 'flex justify-end gap-2 mt-4' },
          children: [
            {
              type: 'button',
              props: {
                text: 'Cancel',
                onClick: 'F7', // Close modal
                class: 'bg-white border hover:bg-gray-50',
              },
            },
            {
              type: 'button',
              props: {
                text: 'Save',
                onClick: 'F6', // Save data
                class: 'bg-primary-600 text-white hover:bg-primary-700',
              },
            },
          ],
        },
      ],
    },
  ],
});
</script>
