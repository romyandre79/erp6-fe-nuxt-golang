<script lang="ts">
import { defineComponent, h, resolveComponent, ref, onMounted, PropType } from 'vue';
import { useApi } from '#imports';

export default defineComponent({
  props: {
    container: {
      type: Object,
      required: true,
    },
    renderChild: {
      type: Function as PropType<(child: any) => any>,
      required: true,
    },
  },
  setup(props) {
    const Api = useApi();
    const data = ref<any>(null);

    onMounted(async () => {
      if (props.container.props.searchflow) {
        const dataForm = new FormData();
        dataForm.append('flowname', props.container.props.searchflow);
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');
        try {
          const res = await Api.post('admin/execute-flow', dataForm);
          if (res.code === 200) {
            data.value = res.data.data;
          }
        } catch (err) {
          console.error(err);
        }
      }
    });

    return () => {
      const children = props.container.children || [];
      return h(
        resolveComponent('UPageCard'),
        {
          title: props.container.props.title,
          description: props.container.props.description,
          icon: props.container.props.icon,
          orientation: props.container.props.orientation,
          spotlight: props.container.props.spotlight,
          'spotlight-color': props.container.props.spotlightcolor,
          class: props.container.props.class,
        },
        {
          default: () =>
            children.map((child: any) => {
              if (child.props?.key === 'data') {
                return h('div', { class: child.props.class }, [
                  child.props.text ? h('div', data.value + ' ' + child.props.text) : null,
                ]);
              }
              return props.renderChild(child);
            }),
        },
      );
    };
  },
});
</script>
