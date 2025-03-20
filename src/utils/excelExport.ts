
import * as XLSX from 'xlsx';
import { TestCaseProps } from '@/components/TestCase';

export interface ExcelColumn {
  key: string;
  header: string;
  getValue: (testCase: TestCaseProps) => string;
}

export const defaultExcelColumns: ExcelColumn[] = [
  {
    key: 'id',
    header: '用例编号',
    getValue: (testCase) => testCase.id || '',
  },
  {
    key: 'title',
    header: '功能点',
    getValue: (testCase) => testCase.title || '',
  },
  {
    key: 'scenario',
    header: '功能模块',
    getValue: (testCase) => testCase.scenario || '',
  },
  {
    key: 'preconditions',
    header: '前提条件',
    getValue: (testCase) => testCase.preconditions?.join('\n') || '',
  },
  {
    key: 'steps',
    header: '测试步骤',
    getValue: (testCase) => testCase.steps?.join('\n') || '',
  },
  {
    key: 'expectedResults',
    header: '预期结果',
    getValue: (testCase) => testCase.expectedResults?.join('\n') || '',
  },
  {
    key: 'actualResults',
    header: '实际结果',
    getValue: () => '', // Empty by default
  },
  {
    key: 'priority',
    header: '优先级',
    getValue: (testCase) => testCase.priority || '',
  },
];

export const exportTestCasesToExcel = (
  testCases: TestCaseProps[],
  fileName: string = 'test-cases.xlsx',
  columns: ExcelColumn[] = defaultExcelColumns
) => {
  // Create worksheet data
  const worksheetData = [
    // Headers
    columns.map(col => col.header),
    // Data rows
    ...testCases.map(testCase => 
      columns.map(col => col.getValue(testCase))
    )
  ];

  // Create a new workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-size columns
  const colWidths = columns.map(col => {
    const header = col.header.length;
    const maxDataLength = Math.max(
      ...testCases.map(tc => col.getValue(tc).length)
    );
    return Math.max(header, maxDataLength, 10); // Min width of 10
  });

  ws['!cols'] = colWidths.map(width => ({ width }));

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Test Cases');

  // Generate and download the Excel file
  XLSX.writeFile(wb, fileName);
};
