import { AppLogo } from './icons';
import Notifications from './notifications';

export default function AppHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AppLogo width={36} height={36} />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            WasteNot Wallet
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
        </div>
      </div>
    </header>
  );
}
