import { BUILD_VERSION, BUILD_DATE } from '@/version'

export default function VersionFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-kids-cream/80 py-1 backdrop-blur-sm">
      <span className="text-[10px] font-medium tracking-wider text-kids-brown/40">
        v{BUILD_VERSION} · {BUILD_DATE}
      </span>
    </div>
  )
}
