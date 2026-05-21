interface CallLayoutProps {
  children: React.ReactNode;
}

export default function CallLayout({ children }: CallLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {children}
    </div>
  );
}
