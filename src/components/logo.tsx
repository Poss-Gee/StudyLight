import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-white">
        Study<span className="text-primary">Light</span>
      </h1>
    </div>
  );
}
