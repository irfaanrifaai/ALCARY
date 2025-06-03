export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-amber-700 font-bold text-lg">Memuat...</span>
      </div>
    </div>
  );
}