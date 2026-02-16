import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { ExportHeader } from '../types/common';

export const exportToExcel = async (
  headers: ExportHeader[],
  rows: Record<string, unknown>[],
  fileName = 'data',
  sheetName = 'Sheet1',
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = headers;

  for (const row of rows) {
    worksheet.addRow(row);
  }

  worksheet.eachRow({ includeEmpty: true }, (sheetRow) => {
    sheetRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        vertical: 'top',
        horizontal: 'left',
        wrapText: true,
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};
