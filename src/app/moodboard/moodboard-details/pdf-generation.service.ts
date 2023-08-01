import { Injectable } from '@angular/core';
import  {jsPDF} from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {
  public clonequoteItems: any;
  public td: any;

  constructor() { }


  generateMBPDF() {
    var doc = new jsPDF('l');


    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Moodboard Information']
      ],
    });
    (doc as any).autoTable({
      html: '#userInfoTable',
      bodyStyles: { minCellHeight: 8 },
      theme: 'grid',
      styles: { lineWidth: 0 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { fontStyle: 'bold', fontSize: 11 },
        2: { fontStyle: 'bold', fontSize: 11 }
      },
      didDrawCell: function (data) {
        if (data.column.index === 1 && data.cell.section === 'body') {
        }
      }
    });
    doc.addPage();

    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Moodboard Information']
      ],
    });

    (doc as any).autoTable({
      html: '#printImage',
      bodyStyles: { minCellHeight: 57, minCellWidth: 50 },
      theme: 'plain',
      showHead: 'firstPage',
      styles: { valign: 'middle' },
      rowPageBreak: true,
      columnStyles: {
      },
      headStyles: { fillColor: '#f2f2f2', textColor: '#000', fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc' },
      didDrawCell: function (data) {
        if (data.cell.section === 'body') {
          let td = data.cell.raw;
          if (td) {
            let img = td.getElementsByTagName('img')[0];
            console.log(img)           
            doc.addImage(img.src, data.cell.x + 1, data.cell.y + 1, 20, 20);
          }
        }
      },
      willDrawCell: function (data) {
        data.cell.textPos = {
          x: data.cell.x + 2, y: data.cell.y + 65
        };

      },

    });
    doc.setTextColor(255, 0, 0);
    doc.save('moodboard' + '.pdf');

  }

  /**
   * Moodboard Quote PDF
   */
  pdfGeneration() {


    var doc = new jsPDF('l');

    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Moodboard Information']
      ],
    });
    (doc as any).autoTable({
      html: '#userInfoTable',
      bodyStyles: { minCellHeight: 8 },
      theme: 'grid',
      styles: { lineWidth: 0 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { fontStyle: 'bold', fontSize: 11 }
      },
    });
    doc.addPage();

    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Moodboard Information']
      ],
    });

    (doc as any).autoTable({
      html: '#printImage',
      bodyStyles: { minCellHeight: 57, minCellWidth: 50 },
      theme: 'plain',
      showHead: 'firstPage',
      styles: { valign: 'middle' },
      rowPageBreak: true,
      columnStyles: {
      },
      headStyles: { fillColor: '#f2f2f2', textColor: '#000', fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc' },
      didDrawCell: function (data) {
        if (data.cell.section === 'body') {
          let td = data.cell.raw;
          if (td) {
            let img = td.getElementsByTagName('img')[0];
            doc.addImage(img.src, data.cell.x + 1, data.cell.y + 1, 20, 20);
          }
        }
      },
      willDrawCell: function (data) {
        let td = data.cell.raw;
        data.cell.textPos = {
          x: data.cell.x + 2, y: data.cell.y + 65
        };
      },
    });

    doc.addPage();
    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Summary']
      ],
    });
    (doc as any).autoTable({
      html: '#mainTable',
      bodyStyles: { minCellHeight: 15 },
      theme: 'grid',
      showHead: 'firstPage',
      styles: { valign: 'middle' },
      columnStyles: {
        0: { halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 22, minCellHeight: 20 },
        13: { cellWidth: 25, minCellHeight: 20 },
      },
      headStyles: { fillColor: '#f2f2f2', textColor: '#000', fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc' },
      didDrawCell: function (data) {
        if (data.column.index === 2 && data.cell.section === 'body') {
          let index = data.table.body.length - 1;
          if (data.row.index = index) {
            delete data.table.body[index]
          }
          let td = data.cell.raw;
          let img = td.getElementsByTagName('img')[0];

          doc.addImage(img.src, data.cell.x + 1, data.cell.y + 1, 19, 19);
        }
      }
    });
    doc.setTextColor(255, 0, 0);
    doc.save('moodboard' + '.pdf');

  }



}
