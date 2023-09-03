import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs'
import styles from './FileDisplay.module.css'
import { useRef, useEffect, useState, CSSProperties } from 'react'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi'

interface Props {
  url: string[]
  coverUrl?: string
  type: FileType
  title: string
  singleItem: boolean
}

export default function FileDisplay({ singleItem = false, url, coverUrl, type, title} : Props) {
  return type == 'image' ? (
    <img id={styles.content} className={singleItem ? styles.singleItem : undefined} src={url[0]} alt={title}></img>
  ) : type == 'video' ? (
    <video controls={true} id={styles.content} className={singleItem ? styles.singleItem : undefined} src={url[0]}></video>
  ) : type =='audio' ? (
    <AudioPlayer 
      singleItem={singleItem} 
      url={url} 
      coverUrl={coverUrl} 
      title={title} 
      type={type} />
  ) : <span className="error">Unknown Data Type: {type}</span>
}

interface Time {
  minutes: number
  seconds: number
}

const AudioPlayer = ({ singleItem, url, coverUrl } : Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = useState(0)
  const [duration, setDuration] = useState<Time | null>(null)
  const [position, setPosition] = useState<Time | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    audioRef.current?.load()
    setPlaying(false)
    setDuration({
      minutes: 0,
      seconds: 0
    })

    setPosition({
      minutes: 0,
      seconds: 0
    })
    // When the audio data loads, set the duration and position state
    audioRef.current?.addEventListener('loadedmetadata', () => {
      const d = audioRef.current!.duration

      setDuration({
        minutes: Math.floor(d / 60),
        seconds: Math.floor(d % 60)
      })

      setPosition({
        minutes: 0,
        seconds: 0
      })
    })

    // When the audio time updates, update the state
    audioRef.current?.addEventListener('timeupdate', () => {
      const s = audioRef.current!.currentTime

      setPosition({
        minutes: Math.floor(s / 60),
        seconds: Math.floor(s % 60)
      })
    })

    // When the audio playback reaches the end, set the playing state to false
    audioRef.current?.addEventListener('ended', () => {
      setPlaying(false)
    })
  }, [audioRef, track])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!audioRef.current) return

    // updates the state of the position as well, since it's called in
    // the event listener
    audioRef.current.currentTime = parseInt(e.target.value)
  }

  const togglePlaying = () => {
    if(!audioRef.current) return

    setPlaying(!playing)

    const audio = audioRef.current

    if(audio.paused) audio.play()
    else audio.pause()
  }

  return (
    <div id={styles.content} className={singleItem ? styles.singleItem : undefined}>
      <img id={styles.audioCover} src={coverUrl}></img>
      { position && duration && (
        <div id={styles.audioPlayer}>
          <div id={styles.trackSelector}>
            <div id={styles.audioButtons}>
              <button 
                className={styles.trackButton} 
                disabled={track == 0} 
                aria-disabled={track == 0}
                onClick={() => setTrack(track - 1)}>
                <BiSkipPrevious className={track != 0 ? 'hover-target' : undefined} />
              </button>
              <button id={styles.playPause} onClick={togglePlaying}>
                { playing ? (
                  <BsPauseFill className="hover-target" />
                ) : (
                  <BsFillPlayFill className="hover-target" />
                )}
              </button>
              <button 
                className={styles.trackButton} 
                disabled={track == url.length - 1} 
                aria-disabled={track == url.length - 1}
                onClick={() => setTrack(track + 1)}>
                <BiSkipNext className={track != url.length - 1 ? 'hover-target' : undefined} />
              </button>
            </div>
            <span id={styles.trackInfo}>{track + 1} / {url.length}</span>
          </div>
          <div id={styles.playback}>
            <input 
              type="range" 
              min="0" 
              max={secs(duration.minutes, duration.seconds)}
              value={secs(position.minutes, position.seconds)}
              onChange={handleChange}
              id={styles.slider}
              className="hover-target"
              style={{
                '--position': `${secs(position.minutes, position.seconds) / secs(duration.minutes, duration.seconds) * 100}%`
              } as CSSProperties}
            />
            <p id={styles.position}>{position.minutes}:{formatSeconds(position.seconds)}/{duration.minutes}:{formatSeconds(duration.seconds)}</p>
          </div>
        </div>
      )}
      { (!position || !duration) && (
        <span>Loading...</span>
      )}
      <audio ref={audioRef}>
        <source src={url[track]}></source>
      </audio>
    </div>
  )
}

const formatSeconds = (seconds: number | undefined) => {
  if(typeof seconds == 'undefined') return

  return seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`
}

const secs = (minutes: number, seconds: number) => {
  return (minutes * 60) + seconds
}
