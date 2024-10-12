import React, { useEffect, useRef, useState } from "react";

const SambaTech = () => {
  const playerRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState(null);
  const [eventInfo, setEventInfo] = useState({ event: "", eventParam: "" });
  const [mediaStatus, setMediaStatus] = useState([]);

  useEffect(() => {
    // Inicializa o player Samba
    const player = new window.SambaPlayer("player", {
      height: 360,
      width: 640,
      ph: "8e3d0282396740b58ca732fee467ba39", // Player Hash do projeto
      m: "03a84f9d6d2092148c61ff9da9e9c5d4", // MidiaID
      playerParams: {
        enableShare: true,
      },
      events: {
        onLoad: eventListener,
        onStart: eventListener,
        onFinish: eventListener,
      },
    });

    playerRef.current = player;

    // // Cleanup function
    // return () => {
    //   if (playerRef.current) {
    //     playerRef.current.destroy();
    //   }
    // };
  }, []);

  const eventListener = (player) => {
    if (player.event !== "onListen") {
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
    }
  };

  const handlePlay = () => {
    playerRef.current.play();
  };

  const handlePause = () => {
    playerRef.current.pause();
  };

  const handleSeek = () => {
    playerRef.current.seek(20);
  };

  const handleStatus = () => {
    playerRef.current.getStatus((media) => {
      const statusArray = [];
      for (const key in media.status) {
        statusArray.push({
          key,
          value: typeof media.status[key] !== "number" ? media.status[key] : media.status[key].toFixed(2),
        });
      }
      setMediaStatus(statusArray);
    });
  };

  const handleVolume = () => {
    playerRef.current.setVolume(20);
  };

  const handleMute = () => {
    if (!muted) {
      setMuted(true);
      playerRef.current.mute();
    } else {
      setMuted(false);
      playerRef.current.unmute();
    }
  };

  return (
    <div className="samba-player-container">
      <div id="player"></div>
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
      <div className="panel panel-default">
        <div className="panel-heading">Função chamada: <code>{eventInfo.event}</code></div>
        <div>{eventInfo.eventParam}</div>
      </div>
      <div className="panel panel-default">
        <div className="panel-heading">Status</div>
        <table className="table table-bordered">
          <tbody>
            {mediaStatus.map((statusItem) => (
              <tr key={statusItem.key}>
                <td>{statusItem.key}</td>
                <td>{statusItem.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SambaTech;
