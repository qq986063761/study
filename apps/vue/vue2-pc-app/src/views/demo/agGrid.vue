<template>
  <div class="ag-grid-demo">
    <h2>AG Grid Demo - Vue 2</h2>
    <p class="demo-desc">
      包含：Cell 自定义渲染、Header 自定义组件、大数据量（{{ allRowData.length }} 行）、固定列、排序、筛选、树形展开收起（社区版兼容）
    </p>
    <div class="grid-toolbar">
      <el-button type="primary" size="small" @click="loadMoreData">加载更多数据 (+5000)</el-button>
      <el-button type="success" size="small" @click="clearAllFilters">清除所有筛选</el-button>
      <el-button size="small" @click="expandAll">全部展开</el-button>
      <el-button size="small" @click="collapseAll">全部收起</el-button>
      <span class="stats">全量数据：<strong>{{ allRowData.length }}</strong> 行 | 显示：<strong>{{ rowData.length }}</strong> 行</span>
    </div>
    <ag-grid-vue
      style="width: 100%; height: 600px"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :context="gridContext"
      :getRowHeight="getRowHeight"
      :getRowStyle="getRowStyle"
      :suppressColumnVirtualisation="false"
      :suppressRowTransform="true"
      :rowBuffer="rowBuffer"
      @grid-ready="onGridReady"
      @sort-changed="onSortChanged"
      @filter-changed="onFilterChanged"
      @cell-clicked="onCellClicked"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// ===== Cell Renderer：状态标签 =====
var StatusCellRenderer = {
  render: function(h) {
    if (this.params.data && this.params.data.isGroup) {
      return h('span', { class: 'cell-group-text' }, this.params.data.childrenCount + '名员工');
    }
    return h('span', { class: this.cellClass, style: this.cellStyle }, this.displayValue);
  },
  data: function() {
    return {
      cellClass: '',
      cellStyle: {},
      displayValue: ''
    };
  },
  created() {
    this.updateDisplay(this.params);
  },
  methods: {
    updateDisplay: function(params) {
      var value = params.value;
      this.displayValue = value;
      switch (value) {
        case '在职':
          this.cellClass = 'cell-status cell-status-active';
          break;
        case '离职':
          this.cellClass = 'cell-status cell-status-left';
          break;
        case '休假':
          this.cellClass = 'cell-status cell-status-leave';
          break;
        default:
          this.cellClass = 'cell-status';
      }
    },
    refresh: function(params) {
      this.updateDisplay(params);
      return true;
    }
  }
};

// ===== Cell Renderer：绩效进度条 =====
var PerformanceCellRenderer = {
  render: function(h) {
    if (this.params.data && this.params.data.isGroup) {
      return h('span', { class: 'cell-group-text' }, '均分 ' + this.params.value);
    }
    return h('div', { class: 'perf-cell' }, [
      h('div', { class: 'perf-bar' }, [
        h('div', { class: 'perf-fill', style: { width: this.percentage + '%', backgroundColor: this.barColor } })
      ]),
      h('span', { class: 'perf-text' }, this.params.value + '分-自定义')
    ]);
  },
  computed: {
    percentage: function() {
      return Math.min(this.params.value, 100);
    },
    barColor: function() {
      var score = this.params.value;
      if (score >= 85) return '#67c23a';
      if (score >= 70) return '#409eff';
      if (score >= 60) return '#e6a23c';
      return '#f56c6c';
    }
  },
  methods: {
    refresh: function(params) {
      this.params = params;
      return true;
    }
  }
};

// ===== Cell Renderer：部门列横向合并汇总 =====
var DepartmentSummaryCellRenderer = {
  render: function(h) {
    var data = this.params.data;
    if (data && data.isGroup) {
      return h('div', { class: 'dept-summary-cell' }, [
        h('span', { class: 'dept-summary-name' }, data.department),
        h('span', { class: 'dept-summary-meta' }, data.childrenCount + ' 人 / 父行 colSpan 合并')
      ]);
    }
    return h('span', {}, this.params.value);
  },
  methods: {
    refresh: function(params) {
      this.params = params;
      return true;
    }
  }
};

// ===== Cell Renderer：员工子行纵向合并示例 =====
var MergeBlockCellRenderer = {
  render: function(h) {
    var data = this.params.data;
    if (!data || data.isGroup) {
      return h('span', { class: 'cell-group-text' }, '');
    }

    var componentParent = this.params.context && this.params.context.componentParent;
    var isFirstVisible = componentParent
      ? componentParent.isFirstVisibleMergeRow(this.params)
      : data.mergeGroupStart;

    if (!isFirstVisible) {
      return h('span', { class: 'merge-block-empty' }, '');
    }

    var span = componentParent ? componentParent.getMergeGroupRowSpan(this.params) : 1;
    return h('div', { class: 'merge-block-cell' }, [
      h('span', { class: 'merge-block-title' }, data.mergeGroup),
      h('span', { class: 'merge-block-count' }, span + ' 行')
    ]);
  },
  methods: {
    refresh: function(params) {
      this.params = params;
      return true;
    }
  }
};

// ===== Header 组件：自定义表头带图标 + 排序/拖拽入口 =====
var CustomHeaderComponent = {
  render: function(h) {
    var sortIconClass = this.sortIconClass;
    var sortBtnClass = {
      'custom-header-action': true,
      'custom-header-sort-btn--active': this.sortActive
    };
    return h('div', {
      class: 'custom-header',
      on: {
        mousedown: this.onHeaderPointerStart,
        touchstart: this.onHeaderPointerStart
      }
    }, [
      h('span', { class: 'custom-header-title' }, [
        h('i', { class: this.iconClass }),
        h('span', {}, this.displayName + '-自定义')
      ]),
      this.sortable ? h('button', {
        class: sortBtnClass,
        attrs: {
          type: 'button',
          title: '点击排序',
          'aria-label': this.displayName + '排序'
        },
        on: { click: this.onSortClick }
      }, [
        h('i', { class: sortIconClass })
      ]) : null,
      this.draggable ? h('span', {
        class: 'custom-header-action custom-header-drag-btn',
        attrs: {
          role: 'button',
          tabindex: '0',
          title: '拖拽移动列',
          'aria-label': this.displayName + '拖拽移动列'
        },
        on: { click: this.onDragClick }
      }, [
        h('i', { class: 'el-icon-rank' })
      ]) : null
    ]);
  },
  computed: {
    displayName: function() {
      return this.params.displayName;
    },
    iconClass: function() {
      var field = this.params.column.getColId ? this.params.column.getColId() : this.params.column.colId;
      var map = {
        id: 'el-icon-tickets',
        name: 'el-icon-user',
        department: 'el-icon-office-building',
        position: 'el-icon-s-custom',
        mergeGroup: 'el-icon-connection',
        salary: 'el-icon-money',
        status: 'el-icon-circle-check',
        performance: 'el-icon-data-line',
        joinDate: 'el-icon-date',
        email: 'el-icon-message',
        actions: 'el-icon-setting'
      };
      return map[field] || 'el-icon-info';
    },
    sortable: function() {
      return !!this.params.enableSorting;
    },
    draggable: function() {
      var colDef = this.params.column.getColDef ? this.params.column.getColDef() : {};
      var api = this.params.api;
      var suppressMovableColumns = api && api.getGridOption
        ? api.getGridOption('suppressMovableColumns')
        : false;
      var colCanMove = !suppressMovableColumns && !colDef.suppressMovable && !colDef.lockPosition;
      return !!colCanMove || !!colDef.enableRowGroup || !!colDef.enablePivot;
    },
    sortActive: function() {
      return this.params.column.isSortAscending() || this.params.column.isSortDescending();
    },
    sortIconClass: function() {
      if (this.params.column.isSortAscending()) return 'el-icon-top';
      if (this.params.column.isSortDescending()) return 'el-icon-bottom';
      return 'el-icon-sort';
    }
  },
  methods: {
    init: function(params) {
      this.params = params;
      this.bindSortChangedListener();
    },
    refresh: function(params) {
      if (this.params && this.params.column !== params.column && this.sortChangedListener) {
        this.params.column.removeEventListener('sortChanged', this.sortChangedListener);
        this.sortChangedListener = null;
      }
      this.params = params;
      this.bindSortChangedListener();
      this.$forceUpdate();
      return true;
    },
    bindSortChangedListener: function() {
      if (this.sortChangedListener || !this.params || !this.params.column) return;
      var self = this;
      this.sortChangedListener = function() {
        self.$forceUpdate();
      };
      this.params.column.addEventListener('sortChanged', this.sortChangedListener);
    },
    onHeaderPointerStart: function(event) {
      var target = event.target;
      if (target && target.closest && target.closest('.custom-header-drag-btn')) {
        return;
      }
      event.stopPropagation();
    },
    onSortClick: function(event) {
      event.preventDefault();
      event.stopPropagation();
      var api = this.params.api;
      var multiSortKey = api && api.getGridOption ? api.getGridOption('multiSortKey') : null;
      var multiSort = multiSortKey === 'ctrl'
        ? event.ctrlKey || event.metaKey
        : event.shiftKey;
      this.params.progressSort(multiSort);
    },
    onDragClick: function(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  beforeDestroy: function() {
    if (this.params && this.sortChangedListener) {
      this.params.column.removeEventListener('sortChanged', this.sortChangedListener);
    }
  }
};

// ===== Cell Renderer：树形展开/收起（显示在「ID」列） =====
var TreeIdCellRenderer = {
  render: function(h) {
    var data = this.params.data;
    if (!data) return null;

    // 父节点：渲染展开/收起箭头 + 父行 ID
    if (data.isGroup) {
      var isExpanded = this.isExpanded;
      var arrowClass = isExpanded ? 'tree-arrow tree-arrow--expanded' : 'tree-arrow tree-arrow--collapsed';
      return h('div', { class: 'tree-id-group-cell' }, [
        h('span', {
          class: arrowClass,
          on: { click: this.onToggle }
        }, [
          h('i', { class: isExpanded ? 'el-icon-caret-bottom' : 'el-icon-caret-right' })
        ]),
        h('span', { class: 'tree-id-text' }, data.id)
      ]);
    }

    // 子节点：保持 ID 列层级缩进
    return h('div', { class: 'tree-id-child-cell' }, [
      h('span', { class: 'tree-id-text' }, data.id)
    ]);
  },
  data: function() {
    return {
      isExpanded: false
    };
  },
  created() {
    this.updateExpanded(this.params);
  },
  methods: {
    updateExpanded: function(params) {
      params = params || this.params || {};
      this.params = params;
      if (params.data && params.data.isGroup) {
        var componentParent = params.context && params.context.componentParent;
        this.isExpanded = componentParent ? componentParent.isGroupExpanded(params.data.groupId) : false;
      }
    },
    onToggle: function(event) {
      event.stopPropagation();
      var groupId = this.params.data.groupId;
      var componentParent = this.params.context && this.params.context.componentParent;
      if (componentParent) {
        componentParent.toggleGroup(groupId);
      }
    },
    refresh: function(params) {
      this.updateExpanded(params);
      return true;
    }
  }
};

// ===== Cell Renderer：操作按钮 =====
var ActionCellRenderer = {
  render: function(h) {
    if (this.params.data && this.params.data.isGroup) {
      return h('span', { class: 'cell-group-text' }, '');
    }
    return h('div', { class: 'action-cell' }, [
      h('button', { class: { 'action-btn': true, 'action-view': true }, on: { click: this.onView } }, '查看'),
      h('button', { class: { 'action-btn': true, 'action-edit': true }, on: { click: this.onEdit } }, '编辑')
    ]);
  },
  methods: {
    onView: function() {
      var data = this.params.data;
      console.log('查看详情：', data.name, '(ID: ' + data.id + ')');
      alert('查看：' + data.name + ' (ID: ' + data.id + ')');
    },
    onEdit: function() {
      var data = this.params.data;
      console.log('编辑：', data.name, '(ID: ' + data.id + ')');
      alert('编辑：' + data.name + ' (ID: ' + data.id + ')');
    },
    refresh: function(params) {
      this.params = params;
      return true;
    }
  }
};

// ===== 生成模拟数据（支持树形结构） =====
function createRowData(count, startIndex, includeParents) {
  var departments = ['技术研发部', '产品设计部', '市场运营部', '人力资源部', '财务部', '销售部'];
  var positions = ['高级工程师', '产品经理', '运营总监', 'HR主管', '财务分析师', '销售经理', '前端开发', '后端开发', '测试工程师', 'UI设计师'];
  var statuses = ['在职', '离职', '休假'];
  var names = [
    '张伟', '李娜', '王强', '赵敏', '陈静', '杨帆', '刘洋', '周杰', '吴鑫', '孙丽',
    '钱多多', '马超', '黄蕾', '郭靖', '林黛', '何冲', '罗琳', '梁宇', '宋阳', '唐明',
    '郑爽很多字很多字很多字很多字很多字', '谢安', '韩冰', '冯伟', '董洁', '杜康', '贾玲', '江涛', '潘龙', '余欢'
  ];

  var data = [];
  var perDept = Math.floor(count / departments.length);
  var empId = startIndex;

  // 按部门生成数据：先部门父节点，再员工子节点
  for (var d = 0; d < departments.length; d++) {
    var deptName = departments[d];
    var totalSalary = 0;
    var totalPerf = 0;
    var employees = [];
    var groupId = 'dept-' + (d + 1 + Math.floor(startIndex / count) * departments.length);

    // 生成该部门的员工数据
    for (var e = 0; e < perDept; e++) {
      empId++;
      var nameIdx = (empId - 1) % names.length;
      var name = names[nameIdx] + (empId > 30 ? empId : '');
      var pos = positions[empId % positions.length];
      var status = statuses[empId % 3];
      var salary = Math.round((8000 + Math.random() * 30000) * 100) / 100;
      var perf = Math.round(Math.random() * 40 + 60);
      var joinYear = 2015 + (empId % 10);
      var joinMonth = String((empId % 12) + 1).padStart(2, '0');
      var joinDay = String((empId % 28) + 1).padStart(2, '0');
      var mergeBlockIndex = Math.floor(e / 4) + 1;

      totalSalary += salary;
      totalPerf += perf;

      employees.push({
        id: empId,
        name: name,
        department: deptName,
        position: pos,
        salary: salary,
        status: status,
        performance: perf,
        joinDate: joinYear + '-' + joinMonth + '-' + joinDay,
        email: 'employee' + empId + '@company.com',
        mergeGroup: '批次 ' + mergeBlockIndex,
        mergeGroupId: groupId + '-batch-' + mergeBlockIndex,
        mergeGroupStart: e % 4 === 0,
        mergeGroupSize: Math.min(4, perDept - e),
        isGroup: false,
        groupId: groupId,
        parentGroupId: groupId
      });
    }

    var childCount = employees.length;

    // 生成部门父节点（显示汇总数据）
    if (includeParents !== false) {
      data.push({
        id: 'dept-' + (d + 1),
        name: deptName,
        department: deptName,
        position: childCount + '人',
        salary: Math.round(totalSalary / childCount * 100) / 100,
        status: '',
        performance: Math.round(totalPerf / childCount),
        joinDate: '',
        email: '',
        mergeGroup: '',
        mergeGroupId: '',
        mergeGroupStart: false,
        mergeGroupSize: 1,
        isGroup: true,
        groupId: groupId,
        childrenCount: childCount
      });
    }

    // 添加该部门的员工子节点
    for (var e2 = 0; e2 < employees.length; e2++) {
      data.push(employees[e2]);
    }
  }

  return data;
}

export default {
  name: 'AgGridDemo',
  components: {
    AgGridVue,
    StatusCellRenderer,
    PerformanceCellRenderer,
    DepartmentSummaryCellRenderer,
    MergeBlockCellRenderer,
    CustomHeaderComponent,
    TreeIdCellRenderer,
    ActionCellRenderer
  },
  data: function() {
    var initialAllData = createRowData(10000, 0);

    return {
      // 全量原始数据（包含父节点和子节点）
      allRowData: initialAllData,
      // 当前展开的组 ID 集合
      expandedGroups: {},
      gridContext: {
        componentParent: this
      },
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
          width: 110,
          pinned: 'left',
          filter: 'agNumberColumnFilter',
          sortable: true,
          lockPinned: true,
          cellClassRules: {
            'tree-child-id-cell': function(params) {
              return params.data && !params.data.isGroup;
            }
          },
          cellRenderer: 'TreeIdCellRenderer'
        },
        {
          headerName: '姓名',
          field: 'name',
          width: 260,
          pinned: 'left',
          filter: 'agTextColumnFilter',
          sortable: true,
          lockPinned: true,
          cellClassRules: {
            'tree-child-name-cell': function(params) {
              return params.data && !params.data.isGroup;
            }
          }
        },
        {
          headerName: '部门',
          field: 'department',
          width: 150,
          filter: 'agTextColumnFilter',
          sortable: true,
          colSpan: function(params) {
            return params.data && params.data.isGroup ? 3 : 1;
          },
          cellClassRules: {
            'cell-colspan-summary': function(params) {
              return params.data && params.data.isGroup;
            }
          },
          cellRenderer: 'DepartmentSummaryCellRenderer'
        },
        {
          headerName: '职位',
          field: 'position',
          width: 140,
          filter: 'agTextColumnFilter',
          sortable: true
        },
        {
          headerName: '合并行',
          field: 'mergeGroup',
          width: 120,
          filter: 'agTextColumnFilter',
          sortable: true,
          rowSpan: this.getMergeGroupRowSpan,
          cellClassRules: {
            'cell-rowspan-merge': function(params) {
              return params.data && !params.data.isGroup;
            },
            'cell-rowspan-hidden': function(params) {
              var componentParent = params.context && params.context.componentParent;
              return params.data && !params.data.isGroup && componentParent && !componentParent.isFirstVisibleMergeRow(params);
            }
          },
          cellRenderer: 'MergeBlockCellRenderer'
        },
        {
          headerName: '月薪（元）',
          field: 'salary',
          width: 150,
          filter: 'agNumberColumnFilter',
          sortable: true,
          valueFormatter: function(params) {
            if (params.data && params.data.isGroup) {
              return '均 ¥' + params.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return '¥' + params.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        },
        {
          headerName: '状态',
          field: 'status',
          width: 110,
          filter: 'agTextColumnFilter',
          sortable: true,
          cellRenderer: 'StatusCellRenderer'
        },
        {
          headerName: '绩效评分',
          field: 'performance',
          width: 200,
          filter: 'agNumberColumnFilter',
          sortable: true,
          cellRenderer: 'PerformanceCellRenderer'
        },
        {
          headerName: '入职日期',
          field: 'joinDate',
          width: 140,
          filter: 'agDateColumnFilter',
          sortable: true,
          filterParams: {
            comparator: function(filterLocalDateAtMidnight, cellValue) {
              if (!cellValue) return 0;
              var dateParts = cellValue.split('-');
              var year = Number(dateParts[0]);
              var month = Number(dateParts[1]) - 1;
              var day = Number(dateParts[2]);
              var cellDate = new Date(year, month, day);
              if (cellDate < filterLocalDateAtMidnight) return -1;
              if (cellDate > filterLocalDateAtMidnight) return 1;
              return 0;
            }
          }
        },
        {
          headerName: '邮箱',
          field: 'email',
          width: 250,
          filter: 'agTextColumnFilter',
          sortable: true
        },
        {
          headerName: '操作',
          colId: 'actions',
          field: 'id',
          width: 160,
          pinned: 'right',
          lockPinned: true,
          filter: false,
          sortable: false,
          cellRenderer: 'ActionCellRenderer'
        }
      ],
      defaultColDef: {
        minWidth: 80,
        resizable: true,
        enableCellChangeFlash: true,
        headerComponent: 'CustomHeaderComponent',
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        },
        sortable: false
      },
      // 实际传给 grid 的行数据（根据展开状态过滤后）
      rowData: [],
      pinnedBottomRowData: [],
      gridApi: null,
      gridColumnApi: null,
      rowBuffer: 50
    };
  },
  computed: {
    // 根据展开状态计算实际显示的行数据
    computedRowData: function() {
      var self = this;
      return this.allRowData.filter(function(row) {
        // 父节点始终显示
        if (row.isGroup) return true;
        // 子节点：其父组展开才显示
        return self.expandedGroups[row.parentGroupId] === true;
      });
    }
  },
  watch: {
    computedRowData: {
      handler: function(newVal) {
        this.rowData = newVal;
      },
      immediate: true
    }
  },
  created: function() {
    // 初始默认全展开
    this.expandAllSilent();
    this.rowData = this.computedRowData;
  },
  methods: {
    onGridReady: function(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      console.log('AG Grid 初始化完成，全量 ' + this.allRowData.length + ' 行数据');
    },
    // 判断某个组是否展开
    isGroupExpanded: function(groupId) {
      return this.expandedGroups[groupId] === true;
    },
    // 切换某组的展开/收起
    toggleGroup: function(groupId) {
      if (this.expandedGroups[groupId]) {
        this.$set(this.expandedGroups, groupId, false);
      } else {
        this.$set(this.expandedGroups, groupId, true);
      }
      // 强制刷新 rowData（computedRowData 的 watch 会触发更新）
      this.rowData = this.computedRowData.slice();
      // 刷新所有 TreeIdCellRenderer
      if (this.gridApi) {
        this.gridApi.refreshCells({ force: true });
      }
    },
    // 树节点行高
    getRowHeight: function(params) {
      if (params.data && params.data.isGroup) {
        return 42;
      }
      return null; // null 表示自动
    },
    getDisplayedDataAt: function(rowIndex) {
      if (rowIndex == null || rowIndex < 0) return null;
      if (this.gridApi) {
        var rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
        return rowNode && rowNode.data;
      }
      return this.rowData[rowIndex];
    },
    isSameMergeGroup: function(a, b) {
      return !!(a && b && !a.isGroup && !b.isGroup && a.mergeGroupId && a.mergeGroupId === b.mergeGroupId);
    },
    isFirstVisibleMergeRow: function(params) {
      var data = params.data;
      if (!data || data.isGroup) return false;

      var rowIndex = params.node && params.node.rowIndex;
      var previousData = this.getDisplayedDataAt(rowIndex - 1);
      return !this.isSameMergeGroup(previousData, data);
    },
    getMergeGroupRowSpan: function(params) {
      var data = params.data;
      if (!data || data.isGroup || !this.isFirstVisibleMergeRow(params)) {
        return 1;
      }

      var span = 1;
      var rowIndex = params.node && params.node.rowIndex;
      var nextData = this.getDisplayedDataAt(rowIndex + span);
      while (this.isSameMergeGroup(data, nextData)) {
        span++;
        nextData = this.getDisplayedDataAt(rowIndex + span);
      }
      return span;
    },
    expandAllSilent: function() {
      var self = this;
      this.allRowData.forEach(function(row) {
        if (row.isGroup) {
          self.$set(self.expandedGroups, row.groupId, true);
        }
      });
    },
    // 行内样式
    getRowStyle: function(params) {
      if (params.node.rowPinned) return null;
      if (params.data && params.data.isGroup) {
        return {
          backgroundColor: '#f5f7fa',
          fontWeight: '600',
          color: '#303133'
        };
      }
      var status = params.data.status;
      if (status === '离职') {
        return { backgroundColor: '#fef0f0' };
      }
      if (status === '休假') {
        return { backgroundColor: '#fdf6ec' };
      }
      return null;
    },
    loadMoreData: function() {
      var currentCount = this.allRowData.length;
      var newRows = createRowData(5000, currentCount, true);
      this.allRowData = this.allRowData.concat(newRows);
      // 新数据默认展开
      var self = this;
      newRows.forEach(function(row) {
        if (row.isGroup) {
          self.$set(self.expandedGroups, row.groupId, true);
        }
      });
      this.$message.success('已追加 5000 行，全量总计 ' + this.allRowData.length + ' 行');
    },
    clearAllFilters: function() {
      if (this.gridApi) {
        this.gridApi.setFilterModel(null);
        this.$message.success('已清除所有筛选条件');
      }
    },
    expandAll: function() {
      var self = this;
      this.allRowData.forEach(function(row) {
        if (row.isGroup) {
          self.$set(self.expandedGroups, row.groupId, true);
        }
      });
      this.rowData = this.computedRowData.slice();
      if (this.gridApi) {
        this.$nextTick(function() {
          self.gridApi.refreshCells({ force: true });
        });
      }
    },
    collapseAll: function() {
      var self = this;
      this.allRowData.forEach(function(row) {
        if (row.isGroup) {
          self.$set(self.expandedGroups, row.groupId, false);
        }
      });
      this.rowData = this.computedRowData.slice();
      if (this.gridApi) {
        this.$nextTick(function() {
          self.gridApi.refreshCells({ force: true });
        });
      }
    },
    onSortChanged: function(params) {
      console.log('排序变更', params);
    },
    onFilterChanged: function(params) {
      if (this.gridApi) {
        var displayedCount = this.gridApi.getDisplayedRowCount();
        console.log('筛选变更，当前显示 ' + displayedCount + ' 行');
      }
    },
    onCellClicked: function(params) {
      console.log('单元格点击', params.data);
    }
  },
  beforeDestroy: function() {
    // AG Grid 在组件销毁时自动清理
  }
};
</script>

<style lang="scss" scoped>
.ag-grid-demo {
  padding: 20px;
  background: #fff;
  min-height: 100vh;

  h2 {
    margin-bottom: 8px;
    color: #303133;
  }

  .demo-desc {
    color: #909399;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .grid-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .stats {
      color: #606266;
      font-size: 13px;

      strong {
        color: #409eff;
        font-size: 15px;
      }
    }
  }

  // 树形展开/收起样式
  .tree-id-group-cell {
    display: flex;
    align-items: center;
    gap: 4px;

    .tree-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      cursor: pointer;
      border-radius: 3px;
      transition: background 0.15s, transform 0.2s;
      flex-shrink: 0;

      i {
        font-size: 12px;
        color: #606266;
        transition: transform 0.2s;
      }

      &:hover {
        background: #e8eaed;

        i {
          color: #409eff;
        }
      }
    }

    .tree-id-text {
      font-weight: 600;
      font-size: 13px;
    }
  }

  .tree-id-child-cell {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 26px;

    &::before {
      content: '';
      position: absolute;
      left: 13px;
      top: 50%;
      width: 10px;
      border-top: 1px solid #cfd7e6;
    }

    &::after {
      content: '';
      position: absolute;
      left: 13px;
      top: 0;
      height: 50%;
      border-left: 1px solid #cfd7e6;
    }

    .tree-id-text {
      font-size: 13px;
    }
  }

  .dept-summary-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 100%;
    padding: 0 10px;

    .dept-summary-name {
      color: #303133;
      font-weight: 700;
    }

    .dept-summary-meta {
      color: #409eff;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .merge-block-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    min-height: 100%;
    padding: 6px 10px;
    background: #eef6ff;
    border: 1px solid #b8d8ff;
    border-radius: 4px;

    .merge-block-title {
      color: #1f4e79;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
    }

    .merge-block-count {
      margin-top: 2px;
      color: #5f7f9c;
      font-size: 12px;
      line-height: 1.2;
    }
  }

  // Cell 状态标签样式
  .cell-status {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    color: #606266;
    background: #f0f2f5;

    &.cell-status-active {
      color: #67c23a;
      background: #f0f9eb;
    }

    &.cell-status-left {
      color: #f56c6c;
      background: #fef0f0;
    }

    &.cell-status-leave {
      color: #e6a23c;
      background: #fdf6ec;
    }
  }

  // 绩效进度条样式
  .perf-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .perf-bar {
      width: 80px;
      height: 8px;
      background: #ebeef5;
      border-radius: 4px;
      overflow: hidden;

      .perf-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }

    .perf-text {
      font-size: 12px;
      color: #606266;
      white-space: nowrap;
    }
  }

  // 自定义表头样式
  ::v-deep .custom-header {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    height: 100%;
    min-width: 0;
    cursor: default;

    i {
      font-size: 14px;
      color: #409eff;
    }

    .custom-header-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      overflow: hidden;
      font-weight: 600;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .custom-header-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      flex: 0 0 22px;
      padding: 0;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s, background 0.2s;

      i {
        font-size: 13px;
        color: #909399;
      }

      &:hover,
      &:focus {
        border-color: #409eff;
        background: #ecf5ff;
        outline: none;

        i {
          color: #409eff;
        }
      }
    }

    .custom-header-sort-btn--active {
      border-color: #409eff;
      background: #ecf5ff;

      i {
        color: #409eff;
      }
    }

    .custom-header-drag-btn {
      cursor: move;
    }
  }

  // 树节点组行中的辅助文本
  .cell-group-text {
    color: #909399;
    font-size: 12px;
    font-weight: normal;
  }

  // 覆盖 AG Grid 默认省略号，改为换行显示
  ::v-deep .ag-cell {
    overflow: visible;
    white-space: normal;
    text-overflow: clip;
    line-height: 1.5;
    word-break: break-word;
  }

  ::v-deep .ag-row {
    align-items: center;
  }

  ::v-deep .tree-child-id-cell {
    padding-left: 35px;
  }

  ::v-deep .tree-child-name-cell {
    padding-left: 24px;
  }

  ::v-deep .cell-colspan-summary {
    background: #f4f9ff;
    border-right: 1px solid #b8d8ff;
  }

  ::v-deep .cell-rowspan-merge {
    display: flex;
    align-items: stretch;
    padding: 4px;
    background: #f8fbff;
    z-index: 1;
  }

  ::v-deep .cell-rowspan-hidden {
    border-top-color: transparent;
    border-bottom-color: transparent;
    background: #f8fbff;
  }

  // 操作按钮样式
  .action-cell {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 100%;

    .action-btn {
      padding: 2px 12px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      background: #fff;
      color: #606266;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background: #ecf5ff;
      }

      &.action-view {
        color: #409eff;
        border-color: #b3d8ff;
        background: #ecf5ff;

        &:hover {
          color: #fff;
          background: #409eff;
          border-color: #409eff;
        }
      }

      &.action-edit {
        color: #67c23a;
        border-color: #c2e7b0;
        background: #f0f9eb;

        &:hover {
          color: #fff;
          background: #67c23a;
          border-color: #67c23a;
        }
      }
    }
  }
}
</style>
