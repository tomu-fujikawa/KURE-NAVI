import React, { useState } from 'react';

type TimePickerProps = {
  onChange: (time: string) => void;
};

export default function TimePicker({ onChange }: TimePickerProps) {
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const handleChange = (type: 'hour' | 'minute', value: string) => {
    if (type === 'hour') {
      setHour(value);
    } else {
      setMinute(value);
    }
    onChange(`${type === 'hour' ? value : hour}:${type === 'minute' ? value : minute}`);
  };

  return (
    <div className="flex gap-1 items-center">
      <select
        value={hour}
        onChange={(e) => handleChange('hour', e.target.value)}
        className="p-1 rounded-md text-sm"
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        value={minute}
        onChange={(e) => handleChange('minute', e.target.value)}
        className="p-1 rounded-md text-sm"
      >
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
} 