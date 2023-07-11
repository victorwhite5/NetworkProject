import React, { useState, useEffect } from 'react';

function Timer(props) {
  const [timeLeft, setTimeLeft] = useState(props.time);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft > 0) {
          return timeLeft - 1;
        } else {
          clearInterval(timer);
          return timeLeft;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (minutes * 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <h2 className="modal-timer">{formatTime(timeLeft)}</h2>
  );
}

export default Timer;