// plugins/drawflow.client.ts
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css';
import 'assets/css/drawflow.css';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      drawflow: Drawflow,
    },
  };
});
