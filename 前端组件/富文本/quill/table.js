// const TableModule = Quill.import('modules/table');

// class Table extends TableModule {
//   constructor(quill, options) {
//     super(quill, options);
//     this.quill = quill;
//     this.options = options;
//     this.addTableButton();
//   }

//   addTableButton() {
//     const toolbar = this.quill.getModule('toolbar');
//     toolbar.addHandler('insertTable', this.insertTable.bind(this));
//   }

//   insertTable() {
//     const range = this.quill.getSelection();
//     if (!range) return;

//     const rowCount = 3; // 设定默认的表格行数
//     const colCount = 3; // 设定默认的表格列数
//     const table = this.createTable(rowCount, colCount);

//     this.quill.clipboard.dangerouslyPasteHTML(range.index, table);
//   }

//   createTable(rows, cols) {
//     let table = '<table class="quill-table" style="width: 100%; border-collapse: collapse;">';

//     // 添加表格的行和列
//     for (let i = 0; i < rows; i++) {
//       table += '<tr>';
//       for (let j = 0; j < cols; j++) {
//         table += '<td contenteditable="true" style="border: 1px solid #ccc; padding: 5px;"></td>';
//       }
//       table += '</tr>';
//     }

//     table += '</table>';
//     return table;
//   }
// }

// Quill.register('modules/table', Table)