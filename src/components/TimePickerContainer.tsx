"use client";

import React from 'react';
import TimePicker from './TimePicker';

interface TimePickerContainerProps {
  containers: string[];
  family: any[];
  onTimeChange: (itemId: string, time: string) => void;
}

export default function TimePickerContainer({ containers, family, onTimeChange }: TimePickerContainerProps) {
  const styles = {
    container: {
      display: 'flex',
      gap: '1.5rem',
      width: '100%',
      overflowX: 'auto',
      padding: '1rem',
    },
    timePickerWrapper: {
      width: '16rem',
      display: 'flex',
      justifyContent: 'center',
    }
  };
  return (
    <div style={styles.container as React.CSSProperties}>
      {containers.map((id) => {
        const foundItem = family.find((item) => item.parentId === id);
        return (
          <div key={id} style={styles.timePickerWrapper}>
            {foundItem && (
              <TimePicker
                onChange={(time) => onTimeChange(foundItem.child?.location_name || '', time)}
                initialTime={foundItem.time}
              />
            )}
          </div>
        );
      })}
    </div>
  );
} 