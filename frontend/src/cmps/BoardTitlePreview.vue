<template>
           <span v-html="getSvg('board')" class="workspace-icon"></span>
          <div v-show="!editable">{{ board.title }}</div>
          <input class="board-title-input" ref="boardInput" @focusout="updateBoard" type="text" v-show="editable" v-model="boardTitle"/>
          <span class="owner-icon flex align-center justify-center" v-if="isOwner" v-icon="'owner'"></span>
          <span 
            v-html="getSvg('Dots')"
            class="workspace-icon dots"
            @click.stop="ToggleEditMenu"
          ></span>
          <EditMenu v-if="isEditMenuOpen" @removeBoard="removeBoard"
          v-clickOutside="closeModal" @rename="renameBoard"/>
</template>

<script>
import { svgService } from '../services/svg.service.js'
import  EditMenu  from '../cmps/EditMenu.vue'
import { userService } from '../services/user.service.js'

export default {
    emits:['removeBoard'],
  name: 'BoardTitlePreview', 
  props: {
    board:Object
  },
components:{
    EditMenu,
},
created() {
  this.boardTitle = JSON.parse(JSON.stringify(this.board)).title
},
  data() {
    return {
      isEditMenuOpen: false,
      isEditable: false,
      boardTitle: null,
    }
  },
  methods: {
    removeBoard() {
        this.$emit('removeBoard',this.board._id)
    },
    renameBoard() {
      this.isEditable = true
      setTimeout(() => {
        this.$refs.boardInput.focus()
      }, 0);
      this.isEditMenuOpen = false
    },
    updateBoard() {
      this.isEditable = false
      const board = JSON.parse(JSON.stringify(this.board))
      board.title = this.boardTitle
      this.$store.dispatch({type: 'updateBoard' , board})
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    ToggleEditMenu() {
      this.isEditMenuOpen = !this.isEditMenuOpen
    },
    closeModal() {
      this.isEditMenuOpen = false
    }
  },
  computed: {
    editable() {
      return this.isEditable
    },
    isOwner() {
      const user = userService.getLoggedInUser()
      if(!user) return
      if(user._id === this.board.owner) return true
      return false
    }
  }
}
</script>
