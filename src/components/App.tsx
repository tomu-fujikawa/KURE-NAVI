"use client";

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useState,useEffect, useMemo } from 'react';
import Papa from "papaparse";
import { Button } from './ui/button';
import TimePicker from './TimePicker';
import TimePickerContainer from './TimePickerContainer';
import { Plus, Minus, PlusCircle, Trash2, MinusCircle } from 'lucide-react';
import db from '../firebase';
import { collection, getDocs, addDoc } from "firebase/firestore";  


interface data {
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  explanation: string;
  tag: string;
}
interface family {
  parentId?: string;
  child?: data;
  time?: string;
}

const AVAILABLE_TAGS = ['歴史', '自然', '建築', '庭園', '神社', '絶景', 'グルメ', '温泉'] as const;
type Tag = typeof AVAILABLE_TAGS[number];

export default function Page({label}:any) {
    const [data, setData] = useState<data[]>([]);
    const [choices, setChoices] = useState<any>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [family, setFamily] = useState<family[]>([]);
    const [containers, setContainers] = useState<string[]>(['A']);
    const [showAllCards, setShowAllCards] = useState(false);
    // 検索用の状態を追加
    const [searchQuery, setSearchQuery] = useState('');
    const CARDS_PER_ROW = 5;
    const INITIAL_ROWS = 3;
    const ROW_INCREMENT = 3;
    const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
    const [sightseeingCourse, setSightseeingCourse] = useState<any[]>([]);
    const [tripTitle, setTripTitle] = useState("");
    
    useEffect(() => {
      fetch("/locations2.csv")
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

      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "posts"));
          const sightseeingData: any[] = [];
          querySnapshot.forEach((doc) => {
            sightseeingData.push({ id: doc.id, ...doc.data() });
          });
          setSightseeingCourse(sightseeingData);
          console.log("sightseeingCourse",sightseeingCourse);
        } catch (error) {
          console.error("Error fetching sightseeing:", error);
        }
      };

      fetchUsers();
    }, []);

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
      gridTemplateColumns: 'repeat(5, 200px)', // ✅ 5列固定、カードの幅を一定にする
      justifyContent: 'center', // ✅ 5個未満でも中央配置
      gap: '1rem',
      padding: '1rem',
      transition: 'all 0.3s ease',
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
      height: '65%', // ✅ カードの高さに対して50%に統一
      objectFit: 'cover', // ✅ 画像が適切にトリミングされる
      borderRadius: '0.25rem',
    },
    cardTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
      width: '100%',
      padding: '0 0.5rem',
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
      height: '200px', // ✅ カード全体の高さ
      transition: 'transform 0.3s ease',
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
    },
    distanceLabel: {
      position: 'absolute' as 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      color: 'var(--kure-blue)',
      fontWeight: 'bold' as 'bold',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      border: '2px solid var(--kure-blue)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.3s ease',
      zIndex: 10,
      ':hover': {
        transform: 'scale(1.05)',
      }
    },
    distanceIcon: {
      width: '14px',
      height: '14px',
      marginRight: '2px',
    },
    tagContainer:{
      width: '100%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '2rem',
      flexWrap: 'wrap' as const,
      paddingLeft: '1rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--kure-navy)',
    },
    tagTitleContainer:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.1rem',
      flexWrap: 'wrap' as const,
    },
    tagTitle:{
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'var(--kure-navy)',
    },
    underline:{
      width: '100%',
      height: '4px',
      backgroundColor: 'var(--kure-navy)',
    },
    showMoreButton: {
      backgroundColor: 'var(--kure-blue)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
      transition: 'all 0.3s ease',
    },showLessButton: {
      backgroundColor: 'white',
      border: '1px solid var(--kure-blue)',
      color: 'var(--kure-blue)',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
      transition: 'all 0.3s ease',
    },
    buttonWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1rem',
      gap: '1rem',
    },filterContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    },
    searchContainer: {
      position: 'relative' as const,
    },
    searchInput: {
      padding: '0.5rem 1rem',
      paddingLeft: '2.5rem', // アイコンのスペースを確保
      borderRadius: '9999px',
      border: '2px solid var(--kure-blue)',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      width: '250px', // 幅を調整
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--kure-blue)',
      width: '1.25rem',
      height: '1.25rem',
    },sightseeing_courseContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 200px)", // 5列のグリッド
      justifyContent: "center",
      gap: "1rem",
      padding: "1rem",
    },
    sightseeing_card: {
      padding: "0.5rem",
      width: "200px",
      textAlign: "center" as const,
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.5rem",
      height: "200px",
      transition: "transform 0.3s ease",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      overflow: "hidden",
    },
    sightseeing_cardImage: {
      width: "100%",
      height: "50%",
      objectFit: "cover",
      borderRadius: "8px 8px 0 0",
    },
    sightseeing_cardTitle: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "black",
      height: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem",
    },

  };

// フィルタリングロジックの更新
const filteredChoices = useMemo(() => {
  if (!choices) return [];
  
  return choices.filter((item: data) => {
    // タグフィルター
    const passesTagFilter = selectedTags.length === 0 || (
      item.tag && selectedTags.every(tag => item.tag.split(', ').includes(tag))
    );
    
    // 検索フィルター
    const passesSearchFilter = !searchQuery || (
      item.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    return passesTagFilter && passesSearchFilter;
  });
}, [choices, selectedTags, searchQuery]);

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

  // 2点間の距離を計算する関数（ヘーベルサイン公式）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 指定した位置から近い順に観光情報をソートする関数
  const sortByDistance = (targetLat: number, targetLon: number, items: any[]) => {
    return [...items].sort((a, b) => {
      const distanceA = calculateDistance(targetLat, targetLon, a.latitude, a.longitude);
      const distanceB = calculateDistance(targetLat, targetLon, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  };

  // 距離表示用のコンポーネントを改善
  const DistanceLabel = ({ distance }: { distance: number }) => (
    <div style={styles.distanceLabel}>
      <svg 
        style={styles.distanceIcon} 
        viewBox="0 0 24 24" 
        fill="var(--kure-blue)"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      {distance < 1 
        ? `${(distance * 1000).toFixed(0)}m` 
        : `${distance.toFixed(1)}km`
      }
    </div>
  );

  // ドラッグ可能なアイテムをクリックした時のハンドラーを追加
  const handleItemClick = (item: any) => {
    if (!item || !item.child) return;

    const targetLat = item.child.latitude;
    const targetLon = item.child.longitude;
    
    // 未登録の観光情報を距離でソート
    const sortedChoices = sortByDistance(targetLat, targetLon, choices);
    setChoices(sortedChoices);
    
    console.log('=== クリックした観光地からの距離順にソート ===');
    console.log('📍 基準位置:', {
      観光地名: item.child.location_name,
      緯度: targetLat,
      経度: targetLon
    });
    console.log('📊 ソート結果:', sortedChoices.map(choice => ({
      観光地名: choice.location_name,
      距離: calculateDistance(targetLat, targetLon, choice.latitude, choice.longitude).toFixed(2) + 'km'
    })));
  };

  const TagFilter = () => {
    const styles = {
      container: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
      },
      tag: {
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
      activeTag: {
        backgroundColor: 'var(--kure-blue)',
        color: 'white',
      },
      inactiveTag: {
        backgroundColor: 'var(--kure-blue-light)',
        color: 'var(--kure-blue)',
      },
    };

    return (
      <div style={styles.container}>
        {AVAILABLE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            style={{
              ...styles.tag,
              ...(selectedTags.includes(tag) ? styles.activeTag : styles.inactiveTag),
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    );
  };
  useEffect(() => {
    console.log("🚀 選択されたタグ:", selectedTags);
    console.log("🎯 フィルター適用前のデータ:", choices);
    console.log("✅ フィルター適用後のデータ:", filteredChoices);
  }, [filteredChoices, choices, selectedTags]);

  // ボタンのクリックハンドラー
  const handleShowMore = () => {
    setVisibleRows(prev => prev + ROW_INCREMENT);
  };

  const handleShowLess = () => {
    setVisibleRows(prev => Math.max(INITIAL_ROWS, prev - ROW_INCREMENT));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="container-card">
        <h1 style={styles.title as React.CSSProperties}>Kure-NAVI</h1>
        
        <div style={{display:"flex", flexDirection:"row", alignItems:"center",gap:"52px", paddingLeft:"16px"}}>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center",gap:"40px", paddingLeft:"16px"}}>
                    {/* 🔍 タイトル入力欄 */}
            <input
              type="text"
              placeholder="旅のタイトルを入力"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "2px solid var(--kure-blue)",
                outline: "none",
                width: "350px",
              }}
            />
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
          </div>
          <Button onClick={deletePlan} style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            width: "200px",
            height: "100px",
          }}>
                プランを登録
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
                                  <div 
                                    style={styles.draggableItem} 
                                    className="draggable-item"
                                    onClick={() => handleItemClick(foundItem)}
                                  >
                                    <img 
                                      src={foundItem.child?.image_url} 
                                      alt={foundItem.child?.location_name}
                                      style={styles.cardImage as React.CSSProperties}
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
            <div>
            <div style={styles.tagContainer as React.CSSProperties}>
                <div style={styles.tagTitleContainer}>
                <div style={styles.tagTitle}>観光地リスト</div>
                <div style={styles.underline}></div>
                </div>
                {/* フィルターと検索のコンテナ */}
      <div style={styles.filterContainer}>
        {/* タグフィルター */}
        <TagFilter />
        
        {/* 検索欄 */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="観光地を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <svg
            style={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>
              </div>
              <div style={styles.choicesContainer}>
              {filteredChoices && filteredChoices
                .map((item: any) => {
                  const referencePoint = family.length > 0 
                    ? family[family.length - 1].child 
                    : null;
                  
                  const distance = referencePoint 
                    ? calculateDistance(
                        referencePoint.latitude,
                        referencePoint.longitude,
                        item.latitude,
                        item.longitude
                      )
                    : Infinity;

                  return {
                    ...item,
                    distance
                  };
                })
                .sort((a: any, b: any) => a.distance - b.distance)
                // 表示数を制限
                .slice(0, CARDS_PER_ROW * visibleRows)
                .map((item: any) => (
                  <Draggable key={item.location_name} id={item.location_name}>
                    <div 
                      style={{
                        ...styles.draggableItem,
                        position: 'relative',
                        cursor: 'grab',
                      }} 
                      className="draggable-item"
                    >
                      <img 
                        src={item.image_url} 
                        alt={item.location_name}
                        style={styles.cardImage as React.CSSProperties}
                      />
                      <div style={styles.cardTitle} title={item.location_name}>
                        {item.location_name}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '0.25rem',
                        fontSize: '0.75rem',
                      }}>
                        {item.tag && item.tag.split(', ').map((tag: string) => (
                          <span
                            key={tag}
                            style={{
                              backgroundColor: 'var(--kure-blue-light)',
                              color: 'var(--kure-blue)',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.625rem',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {item.distance !== Infinity && (
                        <DistanceLabel distance={item.distance} />
                      )}
                    </div>
                  </Draggable>
                ))}
            </div>
            </div>
            
          </div>
        </DndContext>
        {/* ボタンコントロール */}
        <div style={styles.buttonWrapper}>
           {/* もっと見るボタン - まだ表示できるカードが残っているときのみ表示 */}
           {filteredChoices && 
           filteredChoices.length > CARDS_PER_ROW * visibleRows && (
            <button
              onClick={handleShowMore}
              style={styles.showMoreButton}
              className="hover:shadow-lg hover:-translate-y-1"
            >
              もっと見る
            </button>
          )}
          {/* 表示を減らすボタン - 6行以上表示されているときのみ表示 */}
          {visibleRows > INITIAL_ROWS && (
            <button
              onClick={handleShowLess}
              style={styles.showLessButton}
              className="hover:shadow-lg hover:-translate-y-1 mr-2"
            >
              表示を減らす
            </button>
          )}
        </div>
        <div style={{display:"flex", flexDirection:"column",marginTop:"108px"}}>
        <div style={styles.tagContainer as React.CSSProperties}>
                <div style={{...styles.tagTitleContainer, paddingLeft:"6px"}}>
                <div style={styles.tagTitle}>みんなの観光</div>
                <div style={styles.underline}></div>
                </div>
                {/* フィルターと検索のコンテナ */}
              </div>
        <div style={styles.sightseeing_courseContainer}>
        {sightseeingCourse.map((course: any, courseIndex: number) => (
  <div key={"course" + courseIndex}>
    <h2 style={{fontSize:"24px", fontWeight:"bold", color:"var(--kure-blue)"}}>{course.title}</h2>
    {course.destinations.map((destination: any, index: number) => (
      <div key={"sightseeing" + courseIndex + index} style={styles.sightseeing_card}>
        <img 
          src={destination?.image_url} 
          alt={destination.title} 
          style={styles.sightseeing_cardImage as React.CSSProperties} 
        />
        <div style={styles.sightseeing_cardTitle}>{destination?.location_name}</div>
      </div>
    ))}
  </div>
))}
</div>
        </div>

        {/* // ✅ `sightseeingCourse` をカードデザインで表示 */}

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
