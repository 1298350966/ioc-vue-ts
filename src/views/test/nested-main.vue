<template>
  <div class="row">
      <div class="col-8">
          <nested-draggable :tasks="list" />
      </div>
      <rawDisplayer
          class="col-3"
          :value="list"
          title="List"
      />
  </div>
</template>

<script>
import nestedDraggable from './nested-draggable.vue';
export default {
  name: 'nested-main',
  display: 'Nested',
  order: 15,
  components: {
      nestedDraggable,
  },
  data() {
      // 文件夹最后需要加一个{name:"",type:0,emptyHolder:true,tasks:[]}的空对象占位，否则无法拖进去
      return {
          list: [
              {
                  name: 'task 1 文件夹',
                  type: 0,
                  tasks: [
                      {
                          name: 'task 2 文件',
                          type: 1,
                          tasks: [
                            {
                              name: 'task 1 文件夹',
                              type: 0,
                              tasks:[]
                            }
                          ]
                      },
                      {
                          name: '',
                          type: 0,
                          emptyHolder: true,
                          tasks: []
                      },
                  ],
              },
              {
                  name: 'task 3 文件夹',
                  type: 0,
                  tasks: [
                      {
                          name: 'task 4 文件',
                          type: 1,
                          tasks: [],
                      },
                      {
                          name: '',
                          type: 0,
                          emptyHolder:true,
                          tasks: []
                      },
                  ],
              },
              {
                  name: 'task 5 文件',
                  type: 1,
                  tasks: []
              },
              {
                  name: 'task 6 文件夹',
                  type: 0,
                  tasks: [
                      {
                          name: 'task 6-1 文件夹',
                          type: 0,
                          tasks: [
                              {
                                  name: '',
                                  type: 0,
                                  emptyHolder:true,
                                  tasks: []
                              },
                          ],
                      },
                      {
                          name: '',
                          type: 0,
                          emptyHolder:true,
                          tasks: []
                      },
                  ],
              },
              {
                  name: 'task 7 文件夹',
                  type: 0,
                  tasks: [
                      {
                          name: '',
                          type: 0,
                          emptyHolder:true,
                          tasks: []
                      },
                  ],
              }
          ],
      };
  },
};
</script>
<style scoped></style>