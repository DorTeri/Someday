<template>
  <section class="kanban-col" :style="{ 'background-color': color }">
    <div class="col-header flex space-between align-center">
      <div
        v-tippy="{
          content: status,
          theme: 'classic',
          placement: 'top',
          arrow: true,
        }"
      >
        {{ status === '' ? status = 'Blank' : status}} / {{ tasksCount }}
      </div>
      <span class="add-task-plus" @click="addTask" v-icon="'plusKanban'"></span>
    </div>
    <section class="col-content flex column">
      <!-- <section class="cards-container"> -->
      <Container
        class="smooth-dnd-container col-container-drag"
        orientation="vertical"
        group-name="tasks"
        tag="div"
        :drag-class="'task-kanban-drag'"
        :shouldAcceptDrop="(e, payload) => e.groupName === 'tasks'"
        :get-child-payload="getColPayload()"
        @drop="onTaskDrop($event)"
      >
        <Draggable v-for="(task, idx) in tasks" :key="idx" class="col-drag">
          <KanbanCard :task="task" @updateMap="updateOrder"/>
        </Draggable>
      </Container>
    </section>
  </section>
  <!-- </section> -->
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
import { boardService } from "../services/board.service.local";
import KanbanCard from "./KanbanCard.vue";
import {
  showSuccessMsg,
  showErrorMsg,
} from "../services/event-bus.service";
export default {
  emits: ["addStatusesMap", "removeStatusesMap", 'updateMapOrder'],
  props: {
    status: String,
    tasks: Array,
    color: String,
    option: String
  },
  data() {
    return {
      board: this.$store.getters.currBoard,
    };
  },
  created() {
  },
  methods: {
    getColPayload(id) {
      return (index) => {
        return this.tasks[index];
      };
    },
    async onTaskDrop(dropResult) {
      if (dropResult.removedIndex === null && dropResult.addedIndex === null)
        return;
      const task = JSON.parse(JSON.stringify(dropResult.payload));
      const taskIdx = this.tasks.findIndex((t) => t.id === task.id);
      const board = JSON.parse(JSON.stringify(this.currBoard));
      if (dropResult.addedIndex !== null && dropResult.removedIndex === null) {
        const group = board.groups.find((group) => {
          return group.tasks.filter((t) => t.id === task.id)[0];
        });
        task[this.option] = this.status;
        const toUpdate = { group, task };
        await this.$store.dispatch({ type: "saveTask", toUpdate });
        this.$emit("addStatusesMap", { task, status: this.status });
      } else if (
        dropResult.addedIndex === null &&
        dropResult.removedIndex !== null
      ) {
        this.$emit("removeStatusesMap", { taskIdx, status: this.status });
      } else {
        this.$emit("updateMapOrder", { status: this.status, dropResult });
      }
    },
    addTask() {
      const task = boardService.getEmptyTask();
      task[this.option] = this.status;
      task.taskTitle = 'New Task'
      const group = this.currBoard.groups[0];
      this.tasks.unshift(task)
      const toUpdate = { group, task };
      this.$store.dispatch({ type: "saveTask", toUpdate })
      const msg = 'New task added';
        showSuccessMsg(msg);
    },
    updateOrder() {
      this.$emit('updateMap')
    }
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    tasksCount() {
      return this.tasks.length;
    },
  },
  watch: {
    tasks: {
      handler() {
        console.log('tasks', this.tasks)
      },
      deep: true
    }
  },
  components: {
    KanbanCard,
    Container,
    Draggable,
  },
};
</script>
