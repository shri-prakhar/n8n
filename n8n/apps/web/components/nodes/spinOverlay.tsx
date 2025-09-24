export default function SpinnerOverlay() {
  return (
    <div className="absolute inset-0 z-20 bg-orange-300/20 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-pink-400 animate-spin"></div>
      </div>
    </div>
  );
}
