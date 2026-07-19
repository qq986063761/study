<template>
  <div class="api-router-store">
    <el-card>
      <div slot="header">
        路由切换
      </div>

      <div class="navs">
        <!-- path 类型路由链接 -->
        <router-link to="/apiRouterStore/child">
          通过 path 跳到子路由1
        </router-link>
        <router-link to="/apiRouterStore/child2/ID">
          通过 path 跳到子路由2
        </router-link>
        <el-link 
          type="primary" 
          @click="onClickLink('apiRouterStoreChild')">
          通过 js 跳到子路由1
        </el-link>
        <el-link 
          type="danger" 
          @click="onClickLink('apiRouterStoreChild2', {id: 'ID'})">
          通过 js 跳到子路由2
        </el-link>
      </div>

      <!-- 路由页面视图组件 -->
      <router-view class="block"></router-view>
    </el-card>

    <el-card>
      <div slot="header">
        状态管理
      </div>
      <p>
        日期：{{ date }}
      </p>
      <p>
        时间：{{ time }}
      </p>
      <p>
        日期+时间：{{ dateTime }}
      </p>
      <div class="block">
        <p>子 store：</p>
        
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  computed: {
    // 引入 state
    ...mapState([
      'date',
      'time'
    ]),
    // 引入 getters
    ...mapGetters([
      'dateTime'
    ])
  },
  methods: {
    // 引入 mutations
    ...mapMutations([
      'setTime'
    ]),
    // 引入 actions
    ...mapActions([
      'getDate'
    ]),
    onClickLink(name, params) {
      this.$router.push({
        name,
        params
      })
    },
    init() {
      this.getDate()
      this.timer = setInterval(() => {
        this.setTime(new Date().toLocaleTimeString())
      }, 1000)
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.init(to, from))
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  }
}
</script>

<style lang="scss">
  .api-router-store {
    .el-card {
      + .el-card {
        margin-top: 20px;
      }
    }

    .navs {
      margin-bottom: 20px;
      a {
        + a {
          margin-left: 20px;
        }
      }
    }
  }
</style>