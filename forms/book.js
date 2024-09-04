import models from '../models/index.js';
import ExcelJS from 'exceljs';

export const Book = class {
    constructor (term) {
        this.book = new ExcelJS.Workbook();
        this.book.creator = 'ogochan';
        this.book.lastModifiedBy = 'ogochan';
        this.fy = models.FiscalYear.findOne({
            where: {
                term: term
            }
        });
        this.term = term;
    }
    save(name) {
        console.log('saving')
        this.book.xlsx.writeFile(name);
    }
}

export const Page = class {
    constructor (book, title) {
        this.sheet = book.book.addWorksheet(title, {
            pageSetup: {
                paperSize: 9,
                orientation: 'portrait'
            }
        });
        this.noColumn = 1;
        this.lineNo = 1;
    }
    new_line()  {
        this.lineNo += 1;
        return  (this.lineNo - 1);
    }
    set_line(line)  {
        this.lineNo = line;
    }
    set_cell(col, val, _style)    {
        let cell = this.sheet.getCell(this.lineNo, col);
        if  ( val ) {
            cell.value = val;
        }
        if  ( _style )   {
            let style = {};
            if  ( _style.alignment )    {
                style.alignment = _style.alignment;
            }
            if  ( _style.border )   {
                style.border = _style.border;
            }
            if  ( _style.format )   {
                style.numFmt = _style.format;
            }
            cell.style = style;
        }
    }
}
