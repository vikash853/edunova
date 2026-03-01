// src/utils/generateCertificate.js
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // optional – for better formatting

export const generateCertificate = (userName, courseTitle, completionDate = new Date()) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Background gradient (light)
  doc.setFillColor(240, 248, 255); // aliceblue
  doc.rect(0, 0, 297, 210, 'F');

  // Border frame
  doc.setDrawColor(100, 100, 255); // indigo-ish
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 277, 190);

  // Certificate title
  doc.setFontSize(48);
  doc.setTextColor(30, 58, 138); // deep indigo
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate of Completion', 148.5, 40, { align: 'center' });

  // Decorative line
  doc.setLineWidth(0.5);
  doc.line(40, 50, 257, 50);

  // "This certifies that"
  doc.setFontSize(24);
  doc.setTextColor(75, 85, 99);
  doc.text('This certifies that', 148.5, 75, { align: 'center' });

  // User name – big & bold
  doc.setFontSize(40);
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.text(userName.toUpperCase(), 148.5, 105, { align: 'center' });

  // Course name
  doc.setFontSize(28);
  doc.setTextColor(55, 65, 81);
  doc.text('has successfully completed the course', 148.5, 130, { align: 'center' });

  doc.setFontSize(36);
  doc.setTextColor(79, 70, 229); // vibrant indigo
  doc.text(courseTitle, 148.5, 155, { align: 'center', maxWidth: 240 });

  // Date & ID
  doc.setFontSize(18);
  doc.setTextColor(107, 114, 128);
  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certId = `EDU-${Date.now().toString().slice(-8)}`;
  doc.text(`Issued on ${formattedDate} | Certificate ID: ${certId}`, 148.5, 180, { align: 'center' });

  // Signature lines (optional)
  doc.line(60, 190, 120, 190);
  doc.line(177, 190, 237, 190);
  doc.setFontSize(14);
  doc.text('Vikash Shukla', 90, 198, { align: 'center' });
  doc.text('EduNova LMS', 207, 198, { align: 'center' });

  // Save the PDF
  doc.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}_${userName.replace(/\s+/g, '_')}.pdf`);
};