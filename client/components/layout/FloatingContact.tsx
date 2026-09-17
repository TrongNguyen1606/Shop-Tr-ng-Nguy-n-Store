'use client';
import { MessageCircle } from 'lucide-react';

const LINKS = [
  { name: 'Discord', href: process.env.NEXT_PUBLIC_DISCORD_INVITE || '#', color: 'bg-[#5865F2]' },
  { name: 'Zalo', href: process.env.NEXT_PUBLIC_ZALO_LINK || '#', color: 'bg-[#0068FF]' },
  { name: 'Facebook', href: process.env.NEXT_PUBLIC_FACEBOOK_LINK || '#', color: 'bg-[#1877F2]' },
];

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {LINKS.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${l.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
          title={l.name}
        >
          <MessageCircle size={20} className="text-white" />
        </a>
      ))}
    </div>
  );
}
