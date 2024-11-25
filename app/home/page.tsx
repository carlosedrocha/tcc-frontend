import FeatureComponent from '@/components/home/feature/feature-component';
import FooterComponent from '@/components/home/footer/footer-component';
import HeroComponent from '@/components/home/hero/hero-component';
import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  return (
    <div className="h-screen w-full bg-gray-100">
      <Header />
      {/* Scrollable Area */}
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-8 p-4 lg:p-8">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center">
            <HeroComponent />
          </div>

          {/* Feature Section */}
          <div className="flex flex-col items-center justify-center">
            <FeatureComponent />
          </div>

          {/* Footer Section */}
          <div className="flex flex-col ">
            <FooterComponent />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
