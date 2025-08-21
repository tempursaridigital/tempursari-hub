import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { layananApi, CreateRequestData } from "@/services/layananApi";

interface ServiceRequestFormProps {
  serviceType: string;
  onBack: () => void;
  onSuccess: (requestNumber: string) => void;
}

const serviceTypes = {
  'surat_pengantar_ktp': 'Surat Pengantar KTP',
  'surat_keterangan_domisili': 'Surat Keterangan Domisili',
  'surat_keterangan_usaha': 'Surat Keterangan Usaha',
  'surat_keterangan_tidak_mampu': 'Surat Keterangan Tidak Mampu',
  'surat_keterangan_belum_menikah': 'Surat Keterangan Belum Menikah',
  'surat_pengantar_nikah': 'Surat Pengantar Nikah',
  'surat_keterangan_kematian': 'Surat Keterangan Kematian',
  'surat_keterangan_kelahiran': 'Surat Keterangan Kelahiran'
};

export const ServiceRequestForm = ({ serviceType, onBack, onSuccess }: ServiceRequestFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    phoneNumber: '',
    purpose: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const validateFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} terlalu besar (maksimal 2MB)`);
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name} format tidak didukung`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: "Error Upload File",
        description: errors.join(', '),
        variant: "destructive"
      });
    }

    return validFiles;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      setDocuments(prev => [...prev, ...validFiles]);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      setDocuments(prev => [...prev, ...validFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData: CreateRequestData = {
        service_type: serviceType as any,
        full_name: formData.fullName,
        nik: formData.nik,
        phone_number: formData.phoneNumber,
        documents: documents.length > 0 ? documents : undefined
      };

      const request = await layananApi.createRequest(requestData);

      toast({
        title: "Permohonan Berhasil",
        description: `Nomor permohonan: ${request.request_number}`,
      });

      onSuccess(request.request_number);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengirim permohonan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = {
    'surat_pengantar_ktp': [
      'Foto KTP lama (jika ada)',
      'Foto Kartu Keluarga',
      'Pas foto 3x4 terbaru'
    ],
    'surat_keterangan_domisili': [
      'Foto KTP',
      'Foto Kartu Keluarga',
      'Surat kontrak/bukti tempat tinggal'
    ],
    'surat_keterangan_usaha': [
      'Foto KTP',
      'Foto tempat usaha',
      'Surat izin usaha (jika ada)'
    ]
  };

  const currentRequirements = requirements[serviceType as keyof typeof requirements] || [
    'Foto KTP',
    'Dokumen pendukung lainnya'
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{serviceTypes[serviceType as keyof typeof serviceTypes]}</h2>
          <p className="text-sm text-muted-foreground">Lengkapi formulir dan upload dokumen</p>
        </div>
      </div>

      {/* Requirements Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-primary mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Dokumen yang Diperlukan
        </h3>
        <ul className="text-sm space-y-1">
          {currentRequirements.map((req, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              {req}
            </li>
          ))}
        </ul>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Data Pemohon</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
                required
                placeholder="Masukkan NIK (16 digit)"
                maxLength={16}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Nomor HP</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
                placeholder="Contoh: 081234567890"
              />
            </div>

            <div>
              <Label htmlFor="purpose">Keperluan/Tujuan</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="Jelaskan keperluan pengajuan surat ini"
                rows={3}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Upload Dokumen</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="documents">Upload Dokumen Pendukung (Opsional)</Label>
              
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* File Upload */}
                <div className="space-y-2">
                  <Input
                    id="documents"
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('documents')?.click()}
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:border-primary"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Pilih File</span>
                  </Button>
                </div>

                {/* Camera Capture */}
                <div className="space-y-2">
                  <Input
                    id="camera"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('camera')?.click()}
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:border-primary"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Ambil Foto</span>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Format: JPG, PNG, PDF. Maksimal 2MB per file.
              </p>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">File yang dipilih ({documents.length}):</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-sm bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {file.type.includes('image') ? 'Gambar' : 'PDF'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
        </Button>
      </form>
    </div>
  );
};