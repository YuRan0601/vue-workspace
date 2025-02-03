<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      items: ["景點 A", "景點 B", "景點 C"],
    };
  },
};
</script>

<template>
  <div>
    <h3>拖曳排序</h3>
    <draggable v-model="items" tag="ul" item-key="name">
      <template #item="{ element }">
        <li>{{ element }}</li>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #f0f0f0;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  cursor: grab;
}
</style>
