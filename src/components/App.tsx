"use client";

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useState,useEffect } from 'react';
import Papa from "papaparse";
import { Button } from './ui/button';
import TimePicker from './TimePicker';
import TimePickerContainer from './TimePickerContainer';
import { Plus, Minus, PlusCircle, Trash2, MinusCircle } from 'lucide-react';

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
    controlButtons: {
      position: 'absolute',
      top: '-1.5rem',
      right: '0',
      display: 'flex',
      gap: '0.5rem',
      zIndex: 10,
    },
    controlButton: {
      padding: '0.25rem',
      borderRadius: '50%',
      cursor: 'pointer',
      backgroundColor: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '24px',
      height: '24px',
      minWidth: '24px',
      minHeight: '24px',
    },
    buttonIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  };

  // アルファベットのIDを生成する関数を追加
  const generateAlphabetId = (index: number): string => {
    return String.fromCharCode(65 + index); // 65は'A'のASCIIコード
  };

  const addPlanAfter = (currentId: string) => {
    const currentIndex = containers.indexOf(currentId);
    
    console.group('プラン追加処理の詳細');
    console.log('=== 追加前の状態 ===');
    console.log('🎯 ドラッグ先要素一覧:', containers);
    console.log('📍 登録済み観光情報:', family.map(item => ({
      ドラッグ先ID: item.parentId,
      観光地名: item.child?.location_name,
      時間: item.time
    })));
    console.log('➕ 追加位置のドラッグ先ID:', currentId);

    // コンテナの更新
    setContainers(prev => {
      const newContainers = [...prev];
      // 指定位置の後ろに新しいコンテナを挿入
      newContainers.splice(currentIndex + 1, 0, generateAlphabetId(currentIndex + 1));
      // それ以降のIDを更新
      const updatedContainers = newContainers.map((_, index) => generateAlphabetId(index));
      
      console.log('=== ドラッグ先要素の更新 ===');
      console.log('🎯 更新後のドラッグ先要素一覧:', updatedContainers);
      return updatedContainers;
    });

    // family配列の更新
    setFamily(prev => {
      // 追加位置より後ろの要素のIDを更新
      const updatedItems = prev.map(item => {
        const itemIndex = containers.indexOf(item.parentId || '');
        if (itemIndex === -1) return item;

        // 追加位置より後ろの要素は1つ後ろのアルファベットに更新
        if (itemIndex > currentIndex) {
          return {
            ...item,
            parentId: generateAlphabetId(itemIndex + 1)
          };
        }
        return item;
      });

      console.log('=== 登録済み観光情報の更新 ===');
      console.log('📍 更新後の観光情報:', updatedItems.map(item => ({
        ドラッグ先ID: item.parentId,
        観光地名: item.child?.location_name,
        時間: item.time
      })));

      console.log('=== 最終的な更新結果 ===');
      console.log('🎯 最終的なドラッグ先要素:', containers.map((_, i) => generateAlphabetId(i)));
      console.log('📍 最終的な登録済み観光情報:', updatedItems.map(item => ({
        ドラッグ先ID: item.parentId,
        観光地名: item.child?.location_name,
        時間: item.time
      })));
      console.groupEnd();
      return updatedItems;
    });
  };

  const removePlan = (containerId: string) => {
    if (containers.length <= 1) return;

    console.group('プラン削除処理の詳細');
    console.log('=== 削除前の状態 ===');
    console.log('🎯 ドラッグ先要素一覧:', containers);
    console.log('📍 登録済み観光情報:', family.map(item => ({
      ドラッグ先ID: item.parentId,
      観光地名: item.child?.location_name,
      時間: item.time
    })));
    console.log('🗑️ 削除対象のドラッグ先ID:', containerId);

    const removeIndex = containers.indexOf(containerId);

    // コンテナの更新
    setContainers(prev => {
      if (prev.length <= 1) return prev;
      // 削除後のコンテナを生成し、インデックスに基づいて新しいIDを割り当て
      const newContainers = prev
        .filter(id => id !== containerId)
        .map((_, index) => generateAlphabetId(index));
      
      console.log('=== ドラッグ先要素の更新 ===');
      console.log('🎯 更新後のドラッグ先要素一覧:', newContainers);
      return newContainers;
    });

    // family配列の更新
    setFamily(prev => {
      const itemToRemove = prev.find(item => item.parentId === containerId);
      console.log('=== 削除される観光情報 ===');
      console.log('📍 削除対象:', itemToRemove ? {
        ドラッグ先ID: itemToRemove.parentId,
        観光地名: itemToRemove.child?.location_name,
        時間: itemToRemove.time
      } : '登録なし');
      
      if (itemToRemove?.child) {
        setChoices((prevChoices: any) => {
          const isDuplicate = prevChoices.some(
            (choice: any) => choice.location_name === itemToRemove.child?.location_name
          );
          if (!isDuplicate) {
            const updatedChoices = [...prevChoices, itemToRemove.child];
            console.log('=== 選択肢に戻す観光情報 ===');
            console.log('🔄 選択肢に戻す観光地:', itemToRemove.child?.location_name);
            return updatedChoices;
          }
          return prevChoices;
        });
      }

      // 削除対象以外の要素を保持し、新しいIDを割り当て
      const remainingItems = prev.filter(item => item.parentId !== containerId);
      const updatedItems = remainingItems.map(item => {
        const currentIndex = containers.indexOf(item.parentId || '');
        if (currentIndex === -1) return item;
        
        // 削除位置より後ろの要素は1つ前のアルファベットに更新
        const newIndex = currentIndex > removeIndex 
          ? currentIndex - 1 
          : currentIndex;
        
        return {
          ...item,
          parentId: generateAlphabetId(newIndex)
        };
      });

      console.log('=== 残りの登録済み観光情報 ===');
      console.log('📍 更新後の観光情報:', updatedItems.map(item => ({
        ドラッグ先ID: item.parentId,
        観光地名: item.child?.location_name,
        時間: item.time
      })));

      console.log('=== 最終的な更新結果 ===');
      console.log('🎯 最終的なドラッグ先要素:', containers.filter(id => id !== containerId).map((_, i) => generateAlphabetId(i)));
      console.log('📍 最終的な登録済み観光情報:', updatedItems.map(item => ({
        ドラッグ先ID: item.parentId,
        観光地名: item.child?.location_name,
        時間: item.time
      })));
      console.groupEnd();
      return updatedItems;
    });
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
                        <div style={styles.controlButtons as React.CSSProperties}>
                          <button
                            style={styles.controlButton}
                            onClick={() => addPlanAfter(id)}
                            title="このプランの後に追加"
                          >
                            <div style={styles.buttonIcon}>
                              <PlusCircle size={16} color="var(--kure-blue)" />
                            </div>
                          </button>
                          {containers.length > 1 && (
                            <button
                              style={styles.controlButton}
                              onClick={() => removePlan(id)}
                              title="このプランを削除"
                            >
                              <div style={styles.buttonIcon}>
                                {/* <Trash2 size={16} color="var(--kure-red)" /> */}
                                <MinusCircle size={16} color="var(--kure-red)" />
                              </div>
                            </button>
                          )}
                        </div>
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
    
    console.group('ドラッグ&ドロップ操作の結果');
    console.log('=== 現在の状態 ===');
    console.log('🎯 ドラッグ先要素一覧:', containers);
    console.log('📍 登録済み観光情報:', family.map(item => ({
      ドラッグ先ID: item.parentId,
      観光地名: item.child?.location_name,
      時間: item.time
    })));
    console.groupEnd();
    
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
            
            const removedIndex = containers.indexOf(itemToRemove.parentId);
            const remainingItems = prevItems.filter(
              (item:any) => item.child.location_name !== active.id
            );
            
            // A1の要素が削除された場合は、残りの要素のインデックスを更新
            if (removedIndex === 0) {
              return remainingItems;
            }
            
            // それ以外の要素が削除された場合は、インデックスを振り直す
            const reindexedItems = remainingItems
              .sort((a:any, b:any) => {
                const aIndex = containers.indexOf(a.parentId);
                const bIndex = containers.indexOf(b.parentId);
                return aIndex - bIndex;
              })
              .map((item:any, index:any) => ({
                ...item,
                parentId: containers[index]
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
              return newContainers.map((_, index) => containers[index]);
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
