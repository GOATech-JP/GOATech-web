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
import mangoRunAudio from '../imports/mango-run.mp3'

const BPM = 162
const COUNT_DURATION = 60000 / BPM
const INITIAL_WAIT_DURATION = COUNT_DURATION
const FINAL_WAIT_DURATION = COUNT_DURATION
const COUNTS_PER_EIGHT = 8
const COUNTS_PER_TWO_EIGHTS = COUNTS_PER_EIGHT * 2
const FREEZE_AT_COUNT = 15
const FLIP_AT_COUNT = 16
const FRAME_DURATION = COUNT_DURATION / 4
const MANGO_FRAME_PATHS = [mangoRun01,mangoRun02,mangoRun03,mangoRun04,mangoRun05,mangoRun06]
const EASTER_EGG_COMMAND = ['ArrowLeft','ArrowRight','ArrowDown','ArrowUp']

type Direction = 'left' | 'right' | 'down' | 'up'
type MangoLayout = { x: number; y: number; delay: number; scale: number }
type MangoState = MangoLayout & { direction: Direction; flipped: boolean; frame: number; frozen: boolean }
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
  { count: 4,mangoCount: 1,direction: 'left',layout: [{ x: 1,y: 0.78,delay: 0,scale: 1 }] },
  {
    count: 4,
    mangoCount: 2,
    direction: 'right',
    flipped: true,
    layout: [{ x: 0.04,y: 0.7,delay: 0,scale: 1 },{ x: -0.08,y: 0.84,delay: COUNT_DURATION / 4,scale: 1 }],
  },
  {
    count: 4,
    mangoCount: 4,
    direction: 'down',
    layout: [
      { x: 0.12,y: 0,delay: 0,scale: 1 },{ x: 0.37,y: 0,delay: COUNT_DURATION / 8,scale: 1 },
      { x: 0.63,y: 0,delay: COUNT_DURATION / 4,scale: 1 },{ x: 0.86,y: 0,delay: COUNT_DURATION * 3 / 8,scale: 1 },
    ],
  },
  {
    count: 4,
    mangoCount: 16,
    direction: 'up',
    layout: [
      { x: 0.06,y: 0,delay: 0,scale: 1 },{ x: 0.19,y: 0,delay: COUNT_DURATION / 8,scale: 1 },
      { x: 0.32,y: 0,delay: COUNT_DURATION / 4,scale: 1 },{ x: 0.46,y: 0,delay: COUNT_DURATION * 3 / 8,scale: 1 },
      { x: 0.6,y: 0,delay: COUNT_DURATION / 2,scale: 1 },{ x: 0.74,y: 0,delay: COUNT_DURATION * 5 / 8,scale: 1 },
      { x: 0.88,y: 0,delay: COUNT_DURATION * 3 / 4,scale: 1 },{ x: 0.13,y: 0,delay: COUNT_DURATION * 7 / 8,scale: 1 },
      { x: 0.27,y: 0,delay: COUNT_DURATION,scale: 1 },{ x: 0.41,y: 0,delay: COUNT_DURATION * 9 / 8,scale: 1 },
      { x: 0.55,y: 0,delay: COUNT_DURATION * 5 / 4,scale: 1 },{ x: 0.69,y: 0,delay: COUNT_DURATION * 11 / 8,scale: 1 },
      { x: 0.83,y: 0,delay: COUNT_DURATION * 3 / 2,scale: 1 },{ x: 0.22,y: 0,delay: COUNT_DURATION * 13 / 8,scale: 1 },
      { x: 0.5,y: 0,delay: COUNT_DURATION * 7 / 4,scale: 1 },{ x: 0.77,y: 0,delay: COUNT_DURATION * 15 / 8,scale: 1 },
    ],
  },
  { count: COUNTS_PER_TWO_EIGHTS,mangoCount: 1,direction: 'left',layout: [{ x: 1,y: 0.62,delay: 0,scale: 1 }],flipAtEnd: true },
  { count: COUNTS_PER_TWO_EIGHTS,mangoCount: 1,direction: 'right',layout: [{ x: 0,y: 0.62,delay: 0,scale: 1 }],flipped: true,flipAtEnd: true },
  { count: COUNTS_PER_TWO_EIGHTS,mangoCount: 1,direction: 'left',layout: [{ x: 1,y: 0.62,delay: 0,scale: 1 }],flipAtEnd: true },
  { count: COUNTS_PER_TWO_EIGHTS,mangoCount: 1,direction: 'right',layout: [{ x: 0,y: 0.62,delay: 0,scale: 1 }],flipped: true,exitScreen: true },
]

const TOTAL_DURATION = MANGO_SEQUENCE.reduce((total,phase) => total + phase.count * COUNT_DURATION,0)

export type MangoRunEasterEggHandle = { start: () => void }

export function useMangoRun() {
  const mangoRunRef = useRef<MangoRunEasterEggHandle>(null)
  const [isReady,setIsReady] = useState(false)
  const commandProgressRef = useRef(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return
    }

    const expectedKey =
      EASTER_EGG_COMMAND[commandProgressRef.current]

    if (e.key === expectedKey) {
      e.preventDefault()

      commandProgressRef.current += 1

      if (
        commandProgressRef.current ===
        EASTER_EGG_COMMAND.length
      ) {
        commandProgressRef.current = 0
        setIsReady(true)
      }

      return
    }
    commandProgressRef.current =
      e.key === EASTER_EGG_COMMAND[0] ? 1 : 0
  },[])

  useEffect(() => {
    // capture=true にして、他コンポーネントより先に拾う
    window.addEventListener('keydown',handleKeyDown,{
      capture: true,
    })

    return () => {
      window.removeEventListener('keydown',handleKeyDown,{
        capture: true,
      })
    }
  },[handleKeyDown])

  const handleTriggerClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      if (!isReady) {
        return
      }

      e.preventDefault()
      mangoRunRef.current?.start()
    },
    [isReady],
  )

  const handleComplete = useCallback(() => {
    commandProgressRef.current = 0
    setIsReady(false)
  },[])

  return {
    isReady,
    mangoRunRef,
    handleTriggerClick,
    handleComplete,
  }
}

function interpolate(start: number,end: number,progress: number) {
  return start + (end - start) * progress
}

function getPhaseAt(elapsed: number) {
  let phaseStart = 0
  for (const phase of MANGO_SEQUENCE) {
    const phaseDuration = phase.count * COUNT_DURATION
    if (elapsed < phaseStart + phaseDuration) {
      return { phase,phaseStart,progress: (elapsed - phaseStart) / phaseDuration }
    }
    phaseStart += phaseDuration
  }
  return { phase: MANGO_SEQUENCE[MANGO_SEQUENCE.length - 1],phaseStart,progress: 1 }
}

function getMangoStates(elapsed: number,viewportInlineSize: number,viewportBlockSize: number): MangoState[] {
  const { phase,phaseStart,progress } = getPhaseAt(elapsed)
  const mangoSize = Math.min(Math.max(viewportInlineSize * 0.18,100),190)
  const isVertical = phase.direction === 'up' || phase.direction === 'down'
  const isFinalExit = phase.exitScreen === true
  const isTwoEightPhase = phase.count === COUNTS_PER_TWO_EIGHTS
  const horizontalLeft = isTwoEightPhase ? 0 : -mangoSize
  const horizontalRight = isFinalExit ? viewportInlineSize + mangoSize : isTwoEightPhase ? viewportInlineSize - mangoSize : viewportInlineSize + mangoSize
  const start = phase.direction === 'left' ? horizontalRight : phase.direction === 'right' ? horizontalLeft : phase.direction === 'up' ? viewportBlockSize + mangoSize : -mangoSize
  const end = phase.direction === 'left' ? horizontalLeft : phase.direction === 'right' ? horizontalRight : phase.direction === 'up' ? -mangoSize : viewportBlockSize + mangoSize
  const phaseElapsed = elapsed - phaseStart
  const freezeProgress = (FREEZE_AT_COUNT - 1) / phase.count
  const flipProgress = (FLIP_AT_COUNT - 1) / phase.count
  const isFrozen = phase.flipAtEnd === true && progress >= freezeProgress
  const freezeFrame = Math.floor((phaseStart + phase.count * COUNT_DURATION * freezeProgress) / FRAME_DURATION) % MANGO_FRAME_PATHS.length
  const frame = isFrozen ? freezeFrame : Math.floor(elapsed / FRAME_DURATION) % MANGO_FRAME_PATHS.length

  return phase.layout.slice(0,phase.mangoCount).map((layout) => {
    const delayedProgress = Math.min(Math.max((phaseElapsed - layout.delay) / (phase.count * COUNT_DURATION),0),1)
    const movementProgress = phase.flipAtEnd
      ? Math.min(delayedProgress,freezeProgress) / freezeProgress
      : delayedProgress
    const travel = interpolate(start,end,movementProgress)
    const x = isVertical ? viewportInlineSize * layout.x - mangoSize * layout.scale / 2 : travel
    const frozenY = viewportBlockSize * layout.y - mangoSize * layout.scale / 2
    const y = isVertical ? travel : isFrozen ? frozenY : frozenY + Math.sin(elapsed / 80 + layout.x * 10) * 7
    return {
      ...layout,
      x,
      y,
      direction: phase.direction,
      flipped: phase.flipAtEnd === true && progress >= flipProgress
        ? !phase.flipped
        : phase.flipped === true,
      frame,
      frozen: isFrozen,
    }
  })
}

type MangoRunEasterEggProps = { onComplete: () => void }
type MangoRunAnimationProps = { audio: HTMLAudioElement | null; onComplete: () => void }

const MangoRunEasterEgg = forwardRef<MangoRunEasterEggHandle,MangoRunEasterEggProps>(function MangoRunEasterEgg({ onComplete },ref) {
  const [runId,setRunId] = useState(0)
  const [visible,setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useImperativeHandle(ref,() => ({
    start() {
      if (visible) return
      const audio = new Audio(mangoRunAudio)
      audio.currentTime = 0
      audioRef.current = audio
      void audio.play().catch(() => undefined)
      setRunId((currentRunId) => currentRunId + 1)
      setVisible(true)
    },
  }),[visible])

  useEffect(() => () => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
  },[])

  const finish = useCallback(() => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
    audioRef.current = null
    setVisible(false)
    onComplete()
  },[onComplete])

  if (!visible || runId === 0) return null
  return <MangoRunAnimation audio={audioRef.current} onComplete={finish} />
})

function MangoRunAnimation({ audio,onComplete }: MangoRunAnimationProps) {
  const [mangoes,setMangoes] = useState<MangoState[]>([])
  const animationStart = useRef(performance.now())

  useEffect(() => {
    animationStart.current = performance.now()
    let animationFrame = 0
    const animate = (now: number) => {
      const fallbackElapsed = now - animationStart.current
      const elapsed = audio && !audio.paused && audio.currentTime > 0 ? audio.currentTime * 1000 : fallbackElapsed
      if (elapsed >= INITIAL_WAIT_DURATION + TOTAL_DURATION + FINAL_WAIT_DURATION) {
        onComplete()
        return
      }
      const animationElapsed = Math.max(0,elapsed - INITIAL_WAIT_DURATION)
      if (animationElapsed >= TOTAL_DURATION) {
        setMangoes([])
        animationFrame = requestAnimationFrame(animate)
        return
      }
      setMangoes(getMangoStates(animationElapsed,window.innerWidth,window.innerHeight))
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  },[audio,onComplete])

  return (
    <div id="mango-easter-egg" aria-hidden="true">
      {mangoes.map((mango,index) => (
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
            <img src={MANGO_FRAME_PATHS[mango.frame]} alt="" className={`mango-sprite__image${mango.frozen ? ' is-frozen' : ''}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MangoRunEasterEgg
