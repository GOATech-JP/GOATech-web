import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import mangoRun01 from '../imports/mango/mango-run-01.png'
import mangoRun02 from '../imports/mango/mango-run-02.png'
import mangoRun03 from '../imports/mango/mango-run-03.png'
import mangoRun04 from '../imports/mango/mango-run-04.png'
import mangoRun05 from '../imports/mango/mango-run-05.png'
import mangoRun06 from '../imports/mango/mango-run-06.png'

const COUNT_DURATION = 250
const COUNTS_PER_EIGHT = 8
const FRAME_DURATION = COUNT_DURATION / 2
const MANGO_RUN_AUDIO_PATH = '/src/imports/mango-run.mp3'
const MANGO_FRAME_PATHS = [mangoRun01, mangoRun02, mangoRun03, mangoRun04, mangoRun05, mangoRun06]
const EASTER_EGG_COMMAND = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']

type Direction = 'left' | 'right' | 'down' | 'up'
type MangoLayout = { x: number; y: number; delay: number; scale: number }
type MangoState = MangoLayout & { direction: Direction; flipped: boolean; frame: number }
type MangoPhase = {
  count: number
  mangoCount: number
  direction: Direction
  layout: MangoLayout[]
  flipped?: boolean
  flipAtEnd?: boolean
  exitScreen?: boolean
}

const MANGO_SEQUENCE: MangoPhase[] = [
  { count: 4, mangoCount: 1, direction: 'left', layout: [{ x: 1, y: 0.78, delay: 0, scale: 1 }] },
  {
    count: 4,
    mangoCount: 2,
    direction: 'right',
    flipped: true,
    layout: [{ x: 0.04, y: 0.7, delay: 0, scale: 1 }, { x: -0.08, y: 0.84, delay: 100, scale: 0.92 }],
  },
  {
    count: 4,
    mangoCount: 4,
    direction: 'down',
    layout: [
      { x: 0.12, y: 0, delay: 0, scale: 0.86 }, { x: 0.37, y: 0, delay: 45, scale: 0.82 },
      { x: 0.63, y: 0, delay: 90, scale: 0.88 }, { x: 0.86, y: 0, delay: 135, scale: 0.8 },
    ],
  },
  {
    count: 4,
    mangoCount: 16,
    direction: 'up',
    layout: [
      { x: 0.06, y: 0, delay: 0, scale: 0.64 }, { x: 0.19, y: 0, delay: 35, scale: 0.56 },
      { x: 0.32, y: 0, delay: 70, scale: 0.63 }, { x: 0.46, y: 0, delay: 105, scale: 0.55 },
      { x: 0.6, y: 0, delay: 140, scale: 0.6 }, { x: 0.74, y: 0, delay: 175, scale: 0.56 },
      { x: 0.88, y: 0, delay: 210, scale: 0.63 }, { x: 0.13, y: 0, delay: 245, scale: 0.54 },
      { x: 0.27, y: 0, delay: 280, scale: 0.59 }, { x: 0.41, y: 0, delay: 315, scale: 0.55 },
      { x: 0.55, y: 0, delay: 350, scale: 0.62 }, { x: 0.69, y: 0, delay: 385, scale: 0.56 },
      { x: 0.83, y: 0, delay: 420, scale: 0.6 }, { x: 0.22, y: 0, delay: 455, scale: 0.54 },
      { x: 0.5, y: 0, delay: 490, scale: 0.58 }, { x: 0.77, y: 0, delay: 525, scale: 0.55 },
    ],
  },
  { count: 8, mangoCount: 1, direction: 'left', layout: [{ x: 1, y: 0.62, delay: 0, scale: 1 }], flipAtEnd: true },
  { count: 8, mangoCount: 1, direction: 'right', layout: [{ x: 0, y: 0.62, delay: 0, scale: 1 }], flipped: true, flipAtEnd: true },
  { count: 8, mangoCount: 1, direction: 'left', layout: [{ x: 1, y: 0.62, delay: 0, scale: 1 }], flipAtEnd: true },
  { count: 8, mangoCount: 1, direction: 'right', layout: [{ x: 0, y: 0.62, delay: 0, scale: 1 }], flipped: true, exitScreen: true },
]

const TOTAL_DURATION = MANGO_SEQUENCE.reduce((total, phase) => total + phase.count * COUNT_DURATION, 0)

export type MangoRunEasterEggHandle = { start: () => void }

export function useMangoRun() {
  const mangoRunRef = useRef<MangoRunEasterEggHandle>(null)
  const [isReady, setIsReady] = useState(false)
  const commandProgressRef = useRef(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target
    if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]')) return
    if (e.key === EASTER_EGG_COMMAND[commandProgressRef.current]) {
      commandProgressRef.current += 1
      if (commandProgressRef.current === EASTER_EGG_COMMAND.length) setIsReady(true)
      return
    }
    commandProgressRef.current = 0
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleTriggerClick = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!isReady) return
    e.preventDefault()
    mangoRunRef.current?.start()
  }, [isReady])

  const handleComplete = useCallback(() => {
    commandProgressRef.current = 0
    setIsReady(false)
  }, [])

  return { isReady, mangoRunRef, handleKeyDown, handleTriggerClick, handleComplete }
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function getPhaseAt(elapsed: number) {
  let phaseStart = 0
  for (const phase of MANGO_SEQUENCE) {
    const phaseDuration = phase.count * COUNT_DURATION
    if (elapsed < phaseStart + phaseDuration) {
      return { phase, phaseStart, progress: (elapsed - phaseStart) / phaseDuration }
    }
    phaseStart += phaseDuration
  }
  return { phase: MANGO_SEQUENCE[MANGO_SEQUENCE.length - 1], phaseStart, progress: 1 }
}

function getMangoStates(elapsed: number, viewportInlineSize: number, viewportBlockSize: number): MangoState[] {
  const { phase, phaseStart, progress } = getPhaseAt(elapsed)
  const mangoSize = Math.min(Math.max(viewportInlineSize * 0.18, 100), 190)
  const isVertical = phase.direction === 'up' || phase.direction === 'down'
  const start = phase.direction === 'left' ? viewportInlineSize + mangoSize : phase.direction === 'right' ? -mangoSize : phase.direction === 'up' ? viewportBlockSize + mangoSize : -mangoSize
  const end = phase.direction === 'left' ? -mangoSize : phase.direction === 'right' ? viewportInlineSize + mangoSize : phase.direction === 'up' ? -mangoSize : viewportBlockSize + mangoSize
  const frame = Math.floor(elapsed / FRAME_DURATION) % MANGO_FRAME_PATHS.length
  const phaseElapsed = elapsed - phaseStart

  return phase.layout.slice(0, phase.mangoCount).map((layout) => {
    const delayedProgress = Math.min(Math.max((phaseElapsed - layout.delay) / (phase.count * COUNT_DURATION), 0), 1)
    const travel = interpolate(start, end, delayedProgress)
    const x = isVertical ? viewportInlineSize * layout.x - mangoSize * layout.scale / 2 : travel
    const y = isVertical ? travel : viewportBlockSize * layout.y - mangoSize * layout.scale / 2 + Math.sin(elapsed / 80 + layout.x * 10) * 7
    return {
      ...layout,
      x,
      y,
      direction: phase.direction,
      flipped: phase.flipped === true || (phase.flipAtEnd === true && progress >= 0.98),
      frame,
    }
  })
}

type MangoRunEasterEggProps = { onComplete: () => void }
type MangoRunAnimationProps = { audio: HTMLAudioElement | null; onComplete: () => void }

const MangoRunEasterEgg = forwardRef<MangoRunEasterEggHandle, MangoRunEasterEggProps>(function MangoRunEasterEgg({ onComplete }, ref) {
  const [runId, setRunId] = useState(0)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useImperativeHandle(ref, () => ({
    start() {
      if (visible) return
      const audio = new Audio(MANGO_RUN_AUDIO_PATH)
      audio.currentTime = 0
      audioRef.current = audio
      void audio.play().catch(() => undefined)
      setRunId((currentRunId) => currentRunId + 1)
      setVisible(true)
    },
  }), [visible])

  useEffect(() => () => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
  }, [])

  const finish = useCallback(() => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
    audioRef.current = null
    setVisible(false)
    onComplete()
  }, [onComplete])

  if (!visible || runId === 0) return null
  return <MangoRunAnimation audio={audioRef.current} onComplete={finish} />
})

function MangoRunAnimation({ audio, onComplete }: MangoRunAnimationProps) {
  const [mangoes, setMangoes] = useState<MangoState[]>([])
  const animationStart = useRef(performance.now())

  useEffect(() => {
    animationStart.current = performance.now()
    let animationFrame = 0
    const animate = (now: number) => {
      const fallbackElapsed = now - animationStart.current
      const elapsed = audio && !audio.paused && audio.currentTime > 0 ? audio.currentTime * 1000 : fallbackElapsed
      if (elapsed >= TOTAL_DURATION) {
        onComplete()
        return
      }
      setMangoes(getMangoStates(elapsed, window.innerWidth, window.innerHeight))
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [audio, onComplete])

  return (
    <div id="mango-easter-egg" aria-hidden="true">
      {mangoes.map((mango, index) => (
        <div
          key={`${index}-${mango.frame}`}
          className="mango-runner"
          style={{
            inlineSize: `calc(clamp(100px, 18vw, 190px) * ${mango.scale})`,
            blockSize: `calc(clamp(100px, 18vw, 190px) * ${mango.scale})`,
            transform: `translate3d(${mango.x}px, ${mango.y}px, 0)`,
          }}
        >
          <div className="mango-sprite" style={{ transform: `scaleX(${mango.flipped ? -1 : 1})` }}>
            <img src={MANGO_FRAME_PATHS[mango.frame]} alt="" className="mango-sprite__image" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MangoRunEasterEgg
