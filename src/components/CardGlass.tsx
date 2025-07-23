// src/components/CardGlass.tsx
type Props = {
  children: React.ReactNode;
  className?: string;
};

export function CardGlass({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}
