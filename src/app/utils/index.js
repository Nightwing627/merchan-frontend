import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const convertHTMLToPDF = async (html, y) => {

    const canvas = await html2canvas(html, { useCORS: true, y: y || html.offsetTop });

    const imgData = canvas.toDataURL(
        'image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let pageNumber = 0;
    const pageheight = pdf.internal.pageSize.height;

    while (pdfHeight > (pageheight * pageNumber)) {
        if (pageNumber !== 0) {
            pdf.addPage();
        }
        const pos = 0 - (pageheight * pageNumber);
        pdf.addImage(imgData, 'PNG', 0, pos, pdfWidth, pdfHeight);
        pageNumber++;
    }

    return pdf;
}

const convertHTMLToImage = async (html) => {

    const canvas = await html2canvas(html, { useCORS: true, y: html.offsetTop });

    return canvas.toDataURL(
        'image/jpg');
}

export const downloadHelper = {
    convertHTMLToPDF,
    convertHTMLToImage
}

export default downloadHelper;