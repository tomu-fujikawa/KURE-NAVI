"use client";

import React, { useState, useEffect } from 'react';

type TimePickerProps = {
  onChange: (time: string) => void;
  initialTime?: string;
};

export default function TimePicker({ onChange, initialTime }: TimePickerProps) {
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  const styles = {
    container: {
      display: 'flex',
      gap: '0.25rem',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    select: {
      padding: '0.25rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
    }
  };

  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':');
      setHour(h);
      setMinute(m);
    }
  }, [initialTime]);

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
    <div style={styles.container}>
      <select
        value={hour}
        onChange={(e) => handleChange('hour', e.target.value)}
        style={styles.select}
      >
        {hours.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span>:</span>
      <select
        value={minute}
        onChange={(e) => handleChange('minute', e.target.value)}
        style={styles.select}
      >
        {minutes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
} 