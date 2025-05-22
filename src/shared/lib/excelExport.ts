import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { IExportHeaderItem } from '../types';

export const exportDataToExcel = async (
	headers: Array<IExportHeaderItem>,
	exportData: Array<Record<string, unknown>>,
	fileName: string = 'data',
	sheetName: string = 'Sheet1',
) => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet(sheetName);

	worksheet.columns = headers;

	exportData.forEach((item) => {
		const rowData = { ...item };

		headers.forEach((header) => {
			const key = header.key;

			if (header.hyperlink && rowData[key]) {
				rowData[key] = {
					text: rowData[key],
					hyperlink: header.hyperlink.value.replace(
						header.hyperlink.replacement ?? '',
						`${rowData[key]}`,
					),
				};
			}
		});

		worksheet.addRow(rowData);
	});

	worksheet.eachRow({ includeEmpty: true }, (r) => {
		r.eachCell({ includeEmpty: true }, (c, col) => {
			c.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

			if (c.value && c.hyperlink) {
				r.getCell(col).font = { color: { argb: '004e47cc' } };
			}
		});
	});

	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], { type: 'application/octet-stream' });
	saveAs(blob, `${fileName}.xlsx`);
};
