import { useState, createContext, ReactNode, useContext } from 'react';

interface Episode {
   title: string;
   members: string;
   thumbnail: string;
   duration: number;
   url: string;
};

interface PlayerContextData {
   episodeList: Array<Episode>;
   currentEpisodeIndex: number;
   play: (episode: Episode) => void;
   playList: (list: Episode[], index: number) => void;
   playNext: () => void;
   playPrevious: () => void;
   clearPlayerState: () => void;
   setPlayingState: (state: boolean) => void;
   hasNext: boolean;
   hasPrevious: boolean;
   togglePlay: () => void;
   isPlaying: boolean;
   toggleLoop: () => void;
   isLooping: boolean;
   toggleShuffle: () => void;
   isShuffling: boolean;
};

interface PlayerContextProviderProps {
   children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
   const [episodeList, setEpisodeList] = useState([]);
   const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isLooping, setIsLooping] = useState(false);
   const [isShuffling, setIsShuffling] = useState(false);

   function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
   };

   function playList(list: Episode[], index: number) {
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
   };

   function togglePlay() {
      setIsPlaying(!isPlaying);
   };

   function toggleLoop() {
      setIsLooping(!isLooping);
   };

   function toggleShuffle() {
      setIsShuffling(!isShuffling);
   };

   function setPlayingState(state: boolean) {
      setIsPlaying(state);
   };

   const hasPrevious = currentEpisodeIndex > 0
   const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

   function playNext() {
      if (isShuffling) {
         const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

         setCurrentEpisodeIndex(nextRandomEpisodeIndex);

      } else if (hasNext) {
         setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
   };

   function playPrevious() {
      if (hasPrevious) {
         setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
   };

   function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
   };


   return (
      <PlayerContext.Provider
         value={{
            episodeList,
            currentEpisodeIndex,
            clearPlayerState,
            play,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            setPlayingState,
            togglePlay,
            isPlaying,
            toggleLoop,
            isLooping,
            toggleShuffle,
            isShuffling,
         }}
      >
         {children}
      </PlayerContext.Provider>
   );
};

export const usePlayer = () => {
   return useContext(PlayerContext);
};
