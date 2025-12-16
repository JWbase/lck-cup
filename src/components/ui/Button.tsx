interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'baron' | 'elder';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  baron: 'bg-purple-600 hover:bg-purple-700 text-white',
  elder: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-semibold
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
