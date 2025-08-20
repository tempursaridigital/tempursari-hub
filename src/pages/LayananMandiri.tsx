import { useState } from "react";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ServiceSelection } from "@/components/ServiceSelection";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { StatusTracker } from "@/components/StatusTracker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus } from "lucide-react";

type ViewState = 'menu' | 'services' | 'form' | 'status';

export default function LayananMandiri() {
  const [currentView, setCurrentView] = useState<ViewState>('menu');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  const handleServiceSelect = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setCurrentView('form');
  };

  const handleFormSuccess = (requestNumber: string) => {
    // Could navigate to a success page or show status
    setCurrentView('menu');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'services':
        return (
          <ServiceSelection
            onServiceSelect={handleServiceSelect}
            onBack={() => setCurrentView('menu')}
          />
        );
      
      case 'form':
        return (
          <ServiceRequestForm
            serviceType={selectedServiceType}
            onBack={() => setCurrentView('services')}
            onSuccess={handleFormSuccess}
          />
        );
      
      case 'status':
        return (
          <StatusTracker
            onBack={() => setCurrentView('menu')}
          />
        );
      
      default:
        return (
          <div className="p-4 space-y-4">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Layanan Mandiri</h2>
              <p className="text-muted-foreground mb-4">
                Ajukan permohonan surat dan dokumen secara online
              </p>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => setCurrentView('services')}
                className="w-full h-16 text-left justify-start"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Ajukan Permohonan Baru</p>
                    <p className="text-sm text-muted-foreground">
                      Pilih jenis layanan dan isi formulir
                    </p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => setCurrentView('status')}
                className="w-full h-16 text-left justify-start"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Cek Status Permohonan</p>
                    <p className="text-sm text-muted-foreground">
                      Lacak status dengan NIK
                    </p>
                  </div>
                </div>
              </Button>
            </div>

            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Informasi Layanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Jam Pelayanan:</span>
                  <span className="font-medium">08.00 - 15.00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Hari Kerja:</span>
                  <span className="font-medium">Senin - Jumat</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Proses:</span>
                  <span className="font-medium">1-3 hari kerja</span>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <MobileLayout>
      <MobileHeader 
        title="Layanan Mandiri" 
        subtitle="Pelayanan administrasi desa online" 
      />
      
      <MobileContent>
        {renderContent()}
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}