import React from 'react';
import TimePicker from './TimePicker';

interface data {
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  explanation: string;
  tag: string;
  visit_time: string;
}
interface family {
  parentId?: string;
  child?: data;
  time?: string;
}

interface TimePickerContainerProps {
  containers: string[];
  family: family[];
  onTimeChange: (itemId: string, time: string) => void;
}

export default function TimePickerContainer({ containers, family, onTimeChange }: TimePickerContainerProps) {
  const styles = {
    container: {
      display: 'flex',
      gap: '1.5rem',
      marginBottom: '1rem',
      width: '100%',
      overflowX: 'auto',
      padding: '1rem',
      justifyContent: 'center',
    },
    timePickerWrapper: {
      // width: '16rem',
      display: 'flex',
      justifyContent: 'center',
    }
  };
  return (
    <div style={styles.container as React.CSSProperties}>
      {containers.map((id) => {
        const foundItem = family.find((item) => item.parentId === id);
        return (
          <div key={id}>
                        {foundItem && (
                          <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", gap:"1rem"}}>
                       <p style={{fontSize:"0.8rem", fontWeight:"700", color:"var(--kure-blue)"}}>到着時刻</p> 
                      <div key={id} style={styles.timePickerWrapper}>
              <TimePicker
                onChange={(time) => onTimeChange(foundItem.child?.location_name || '', time)}
                initialTime={foundItem.time}
              />
          </div>
                          </div>
                      )}
          </div>
        );
      })}
    </div>
  );
} 