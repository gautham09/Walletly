export function Avatar({ name, size = 'small' }: { name: string , size?: string}) {
    const sizeClass = size === 'big' ? 'w-10 h-10' : 'w-6 h-6';
    const textClass = size === 'big' ? 'text-md' : 'text-xs';
    return (
      <div className ={`relative inline-flex items-center justify-center ${sizeClass} overflow-hidden bg-gray-600 rounded-full`}>
        <span className={`${textClass} font-medium text-gray-300 `}>{name[0].toLocaleUpperCase()}</span>
      </div>
    );
  }