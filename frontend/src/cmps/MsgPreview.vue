<template>
  <section class="msg-preview">
    <section class="msg-header flex align-center space-between">
      <div class="title flex align-center">
        <img :src="msg.from.imgUrl" alt="" />
        {{ msg.from.accountName }}
      </div>
      <div class="header-info flex align-center">
        <div class="flex align-center">
        <span v-icon="'msgClock'" className="icon"></span>
          <span class="createdAt-preview" >{{ timeSince(msg.createdAt) }}</span>
        </div>

        <span v-icon="'msgDots'" className="icon"></span>
      </div>
    </section>
    <div v-html="msg.txt" class="msg-txt"></div>
    <section class="msg-bottom-btns flex align-center">
      <div class="like btn-container">
        <div
          class="bottom-btn flex align-center justify-center"
          :class="isLiked"
          @click="toggleLike"
        >
          <span v-if="isLikedIcon" v-icon="'msgLiked'" className="icon"></span>
          <span v-else v-icon="'msgLike'" className="icon"></span>
          Like
        </div>
      </div>
      <div class="btn-container flex justify-center">
        <div class="bottom-btn flex align-center">
          <span v-icon="'msgReply'" className="icon"></span>
          Reply
        </div>
      </div>
      <div v-if="msg.liked.length > 0" class="liked-users">
        <div class="user flex align-center">
          <img :src="msg.from.imgUrl" alt="" />
          Liked
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { icon } from '../directives.js'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export default {
  name: 'MsgPreview',
  props: {
    msg: Object,
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    toggleLike() {
      if (this.msg.liked.includes(this.msg.from)) {
        const likedIdx = this.msg.liked.findIndex(
          (from) => from === this.msg.from
        )
        this.msg.liked.splice(likedIdx, 1)
      } else this.msg.liked.push(this.msg.from)
    },
    timeSince(date) {
      const timeAgoInstance = timeAgo.format(new Date(date), 'mini')
      return timeAgoInstance
    },
  },
  computed: {
    isLiked() {
      return {
        liked: this.msg.liked.includes(this.msg.from),
      }
    },
    isLikedIcon() {
      return this.msg.liked.includes(this.msg.from)
    },
  },
}
</script>
