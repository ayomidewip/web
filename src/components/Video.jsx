import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import ReactPlayer from 'react-player';
import { ThemeProvider, useEffectiveTheme } from '@contexts/ThemeContext';
import Button from './Button';
import Icon from './Icon';
import Typography from './Typography';

// Shared utility functions for media components
export const clamp = (value, min = 0, max = 1) => {
    if (!Number.isFinite(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
};

export const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '00:00';
    const totalSeconds = Math.max(seconds, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const remainder = Math.floor(totalSeconds % 60);
    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

const BUTTON_COLOR_MAP = {
    default: 'primary',
    primary: 'secondary',
    secondary: 'tertiary',
    tertiary: 'primary'
};

export const getMediaButtonColor = (variant) => BUTTON_COLOR_MAP[variant] || 'primary';

// Shared keyboard shortcuts hook for media components
export const useMediaKeyboardShortcuts = (playerRef, options = {}) => {
    const {
        onTogglePlay,
        onToggleMute,
        onSeekForward,
        onSeekBackward,
        onToggleFullscreen,
        enabled = true
    } = options;

    useEffect(() => {
        if (!enabled) return;

        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const element = playerRef.current;
            if (!element) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    onTogglePlay?.();
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    onSeekBackward?.(element);
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    onSeekForward?.(element);
                    break;
                case 'm':
                    e.preventDefault();
                    onToggleMute?.();
                    break;
                case 'f':
                    e.preventDefault();
                    onToggleFullscreen?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [playerRef, onTogglePlay, onToggleMute, onSeekForward, onSeekBackward, onToggleFullscreen, enabled]);
};

export const Video = forwardRef(({
    src,
    poster = null,
    autoPlay = false,
    loop = false,
    muted = false,
    volume: initialVolume = 0.8,
    playbackRate: initialPlaybackRate = 1,
    controls = true,
    aspectRatio = '16/9',
    width = '100%',
    height = null,
    theme = null,
    color = 'default', // 'default', 'primary', 'secondary', 'tertiary'
    className = '',
    style = {},
    onPlay,
    onPause,
    onEnded,
    onProgress,
    onReady,
    onError,
    onTimeUpdate,
    onDurationChange,
    ...playerProps
}, forwardedRef) => {
    const effectiveTheme = useEffectiveTheme();
    const videoTheme = theme || effectiveTheme.currentTheme;

    const buttonColor = useMemo(() => getMediaButtonColor(color), [color]);

    const containerRef = useRef(null);
    const playerElementRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const [showControls, setShowControls] = useState(false);

    const assignRefs = useCallback((element) => {
        playerElementRef.current = element;
        if (typeof forwardedRef === 'function') {
            forwardedRef(element);
        } else if (forwardedRef) {
            forwardedRef.current = element;
        }
    }, [forwardedRef]);

    const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
    const [isMuted, setIsMuted] = useState(Boolean(muted));
    const [volume, setVolume] = useState(() => clamp(initialVolume, 0, 1));
    const previousVolumeRef = useRef(clamp(initialVolume || 0.6, 0, 1));
    const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate || 1);
    const [duration, setDuration] = useState(0);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        setIsPlaying(Boolean(autoPlay));
    }, [autoPlay]);

    useEffect(() => {
        setIsMuted(Boolean(muted));
    }, [muted]);

    useEffect(() => {
        const clamped = clamp(initialVolume, 0, 1);
        setVolume(clamped);
        previousVolumeRef.current = clamped || previousVolumeRef.current;
    }, [initialVolume]);

    useEffect(() => {
        setPlaybackRate(initialPlaybackRate || 1);
    }, [initialPlaybackRate]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keep playback toggles aligned with the underlying HTMLVideoElement
    const togglePlay = useCallback(() => {
        const element = playerElementRef.current;
        if (!element) {
            setIsPlaying((prev) => !prev);
            return;
        }

        if (element.paused || element.ended) {
            const playPromise = element.play();
            setIsPlaying(true);
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => setIsPlaying(false));
            }
        } else {
            element.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            if (next) {
                previousVolumeRef.current = volume || previousVolumeRef.current || 0.6;
                setVolume(0);
            } else {
                setVolume(previousVolumeRef.current || 0.6);
            }
            return next;
        });
    }, [volume]);

    const handleVolumeChange = useCallback((event) => {
        const newVolume = clamp(Number(event.target.value) / 100, 0, 1);
        setVolume(newVolume);
        if (newVolume > 0) {
            previousVolumeRef.current = newVolume;
            setIsMuted(false);
        } else {
            setIsMuted(true);
        }
    }, []);

    const handleSeekStart = useCallback(() => {
        setIsScrubbing(true);
    }, []);

    const handleSeekChange = useCallback((event) => {
        const element = playerElementRef.current;
        const mediaDuration = Number.isFinite(element?.duration) ? element.duration : duration || 0;
        const percent = clamp(Number(event.target.value), 0, 100);
        const newTime = (percent / 100) * mediaDuration;
        setPlayedSeconds(newTime);
    }, [duration]);

    const handleSeekEnd = useCallback((event) => {
        const element = playerElementRef.current;
        const mediaDuration = Number.isFinite(element?.duration) ? element.duration : duration || 0;
        const percent = clamp(Number(event.target.value), 0, 100);
        const newTime = (percent / 100) * mediaDuration;
        if (element && Number.isFinite(newTime)) {
            element.currentTime = newTime;
        }
        setIsScrubbing(false);
    }, [duration]);

    const handleTimeUpdateInternal = useCallback((event) => {
        const element = event?.currentTarget;
        if (!element) {
            return;
        }

        if (!isScrubbing) {
            setPlayedSeconds(element.currentTime || 0);
        }

        const mediaDuration = element.duration;
        if (Number.isFinite(mediaDuration) && mediaDuration !== duration) {
            setDuration(mediaDuration);
        }

        if (onTimeUpdate) {
            onTimeUpdate(event);
        }
    }, [duration, isScrubbing, onTimeUpdate]);

    const handleDurationChangeInternal = useCallback((event) => {
        const mediaDuration = event?.currentTarget?.duration;
        if (Number.isFinite(mediaDuration)) {
            setDuration(mediaDuration);
        }
        if (onDurationChange) {
            onDurationChange(event);
        }
    }, [onDurationChange]);

    const handlePlayInternal = useCallback((event) => {
        setIsPlaying(true);
        if (onPlay) {
            onPlay(event);
        }
    }, [onPlay]);

    const handlePauseInternal = useCallback((event) => {
        setIsPlaying(false);
        if (onPause) {
            onPause(event);
        }
    }, [onPause]);

    const handleEndedInternal = useCallback((event) => {
        if (!loop) {
            setIsPlaying(false);
        }
        if (onEnded) {
            onEnded(event);
        }
    }, [loop, onEnded]);

    // Mirror the native fullscreen API for the container wrapper
    const handleToggleFullscreen = useCallback(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }
        if (document.fullscreenElement === element) {
            document.exitFullscreen?.();
        } else {
            element.requestFullscreen?.();
        }
    }, []);

    const updateControlsMetrics = useCallback(() => {
        if (!controls) {
            return;
        }
        const containerEl = containerRef.current;
        if (!containerEl) {
            return;
        }
    }, [controls]);

    useEffect(() => {
        if (!controls) {
            return;
        }

        const handleResize = () => updateControlsMetrics();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [controls, updateControlsMetrics]);

    useEffect(() => {
        updateControlsMetrics();
    }, [width, height, aspectRatio, controls, updateControlsMetrics]);

    // Auto-hide controls after inactivity
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 2000); // Hide after 2 seconds of inactivity
    }, []);

    const handleMouseEnter = useCallback(() => {
        // Don't show controls on enter, only on move
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(false);
    }, []);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    // Keyboard shortcuts for video control
    useMediaKeyboardShortcuts(playerElementRef, {
        onTogglePlay: togglePlay,
        onToggleMute: toggleMute,
        onSeekForward: (element) => {
            if (element) element.currentTime = Math.min(duration, element.currentTime + 10);
        },
        onSeekBackward: (element) => {
            if (element) element.currentTime = Math.max(0, element.currentTime - 10);
        },
        onToggleFullscreen: handleToggleFullscreen,
        enabled: true
    });

    const progressPercent = duration ? clamp((playedSeconds / duration) * 100, 0, 100) : 0;

    const containerClassName = useMemo(() => [
        'video-player-container',
        'themed-video',
        `theme-${videoTheme}`,
        `video-color-${color}`,
        isScrubbing ? 'is-scrubbing' : '',
        showControls ? 'controls-visible' : '',
        className
    ].filter(Boolean).join(' '), [className, videoTheme, color, isScrubbing, showControls]);

    if (!src) {
        console.warn('Video component requires a valid "src" prop.');
    }

    const videoElement = (
        <div
            ref={containerRef}
            className={containerClassName}
            data-theme={videoTheme}
            data-theme-source={theme ? 'local' : 'inherited'}
            style={style}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="video-player-inner"
                style={{
                    width,
                    height: height || 'auto',
                    aspectRatio
                }}
            >
                <ReactPlayer
                    ref={assignRefs}
                    src={src}
                    playing={isPlaying}
                    muted={isMuted}
                    volume={isMuted ? 0 : volume}
                    playbackRate={playbackRate}
                    loop={loop}
                    controls={false}
                    playsInline
                    poster={poster || undefined}
                    width="100%"
                    height="100%"
                    onPlay={handlePlayInternal}
                    onPause={handlePauseInternal}
                    onEnded={handleEndedInternal}
                    onReady={onReady}
                    onError={onError}
                    onTimeUpdate={handleTimeUpdateInternal}
                    onProgress={onProgress}
                    onDurationChange={handleDurationChangeInternal}
                    {...playerProps}
                />
            </div>

            {controls && (
                <div className="video-overlay-controls">
                    <div className="video-controls-bar">
                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="sm"
                            className="video-control-button video-control-button-secondary"
                            onClick={() => {
                                if (playerElementRef.current) {
                                    playerElementRef.current.currentTime = Math.max(0, playedSeconds - 10);
                                }
                            }}
                            aria-label="Rewind 10 seconds"
                        >
                            <Icon name="FiRotateCcw" size="sm" />
                        </Button>

                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="md"
                            className="video-control-button"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        >
                            <Icon name={isPlaying ? 'FiPause' : 'FiPlay'} size="md" />
                        </Button>

                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="sm"
                            className="video-control-button video-control-button-secondary"
                            onClick={() => {
                                if (playerElementRef.current) {
                                    playerElementRef.current.currentTime = Math.min(duration, playedSeconds + 10);
                                }
                            }}
                            aria-label="Forward 10 seconds"
                        >
                            <Icon name="FiRotateCw" size="sm" />
                        </Button>

                        <Typography as="span" size="xs" weight="semibold" className="video-timecode">
                            {formatTime(playedSeconds)}
                        </Typography>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={progressPercent}
                            onChange={handleSeekChange}
                            onMouseDown={handleSeekStart}
                            onMouseUp={handleSeekEnd}
                            onTouchStart={handleSeekStart}
                            onTouchEnd={handleSeekEnd}
                            aria-label="Seek"
                            className="video-progress-input"
                        />

                        <Typography as="span" size="xs" weight="semibold" className="video-timecode video-timecode-separator">
                            /
                        </Typography>

                        <Typography as="span" size="xs" weight="semibold" className="video-timecode">
                            {formatTime(duration)}
                        </Typography>

                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="sm"
                            className="video-control-button"
                            onClick={toggleMute}
                            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                        >
                            <Icon name={isMuted || volume === 0 ? 'FiVolumeX' : (volume < 0.5 ? 'FiVolume1' : 'FiVolume2')} size="sm" />
                        </Button>

                        <div className="video-volume-control">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={Math.round((isMuted ? 0 : volume) * 100)}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                                className="video-volume-input"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="sm"
                            className="video-control-button video-control-button-secondary"
                            onClick={() => {
                                const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
                                const currentIndex = rates.indexOf(playbackRate);
                                const nextIndex = (currentIndex + 1) % rates.length;
                                setPlaybackRate(rates[nextIndex]);
                            }}
                            aria-label={`Playback speed: ${playbackRate}x`}
                            title={`${playbackRate}x`}
                        >
                            <Typography as="span" size="xs" weight="semibold">
                                {playbackRate}x
                            </Typography>
                        </Button>

                        <Button
                            variant="ghost"
                            color={buttonColor}
                            size="sm"
                            className="video-control-button"
                            onClick={handleToggleFullscreen}
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            <Icon name={isFullscreen ? 'FiMinimize' : 'FiMaximize'} size="sm" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    // If theme prop is provided, wrap with ThemeProvider for inheritance
    if (theme) {
        return (
            <ThemeProvider theme={theme}>
                {videoElement}
            </ThemeProvider>
        );
    }

    return videoElement;
});

Video.displayName = 'Video';

export default Video;
