<template>
  <div v-if="tasks&&tasks.length>0">
      <draggable
          class="dragArea"
          tag="div"
          v-bind="dragOptions"
          :list="tasks"
          :group="{ name: 'g1' }"
      >   <template #item="{ element }">

              <div
                  class="list-group-item"
                  :class="{'nested-1':element.type==0,'nested-2':element.type==1}"
                   v-if="!element.emptyHolder"
                  :key="index"
              >
                  <p>{{ element.name }}</p>
                  <nested-draggable :tasks="element.tasks"></nested-draggable>
              </div>
            </template>
      </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'nested-draggable',
  components: {
      draggable,
  },
  computed: {
      dragOptions() {
          return {
              group: 'nested',
              ghostClass: 'ghost',
              animation: 150,
              fallbackOnBody: true,
              swapThreshold: 0.65,
          };
      },
  },
  props: {
      tasks: {
          required: true,
          type: Array,
      },
  },
  methods: {
     
  },
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
.list-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
}

.list-group-item {
  margin-top: 5px;
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.nested-1 {
  background-color: #e6e6e6;
}

.nested-2 {
  background-color: #cccccc;
}
.nested-3 {
  background-color: #b3b3b3;
}
</style>