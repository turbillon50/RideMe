# tokens.css v0.1 — motion + splash

Ley: `/workspace/rideme-ley-visual.png`

## Motion (craft en cada acción)
| Token | Valor | Uso |
|-------|-------|-----|
| `--rm-dur-instant` | 80ms | toggle/dot |
| `--rm-dur` | 180ms | hover/color |
| `--rm-dur-enter` | 280ms | cards in |
| `--rm-dur-sheet` | 360ms | bottom sheet |
| `--rm-dur-splash` | 900ms | splash fade |
| `--rm-ease-spring` | 0.34,1.4,0.64,1 | press rebound |
| `--rm-press-scale` | 0.97 | pressable |
| `--rm-press-scale-cta` | 0.985 | CTA full-width |
| `--rm-spring-stiffness/damping` | 420 / 28 | framer-motion |
| `--rm-focus-ring` | mint 2+4 | a11y |

Clases: `.rm-pressable` · `.rm-enter` · `.rm-sheet-enter` · `.rm-glow-pulse` · `.rm-splash`

`prefers-reduced-motion` → dur ≈ 1ms, scale 1.

## Splash
Glow radial mint + wordmark `#00E5A8` + `--rm-glow-text`.

## Cards
`--rm-radius-card: 18px` (rango collage 16–20).
