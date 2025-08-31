import ThumbnailGenerator from '@components/ThumbnailGenerator';
import { Navbar } from '@components/landing/navbar';

export default function AIGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ThumbnailGenerator />
      </div>
    </div>
  );
}
