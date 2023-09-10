'use client';

import { motion } from 'framer-motion';
import { navVariants } from '@/lib/motion';
import { ModeToggle } from './ModeToggle';
import { ConnectKitButton } from 'connectkit';

type NavbarProps = {
  title: string;
};
const Navbar = ({ title }: NavbarProps) => (
  <motion.nav
    variants={navVariants}
    initial="hidden"
    whileInView="show"
    className={`sm:px-16 px-4 py-4 relative`}
  >
    <div className="absolute w-[50%] inset-0 gradient-01" />
    <div className={`flex items-center justify-between h-16`}>
      <div className="flex flex-1">
        <h2 className="font-extrabold text-[24px]">{title}</h2>
      </div>
      <div className="flex flex-row items-center justify-end flex-1 gap-2">
        <ModeToggle />
        <ConnectKitButton />
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
