import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';

const options = [
  { value: '0.5', label: '0.5x' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
];

export function AudioMsg({ msg }) {
  const [playbackRate, setPlaybackRate] = useState({ value: '1', label: '1x' });
  const audioRef = useRef(null);
  

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = parseFloat(playbackRate.value);
    }
  }, [playbackRate]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      borderRadius: '1rem',
      background: 'linear-gradient(to bottom, #ffffff 0%, #f3f3f3 100%)',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',

    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      padding: '10px',
      fontSize: '14px',
      color: '#333',
      border: '1px solid #eee',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '1rem',
      color: '#333',
    }),
  };

  return (
    <div className='audio-recording-msg'>
      <audio ref={audioRef} className="audio-display" controls>
        <source src={msg?.content} type="audio/ogg"></source>
      </audio>
      
      <div className="select-wrapper">
        <Select
          styles={customStyles}
          value={playbackRate}
          onChange={setPlaybackRate}
          options={options}
        />
      </div>
    </div>
  );
}
