import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_AVATARS } from '@/utils/constants';
import Avatar from './Avatar';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  currentAvatar: string;
}

export default function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-full left-0 mt-2 p-4 bg-black/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl z-50"
        >
          <div className="grid grid-cols-3 gap-3">
            {DEFAULT_AVATARS.map((avatar) => (
              <motion.button
                key={avatar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onSelect(avatar);
                  onClose();
                }}
                className={`relative rounded-full p-1 ${
                  currentAvatar === avatar ? 'ring-2 ring-white' : ''
                }`}
              >
                <Avatar src={avatar} size={40} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 