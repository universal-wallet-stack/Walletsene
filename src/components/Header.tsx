import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConnectButton } from "./ConnectButton";

const Header = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card border-border">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Home</a>
                <a href="#savings" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Savings Plan</a>
                <a href="#output" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Output</a>
                <a href="#pool" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Computing Pool</a>
                <a href="#partners" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Partners</a>
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-2xl font-bold text-primary">BSP</span>
        </div>

        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
