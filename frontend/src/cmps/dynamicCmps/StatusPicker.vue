<template>
  <div
    class="status full-cell"
    v-clickOutside="closeModal"
    @click="toggleModal"
    :style="{ 'background-color': color }"
  >
    {{ task.status }}
    <TaskDropdown
      v-if="showDropdown"
      :options="labels"
      :type="'status'"
      @updateOption="updateStatus"
      @updateOptions="updateOptions"
      optionClass="status-option"
    />
    <span class="peeling-span scale-up-tr"></span>
  </div>
</template>

<script>
import TaskDropdown from "../TaskDropdown.vue";

export default {
  emits: ["updateTask", "updateOptions", "addLabel"],
  props: {
    task: Object,
  },
  name: "",
  created() {},
  data() {
    return {
      showDropdown: false,
      selectedStatus: this.task.status,
    };
  },
  methods: {
    async updateStatus(status) {
      this.selectedStatus = status;
      this.toggleModal();
      this.$emit("updateTask", { cmpType: "status", data: status });
    },
    toggleModal() {
      this.showDropdown = !this.showDropdown;
    },
    closeModal() {
      this.showDropdown = false;
    },
    updateOptions(updatedOptions) {
      this.$emit("updateOptions", updatedOptions);
    },
  },
  computed: {
    labels() {
      return this.$store.getters.currBoard.labels;
    },
    status() {
      return this.selectedStatus;
    },
    color() {
      const labels = this.labels;
      let currColor = "";
      if (!labels) return;
      labels.status.forEach((label) => {
        if (label.name === this.task.status) currColor = label.color;
      });
      return currColor;
    },
  },
  components: {
    TaskDropdown,
  },
};
</script>
