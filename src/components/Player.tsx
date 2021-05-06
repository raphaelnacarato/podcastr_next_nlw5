import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../contexts/PlayerContext';

import 'rc-slider/assets/index.css';
import styles from '../styles/components/Player.module.scss';
import { convertDurationToTimeString } from '../utils/functions';


export function Player() {
   const [progress, setProgress] = useState(0);

   const {
      episodeList,
      currentEpisodeIndex,
      clearPlayerState,
      playNext,
      playPrevious,
      setPlayingState,
      hasNext,
      hasPrevious,
      togglePlay,
      isPlaying,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
   } = usePlayer();

   const audioRef = useRef<HTMLAudioElement>(null);

   const episode = episodeList[currentEpisodeIndex];

   useEffect(() => {
      if (!audioRef.current) {
         return;
      }

      if (isPlaying) {
         audioRef.current.play();

      } else {
         audioRef.current.pause();
      }

   }, [isPlaying]);

   function setupProgressListener() {
      audioRef.current.currentTime = 0;

      audioRef.current.addEventListener('timeupdate', () => {
         setProgress(Math.floor(audioRef.current.currentTime));
      });
   };

   function handleSeek(amount: number) {
      audioRef.current.currentTime = amount;
      setProgress(amount);
   };

   function handleEpisodeEnded() {
      if (hasNext) {
         playNext();

      } else {
         clearPlayerState();
      }
   };


   return (
      <div className={styles.playerContainer}>
         <header>
            <img src='/playing.svg' alt='Tocando agora' />
            <strong>Tocando agora</strong>
         </header>

         {episode ? (
            <div className={styles.currentEpisode}>
               <Image
                  width={592}
                  height={592}
                  src={episode.thumbnail}
                  objectFit='cover'
               />
               <strong>{episode.title}</strong>
               <span>{episode.members}</span>
            </div>
         ) : (
            <div className={styles.emptyPlayer}>
               <strong>Selecione um podcast para ouvir</strong>
            </div>
         )
         }

         <footer className={!episode ? styles.empty : ''}>
            <div className={styles.progress}>
               <span>{convertDurationToTimeString(progress)}</span>

               <div className={styles.slider}>
                  {episode ? (
                     <Slider
                        max={episode.duration}
                        value={progress}
                        onChange={handleSeek}
                        trackStyle={{ backgroundColor: '#04d361' }}
                        railStyle={{ backgroundColor: '#9f75ff' }}
                        handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
                     />
                  ) : (
                     <div className={styles.emptySlider} />
                  )}
               </div>

               <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
            </div>

            {episode && (
               <audio
                  ref={audioRef}
                  src={episode.url}
                  loop={isLooping}
                  autoPlay
                  onPlay={() => setPlayingState(true)}
                  onPause={() => setPlayingState(false)}
                  onEnded={handleEpisodeEnded}
                  onLoadedMetadata={setupProgressListener}
               />
            )}

            <div className={styles.buttons}>
               <button
                  type='button'
                  onClick={toggleShuffle}
                  className={isShuffling ? styles.isActive : ''}
                  disabled={!episode || episodeList.length === 1}
               >
                  <img src="/shuffle.svg" alt="Embaralhar" />
               </button>

               <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
                  <img src="/play-previous.svg" alt="Tocar anterior" />
               </button>

               <button
                  type='button'
                  className={styles.playButton}
                  disabled={!episode}
                  onClick={togglePlay}
               >
                  {isPlaying
                     ? <img src="/pause.svg" alt="Pausar" />
                     : <img src="/play.svg" alt="Tocar" />
                  }
               </button>

               <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
                  <img src="/play-next.svg" alt="Tocar próxima" />
               </button>

               <button
                  type='button'
                  onClick={toggleLoop}
                  className={isLooping ? styles.isActive : ''}
                  disabled={!episode}
               >
                  <img src="/repeat.svg" alt="Repetir" />
               </button>
            </div>
         </footer>
      </div >
   );
};
