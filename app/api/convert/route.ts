import { NextRequest, NextResponse } from 'next/server';
import * as dcmjs from 'dcmjs';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const name = formData.get('name') as string;
  const patientId = formData.get('patientId') as string;

  if (!file || !name || !patientId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const pixelData = new Uint8Array(buffer);

  const { DicomMetaDictionary, DicomDict } = dcmjs.data;
  const SOPClassUID = '1.2.840.10008.5.1.4.1.1.7';

  const dicomData = {
    PatientName: name,
    PatientID: patientId,
    StudyDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    Modality: 'OT',
    SOPClassUID: SOPClassUID,
    SeriesInstanceUID: DicomMetaDictionary.uid(),
    StudyInstanceUID: DicomMetaDictionary.uid(),
    SOPInstanceUID: DicomMetaDictionary.uid(),
    Rows: 512,
    Columns: 512,
    SamplesPerPixel: 3,
    PhotometricInterpretation: 'RGB',
    BitsAllocated: 8,
    BitsStored: 8,
    HighBit: 7,
    PixelRepresentation: 0,
    PixelData: pixelData,
  };

  const dataset = DicomMetaDictionary.naturalizeDataset(dicomData);
  const meta = DicomMetaDictionary.generateMetaHeader(dataset);

  const dicomDict = new DicomDict(meta);
  dicomDict.dict = dataset;
  dicomDict.prepare();

  const part10Buffer = dicomDict.write();
  const dicomBase64 = Buffer.from(part10Buffer).toString('base64');

  return NextResponse.json({
    dicom: dicomBase64,
  });
}
