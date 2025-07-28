import JSZip, { JSZipObject } from 'jszip';

export default function exportZip(patientName: string, studyDate: string, imageData: string) {
  // Create a zip file from JSZip
  const zip: JSZip = new JSZip();
  const metaDataJson = {
    patientName: patientName,
    studyDate: studyDate,
  };
  // Add metadata JSON to the zip file
  zip.file('metadata.json', JSON.stringify(metaDataJson, null, 2));
  zip.file('image.jpg', imageData.split(',')[1], { base64: true });

  // Generate the ZIP and trigger download
  zip.generateAsync({ type: 'blob' }).then(zipBlob => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `ohif-export.zip`.replace(/\s+/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
