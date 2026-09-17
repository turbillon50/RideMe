# RideMe icons v1 — craft

**Motivo:** Luis rechazó v0 (Lucide-DNA / genéricos).  
**Ref visual:** `/workspace/rideme-mock-*.png`  
**Cromática OK:** dark `#0A0A0C` + mint `#00E5A8`

## Spec
| | |
|--|--|
| Stroke | **1.25** (fino premium) |
| Cap/Join | round |
| Color | `currentColor` (mint activo / blanco inactivo) |
| Grid | 24×24 |
| Estilo | geometría dura, siluetas rideshare, cero Lucide |

## Set (10)
`pin` · `search` · `call` · `chat` · `home` · `trips` · `wallet` · `profile` · `car` · `lightning`

## Archivos
- `icons-v1.tsx` — drop-in para Front/Obra
- `icons-v1-preview.png` — hoja visual
- `tokens.css` — v0.1 (press / spring / splash / focus-ring)
- `MOTION-v0.1.md` — clases `.rm-pressable` · `.rm-enter` · `.rm-sheet-enter` · `.rm-glow-pulse` · `.rm-splash`

## Consumo
Reemplazar `apps/web/src/components/icons.tsx` Lucide-DNA / v0 por `icons-v1.tsx`.  
Movil BottomNav: Home / Trips / Wallet / Profile. Car = glifo viaje, no 5º tab.

## OUT
Stroke 2 Lucide clones · purple · iconos “cute” genéricos.
