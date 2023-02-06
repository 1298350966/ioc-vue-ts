<template>
  <draggable :value="draggableValue" force-fallback="true" :group="draggableGroup" chosenClass="chosen"
             animation="100" @start="onStart" @end="onEnd">
    <transition>
      <span class="drag-item" :title="node.level > 1 ? data.name + '(' + data.model + ')' : data.name">
        {{ node.level > 1 ? data.name + '(' + data.model + ')' : data.name }}
      </span>
    </transition>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },

    computed: {
      draggableValue() {
        let dataArray = [];
        dataArray.push(this.data);
        return dataArray;
      }
    },

    props: {
      node: {type: Object},
      data:{type: Object},
      onDrag:{type: Function},
      onEndDrag: {type: Function}
    },

    data() {
      return {
        draggableGroup: {name: 'settings', pull: 'clone', put: false}
      };
    },

    methods: {
      onStart(e) {
        this.onDrag(this.node, this.data);
      },
      onEnd(e) {
        this.onEndDrag();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .drag-item {
    display: block;
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: border .25s linear;
  }

  .chosen {
    border: 1px solid #468CFF !important;
    color: #fff;
  }
</style>