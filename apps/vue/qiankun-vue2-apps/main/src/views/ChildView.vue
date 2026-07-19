<template>
  <div
    class="child-view"
    v-loading="loading"
  >
    <div
      v-show="currentApp === 'child1'"
      id="subapp-child1"
      class="child-view-slot"
    />
    <div
      v-show="currentApp === 'child2'"
      id="subapp-child2"
      class="child-view-slot"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ensureAppsRegistered } from '@/micro-apps'

export default {
  name: 'ChildView',
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['theme']),
    currentApp() {
      return this.$route.meta?.app || (this.$route.path.startsWith('/child1') ? 'child1' : 'child2')
    }
  },
  mounted() {
    ensureAppsRegistered()
    this.$nextTick(() => {
      setTimeout(() => {
        this.loading = false
      }, 300)
    })
  }
}
</script>

<style lang="scss" scoped>
.child-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.child-view-slot {
  width: 100%;
  height: 100%;

  ::v-deep > div {
    width: 100%;
    height: 100%;
  }
}
</style>
