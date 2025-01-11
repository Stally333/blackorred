import { motion } from 'framer-motion';

interface AvatarProps {
  type: 'house' | 'player';
  color?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ type, color = '#4f46e5', size = 40, className = '' }: AvatarProps) {
  if (type === 'house') {
    return (
      <motion.div 
        className={`relative ${className}`}
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.1 }}
      >
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="100" fill="#1a1a1a"/>
          <path d="M100 40L40 90H60V150H140V90H160L100 40Z" fill="#ffffff"/>
          <path d="M80 110H120V150H80V110Z" fill="#1a1a1a"/>
          <rect x="85" y="115" width="30" height="30" rx="2" fill="#ffffff"/>
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="100" fill={color}/>
        <circle cx="100" cy="80" r="30" fill="#ffffff"/>
        <path d="M60 140C60 118.67 77.91 101 100 101C122.09 101 140 118.67 140 140V160H60V140Z" fill="#ffffff"/>
      </svg>
    </motion.div>
  );
} 