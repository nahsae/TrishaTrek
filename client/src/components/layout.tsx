import Navigation from "./navigation";
import Confetti from "./confetti";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen celebration-bg">
      <Confetti />
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
