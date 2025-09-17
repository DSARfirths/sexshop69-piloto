export default function TrustBadges({className}:{className?:string}){
  return (
    <div className={"grid grid-cols-2 gap-2 text-xs text-neutral-700 "+(className??'')}>
      <div className="flex items-center gap-2"><span>📦</span><span>Envío discreto</span></div>
      <div className="flex items-center gap-2"><span>✅</span><span>Garantía 1 año</span></div>
      <div className="flex items-center gap-2"><span>🏬</span><span>22 tiendas</span></div>
      <div className="flex items-center gap-2"><span>🔒</span><span>Pago seguro</span></div>
    </div>
  )
}
