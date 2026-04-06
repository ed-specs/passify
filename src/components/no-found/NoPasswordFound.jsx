import { FileText } from "lucide-react";

export default function NoPasswordFound() {
  return (
    <div className="flex items-center justify-center px-5 py-12 flex-col gap-4 bg-white rounded-2xl border border-gray-300">
      <div className="flex">
        <div className="rounded-full p-4 bg-gray-100">
          <FileText strokeWidth={1.5} className="size-12 text-gray-500" />
        </div>
      </div>

      <div className="flex flex-col text-center">
        <h3 className="font-semibold text-gray-500 text-lg">
          No Passwords Found
        </h3>
        <p className="text-sm text-gray-400">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    </div>
  );
}
