<template>
  <section class="task-dropdown">
    <div class="arrow-up-div"></div>
    <section v-if="!showEditLabels" class="dropdown-list-active">
      <div
        v-if="!showEditLabels"
        v-for="(option, idx) in localOptions[type]"
        class="option flex align-center justify-center"
        :style="{ 'background-color': option.color }"
        :key="idx"
        @click.stop="changeOption(option.name)"
      >
        {{ option.name }}
        <span
          v-if="option.name === 'Critical'"
          v-icon="'critical'"
          class="critical-icon"
        ></span>
      </div>
    </section>
    <div v-if="!showEditLabels" class="dropdown-line"></div>
    <div
      v-if="!showEditLabels"
      class="edit-labels"
      @click.stop="showEditLabels = true"
    >
      <div class="icon-container flex justify-center align-center">
        <span v-icon="'editLabels'" class="flex collumn justify-center"></span>
        <span>Edit Labels</span>
      </div>
    </div>
    <!-- EDIT -->
    <section v-if="showEditLabels" class="dropdown-list">
      <div
        v-if="showEditLabels"
        v-for="(option, idx) in localOptions[type]"
        class="editable-div"
        :key="idx"
        @click.stop
        @focusout="updateLabelName(idx)"
      >
        <!-- COLOR -->
        <span
          @click="toggleColorPicker(option)"
          v-icon="'editLabelsColor'"
          class="edit-labels-color"
          :style="{ 'background-color': option.color }"
        ></span>
        <span
          class="editable-span"
          contenteditable="true"
          ref="editableLabel"
          :placeholder="option.name ? '' : 'Default Label'"
          >{{ option.name }}</span
        >
        <div
          v-if="option.name"
          class="remove-label flex align-center justify-center"
          v-tippy="{
            content: 'Delete label',
            theme: 'classicRight',
            placement: 'right',
            arrow: true,
          }"
        >
          <span
            v-icon="'x'"
            @click="removeLabel(idx)"
            class="remove-label-btn"
          ></span>
        </div>
      </div>
      <ColorPicker
        v-if="showColorPicker"
        class="edit-color-picker"
        @updateColor="updateLabelColor"
      />

      <!-- ADD -->
      <div
        v-if="showEditLabels"
        class="flex align-center new-label"
        @click.stop="addLabel"
      >
        <span v-icon="'editLabelsPlus'" class="edit-plus"></span>
        <span>New label</span>
      </div>
    </section>
    <div v-if="showEditLabels" class="dropdown-line-edit"></div>
    <div v-if="showEditLabels" class="edit-labels">
      <span @click.stop="apply">Apply</span>
    </div>
  </section>
</template>

<script>
import { svgService } from "../services/svg.service.js";
import { utilService } from "../services/util.service.js";
import ColorPicker from "../cmps/dynamicCmps/ColorPicker.vue";
import {
  eventBus,
  showSuccessMsg,
  showErrorMsg,
} from "../services/event-bus.service";
export default {
  emits: ["updateOptions", "updateOption"],
  props: {
    options: Object,
    type: String,
  },
  data() {
    return {
      showEditLabels: false,
      showColorPicker: false,
      currOption: {},
      localOptions: {},
    };
  },
  created() {
    this.localOptions = JSON.parse(JSON.stringify(this.options));
  },
  methods: {
    changeOption(optionName) {
      this.$emit("updateOption", optionName);
      const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      const msg = `${type} changed`;
      showSuccessMsg(msg);
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    toggleColorPicker(option) {
      this.currOption = { ...option };
      this.showColorPicker = !this.showColorPicker;
    },
    updateLabelColor({ data }) {
      this.showColorPicker = !this.showColorPicker;
      // const updatedOptions = JSON.parse(JSON.stringify(this.options))
      const optionIdx = this.localOptions[this.type].findIndex(
        (opt) => opt.id === this.currOption.id
      );
      if (this.currOption.name) {
        this.currOption.color = data;
        this.localOptions[this.type].splice(optionIdx, 1, this.currOption);
        // this.$emit('updateOptions', { updatedOptions })
        const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
        const msg = `${type} color updated`;
        showSuccessMsg(msg);
      }
    },
    updateLabelName(idx) {
      // const updatedOptions = JSON.parse(JSON.stringify(this.options))
      const option = this.localOptions[this.type][idx];
      if (option.name) {
        option.name = event.target.innerText;
        this.localOptions[this.type].splice(idx, 1, option);
        // this.$emit('updateOptions', { updatedOptions, idx, type: this.type })
        const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
        const msg = `${type} name updated`;
        showSuccessMsg(msg);
      }
    },
    addLabel() {
      // const updatedOptions = JSON.parse(JSON.stringify(this.options))
      const newLabel = {
        id: utilService.makeId(),
        name:
          this.type === "status"
            ? utilService.getRandomStatus()
            : utilService.getRandomPriority(),
        color: utilService.getRandomColor(),
      };
      this.localOptions[this.type].push(newLabel);
      // this.$emit('updateOptions', { updatedOptions, type: this.type })
      const msg = "New label added";
      showSuccessMsg(msg);
    },
    removeLabel(idx) {
      // const updatedOptions = JSON.parse(JSON.stringify(this.options));
      this.localOptions[this.type].splice(idx, 1);
      // this.$emit("updateOptions", { updatedOptions, type: this.type });
      const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      const msg = `${type} removed`;
      showSuccessMsg(msg);
    },
    apply() {
      this.showEditLabels = false
      this.$emit("updateOptions", { updatedOptions: this.localOptions, type: this.type });
    },
  },
  components: {
    ColorPicker,
  },
};
</script>
