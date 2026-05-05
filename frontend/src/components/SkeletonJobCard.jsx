export default function SkeletonJobCard() {
  return (
    <div className="bg-white p-6 border rounded-2xl shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-pulse">
      <div className="flex-1 w-full">
        <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-4"></div>
        <div className="flex flex-wrap gap-4">
          <div className="h-4 bg-slate-200 rounded-md w-24"></div>
          <div className="h-4 bg-slate-200 rounded-md w-24"></div>
          <div className="h-4 bg-slate-200 rounded-md w-24"></div>
        </div>
      </div>
      <div className="h-12 bg-slate-200 rounded-xl w-32 mt-4 md:mt-0"></div>
    </div>
  );
}
