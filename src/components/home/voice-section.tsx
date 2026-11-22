'use client';
import Link from 'next/link';
import { Mic, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { ASSISTANT_COPY } from '@/lib/domain/assistant';
import { Container } from '@/components/ui/container';
export function VoiceSection() { const { language,t }=useLanguage(); const copy=ASSISTANT_COPY[language]; return <section className="bg-sapphire text-linen py-16 sm:py-24"><Container><div className="max-w-3xl mx-auto text-center space-y-6"><Mic className="mx-auto text-gold" size={30} /><p className="text-gold uppercase tracking-widest text-sm">ADHIKAAR Guide</p><h2 className="font-display text-3xl sm:text-4xl">{copy.title}</h2><p className="text-linen/80 leading-relaxed">{copy.intro}</p><Link href="/app/assistant" className="action-link gold"><MessageSquare size={18} />{t.voiceSection.secondaryCta}</Link><p className="text-sm text-linen/75">{copy.voiceNote}</p></div></Container></section>; }
