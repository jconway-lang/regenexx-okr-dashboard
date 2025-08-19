import React from 'react'

interface RegenexxLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const RegenexxLogo: React.FC<RegenexxLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center mr-3`}>
        <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} fill="currentColor" viewBox="0 0 24 24">
          {/* Modern medical/healthcare icon */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-bold text-gray-900 mb-1`}>Regenexx</h1>
          <p className="text-gray-600 text-sm">OKR Dashboard</p>
        </div>
      )}
    </div>
  )
}

export default RegenexxLogo
