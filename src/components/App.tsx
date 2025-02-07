"use client";

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useState,useEffect } from 'react';
import Papa from "papaparse";
import { Button } from './ui/button';
import TimePicker from './TimePicker';
import TimePickerContainer from './TimePickerContainer';
import { Plus, Minus } from 'lucide-react';

interface data {
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
}
interface family {
  parentId?: string;
  child?: data;
  time?: string;
}

export default function Page({label}:any) {
    const [data, setData] = useState<data[]>([]);
    const [choices, setChoices] = useState<any>();
    useEffect(() => {
      fetch("/locations.csv")
          .then((response) => response.text())
          .then((csvText) => {
              const parsedData = Papa.parse<data>(csvText, {
                  header: true,
                  skipEmptyLines: true,
                  dynamicTyping: { age: true },
              });
  
              setData(parsedData.data);
              setChoices(parsedData.data);
          })
          .catch((error) => console.error("Error fetching CSV:", error));
    //  const data = [{
    //     image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%94%E6%88%B8.png",
    //     latitude
    //     : 
    //     34.16246,
    //     location_name
    //     : 
    //     "A",
    //     longitude
    //     : 
    //     132.83784},
    //     {
    //       image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%94%E6%88%B8.png",
    //       latitude
    //       : 
    //       34.16246,
    //       location_name
    //       : 
    //       "B",
    //       longitude
    //       : 
    //       132.83784},
    //       {
    //         image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%94%E6%88%B8.png",
    //         latitude
    //         : 
    //         34.16246,
    //         location_name
    //         : 
    //         "C",
    //         longitude
    //         : 
    //         132.83784}];
      // setChoices(data);
      // setData(data);

  }, []);
  // const containers = ['A', 'B', 'C'];
  const [family, setFamily] = useState<family[]>([]);
  const [containers, setContainers] = useState<string[]>(['A']);

  console.log("data",data);
console.log("choices",choices);
  const addPlan = () => {
    const nextLetter = String.fromCharCode(65 + containers.length); // A, B, C...
    setContainers([...containers, nextLetter]);
  }
  const deletePlan = () => {
    if (containers.length > 1) {
      const newContainers = containers.slice(0, -1);
      // 削除されるコンテナに関連するfamilyアイテムを元のchoicesに戻す
      const removedContainer = containers[containers.length - 1];
      const removedItems = family.filter(item => item.parentId === removedContainer);
      
      setFamily(family.filter(item => item.parentId !== removedContainer));
      setChoices((prevChoices: any) => [...prevChoices, ...removedItems.map((item: any) => item.child)]);
      setContainers(newContainers);
    }
  }

  const handleTimeChange = (itemId: string, time: string) => {
    setFamily(prevFamily => 
      prevFamily.map(item => 
        item.child?.location_name === itemId 
          ? { ...item, time: time }
          : item
      )
    );
  };

  const styles = {
    container: {
      padding: '2rem',
      width: '90vw',
      margin: '0 auto',
    },
    card: {
      width: '100%',
      margin: '0 auto',
    },
    scrollContainer: {
      width: '100%',
      overflowX: 'auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    timePickerAndDroppableWrapper: {
      display: 'flex',
      minWidth: 'min-content',
      gap: '1.5rem',
      padding: '1rem',
    },
    droppableBox: {
      position: 'relative',
      width: '16rem',
      minHeight: '220px', // カードの高さ + パディング
      border: '2px dashed var(--kure-blue-light)',
      borderRadius: '0.5rem',
      padding: '0.5rem',
    },
    choicesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)', // 5列のグリッド
      gap: '1rem',
      padding: '1rem',
      width: '100%',
    },
    draggableItemInChoices: {
      padding: '0.5rem',
      width: '100%',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
      height: '200px', // カードの高さを固定
    },
    cardImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover' as const,
      borderRadius: '0.25rem',
    },
    cardTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'white',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'var(--kure-navy)',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      justifyContent: 'center',
    },
    addButton: {
      backgroundColor: 'var(--kure-blue)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
    deleteButton: {
      border: '1px solid var(--kure-blue)',
      color: 'var(--kure-blue)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: 'transparent',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      width: '100%',
      gap: '2rem',
    },
    droppableContainer: {
      width: '100%',
      overflowX: 'auto',
    },
    droppableWrapper: {
      display: 'flex',
      minWidth: 'min-content',
      gap: '1.5rem',
      padding: '1rem',
    },
    draggableContent: {
      width: '100%',
      height: '100%',
    },
    draggableItem: {
      padding: '0.5rem',
      width: '100%',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
      height: '200px',
    },
    itemText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    },
    dropPlaceholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      color: 'var(--kure-blue)',
      opacity: 0.5,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="container-card">
        <h1 style={styles.title as React.CSSProperties}>呉市観光プランナー</h1>
        
        <div style={styles.buttonContainer}>
          <Button onClick={addPlan} style={styles.addButton}>
            <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
            プランを追加
          </Button>
          <Button onClick={deletePlan} style={styles.deleteButton}>
            <Minus style={{ width: '1.25rem', height: '1.25rem' }} />
            プランを削除
          </Button>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div style={styles.mainContent}>
            <div style={styles.scrollContainer as React.CSSProperties}>
              <div style={styles.timePickerAndDroppableWrapper}>
                {containers.map((id) => (
                  <div key={id} style={{ width: '16rem' }}>
                    <TimePickerContainer
                      containers={[id]}
                      family={family}
                      onTimeChange={handleTimeChange}
                    />
                    <Droppable id={id}>
                      <div style={styles.droppableBox as React.CSSProperties}>
                        {family.length > 0 ? (
                          (() => {
                            const foundItem = family.find((item) => item.parentId === id);
                            return foundItem ? (
                              <div style={styles.draggableContent}>
                                <Draggable key={foundItem.child?.location_name} id={foundItem.child?.location_name || ''}>
                                  <div style={styles.draggableItem} className="draggable-item">
                                    <img 
                                      src={foundItem.child?.image_url} 
                                      alt={foundItem.child?.location_name}
                                      style={styles.cardImage}
                                    />
                                    <div style={styles.cardTitle}>
                                      {foundItem.child?.location_name}
                                    </div>
                                  </div>
                                </Draggable>
                              </div>
                            ) : (
                              <div style={styles.dropPlaceholder as React.CSSProperties}>ここにドロップ</div>
                            );
                          })()
                        ) : (
                          <div style={styles.dropPlaceholder as React.CSSProperties}>ここにドロップ</div>
                        )}
                      </div>
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.choicesContainer}>
              {choices?.map((items: any) => (
                <Draggable key={items.location_name} id={items.location_name}>
                  <div className="draggable-item" style={styles.draggableItemInChoices}>
                    <img 
                      src={items.image_url} 
                      alt={items.location_name}
                      style={styles.cardImage}
                    />
                    <div style={styles.cardTitle}>
                      {items.location_name}
                    </div>
                  </div>
                </Draggable>
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
  
  function handleDragEnd(event: DragEndEvent) {
    const {over, active} = event;
    
    if (family.length === 0) {
      if (over) {
        setFamily((prevItems: any) => [
          ...prevItems, 
          {
            parentId: over.id,
            child: data.find((value:any) => value.location_name === active.id)
          }
        ]); 
        setChoices((prevItems: any) => 
          prevItems.filter((value:any) => value.location_name !== active.id)
        );
      }
    } else {
      if (family.find(item => item?.child?.location_name === active.id)) {
        if (!over) {
          // ドラッグ要素を選択肢に戻す処理
          setFamily((prevItems: any) => {
            // 削除される要素の情報を取得
            const itemToRemove = prevItems.find(
              (item:any) => item.child.location_name === active.id
            );
            
            if (!itemToRemove) return prevItems;
            
            const removedIndex = parseInt(itemToRemove.parentId.replace(/[^0-9]/g, ''), 10);
            const remainingItems = prevItems.filter(
              (item:any) => item.child.location_name !== active.id
            );
            
            // A1の要素が削除された場合は、残りの要素のインデックスを更新
            if (removedIndex === 1) {
              return remainingItems;
            }
            
            // それ以外の要素が削除された場合は、インデックスを振り直す
            const reindexedItems = remainingItems
              .sort((a:any, b:any) => {
                const aIndex = parseInt(a.parentId.replace(/[^0-9]/g, ''), 10);
                const bIndex = parseInt(b.parentId.replace(/[^0-9]/g, ''), 10);
                return aIndex - bIndex;
              })
              .map((item:any, index:any) => ({
                ...item,
                parentId: `A${index + 1}`
              }));
            
            return reindexedItems;
          });
          
          setChoices((prevItems: any) => [
            ...prevItems, 
            data.find((value:any) => value.location_name === active.id)
          ]); 
          
          // コンテナの更新（A1は削除しない）
          setContainers(prev => {
            const removedItemIndex = family.findIndex(
              item => item.child?.location_name === active.id
            );
            const isFirstContainer = family[removedItemIndex]?.parentId === 'A1';
            
            if (prev.length > 1 && !isFirstContainer) {
              const newContainers = prev.slice(0, -1);
              return newContainers.map((_, index) => `A${index + 1}`);
            }
            return prev;
          });
        } else if (family.find(item => item?.parentId === over?.id) === undefined) {
          // 別のドロップ先に移動する場合
          setFamily((prevItems: any) => 
            prevItems.map((item:any) => 
              item.child.location_name === active.id 
                ? {...item, parentId: over?.id} 
                : item
            )
          );
        } else {
          // 要素を入れ替える場合
          setFamily((prevItems: any) => {
            const afterStock = prevItems.find((obj:any) => obj.parentId === over?.id);
            const beforeStock = prevItems.find((obj:any) => 
              obj.child.location_name === active.id
            );
            
            if (afterStock && beforeStock) {
              return prevItems.map((obj:any) => 
                obj.parentId === afterStock.parentId 
                  ? {...obj, child: beforeStock.child}
                  : obj.parentId === beforeStock.parentId 
                    ? {...obj, child: afterStock.child}
                    : obj
              );
            }
            return prevItems;
          });
        }
      } else {
        if (over && family.find(familyItem => familyItem.parentId === over.id) === undefined) {
          setFamily((prevItems: any) => [
            ...prevItems, 
            {
              parentId: over?.id,
              child: data.find((value:any) => value.location_name === active.id)
            }
          ]);
          setChoices((prevItems: any) => 
            prevItems.filter((value:any) => value.location_name !== active.id)
          );
        }
      }
    }
  }
}
