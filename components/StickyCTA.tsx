// ========== components/StickyCTA.tsx ==========
'use client'
export default function StickyCTA({ label, href }: { label: string; href: string }) {
    return (
        <div className="fixed inset-x-0 bottom-0 md:hidden z-50">
            <a href={href} className="block mx-4 mb-4 rounded-xl bg-brand-primary text-white text-center py-3 shadow-lg active:scale-[.99]">
                {label}
            </a>
        </div>
    )
}