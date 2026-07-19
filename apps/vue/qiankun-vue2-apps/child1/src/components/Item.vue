<template>
  <div class="child1-item">
    <div class="item-header">
      <h4>{{ demo.name }}</h4>
      <el-tag size="mini" type="success">v{{ demo.version }}</el-tag>
    </div>
    <p class="item-desc">{{ demo.description }}</p>
    <div class="item-tags">
      <el-tag
        v-for="(tag, index) in demo.tags"
        :key="index"
        size="mini"
        class="tag-item"
      >{{ tag }}</el-tag>
    </div>
    <el-divider></el-divider>
    <div class="item-config">
      <span class="config-label">Config:</span>
      <el-table :data="[demo.config]" size="mini" border>
        <el-table-column prop="theme" label="Theme" width="100"></el-table-column>
        <el-table-column prop="locale" label="Locale" width="100"></el-table-column>
        <el-table-column prop="debug" label="Debug">
          <template slot-scope="scope">
            <el-tag :type="scope.row.debug ? 'success' : 'info'" size="mini">
              {{ scope.row.debug ? 'ON' : 'OFF' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Child1Item',
  computed: {
    ...mapState(['demo'])
  },
  mounted() {
    console.log('[Child1Item] mounted, demo data:', this.demo)
  }
}
</script>

<style scoped>
.child1-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.item-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.item-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.6;
}

.item-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  margin-bottom: 4px;
}

.config-label {
  display: inline-block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}
</style>
