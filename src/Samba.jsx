import React, { useEffect, useRef, useState } from "react";

const SambaTech = () => {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState(null);
  const [eventInfo, setEventInfo] = useState({ event: "", eventParam: "" });
  const [mediaStatus, setMediaStatus] = useState([]);

  useEffect(() => {
    if (!playerRef.current && playerContainerRef.current) {
      const player = new window.SambaPlayer(playerContainerRef.current.id, {
        height: 531,
        width: 1232,
        ph: "f5ed1e5797cf4c36a6a292ae786327ae", // Player Hash do projeto
        m: "03a84f9d6d2092148c61ff9da9e9c5d4", // MidiaID
        playerParams: {
          enableShare: true,
          resume: true,
          sb360:true
        },
        events: {
          onLoad: eventListener,
          onStart: eventListener,
          onPause: eventListener,
          onResume: eventListener,
          onSeek: eventListener,
          onCuepoint: (player) => {
            console.log(`Player passou por um cuepoint`, player);
            eventListener(player);
          },
          onMediaView: (player) => {
            console.log(`Player passou por um mediaView: ${player.eventParam}%`);
            eventListener(player);
          },
          onProgress: (player) => {
            // console.log(`Progresso atual ${player.eventParam} segundos`);
            eventListener(player);
          },
          onFinish: (player) => {
            console.log(`Player finalizou a execução`);
            eventListener(player);
            },
          onError: eventListener,
        },
      });

      playerRef.current = player;
    }

    // Cleanup function (opcional)
    // return () => {
    //   if (playerRef.current) {
    //     playerRef.current.destroy();
    //   }
    // };
  }, []);

  const eventListener = (player) => {
    setEventInfo({
      event: player.event,
      eventParam: player.eventParam
        ? typeof player.eventParam === "object"
          ? JSON.stringify(player.eventParam)
          : player.eventParam
        : "",
    });

    if (player.event === "onStart" || player.event === "onFinish") {
      setStatus(player.event);
    }
  };

  // Funções de controle do player
  const handlePlay = () => playerRef.current.play();
  const handlePause = () => playerRef.current.pause();
  const handleSeek = () => playerRef.current.seek(20);
  const handleStatus = () => {
    playerRef.current.getStatus((media) => {
      const statusArray = Object.entries(media.status).map(([key, value]) => ({
        key,
        value: typeof value !== "number" ? value : value.toFixed(2),
      }));
      setMediaStatus(statusArray);
    });
  };
  const handleVolume = () => playerRef.current.setVolume(20);
  const handleMute = () => {
    setMuted((prev) => !prev);
    muted ? playerRef.current.unmute() : playerRef.current.mute();
  };

  return (
    <div className="samba-player-container">
      <div id="player" ref={playerContainerRef}></div> {/* Referência para o contêiner do player */}
      <div className="btn-group">
        <button onClick={handlePlay} className="btn btn-default">
          <span className="glyphicon glyphicon-play"></span> Play
        </button>
        <button onClick={handlePause} className="btn btn-default">
          <span className="glyphicon glyphicon-pause"></span> Pause
        </button>
        <button onClick={handleSeek} className="btn btn-default">
          <span className="glyphicon glyphicon-backward"></span>
          <span className="glyphicon glyphicon-forward"></span> Seek to 00:20
        </button>
        <button onClick={handleStatus} className="btn btn-default">
          <span className="glyphicon glyphicon-indent-left"></span> Player Status
        </button>
        <button onClick={handleVolume} className="btn btn-default">
          <span className="glyphicon glyphicon-volume-up"></span> Volume 20%
        </button>
        <button onClick={handleMute} className="btn btn-default">
          <span className={`glyphicon ${muted ? "glyphicon-volume-up" : "glyphicon-volume-off"}`}></span> Mute
        </button>
      </div>
    </div>
  );
};

export default SambaTech;
