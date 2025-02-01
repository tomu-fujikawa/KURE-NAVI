"use client";

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useState,useEffect } from 'react';
import Papa from "papaparse";

interface data {
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
}
interface family {
  parentId?: string;
  child?: data;
}

export default function Page({label}:any) {
    const [data, setData] = useState<data[]>([]);
    const [choices, setChoices] = useState<any>();
    useEffect(() => {
      // fetch("/locations.csv")
      //     .then((response) => response.text())
      //     .then((csvText) => {
      //         const parsedData = Papa.parse<spot>(csvText, {
      //             header: true,
      //             skipEmptyLines: true,
      //             dynamicTyping: { age: true },
      //         });
  
      //         setData(parsedData.data);
      //     })
      //     .catch((error) => console.error("Error fetching CSV:", error));
     const data = [{
        image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%95%E6%88%B8.png",
        latitude
        : 
        34.16246,
        location_name
        : 
        "A",
        longitude
        : 
        132.83784},
        {
          image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%95%E6%88%B8.png",
          latitude
          : 
          34.16246,
          location_name
          : 
          "B",
          longitude
          : 
          132.83784},
          {
            image_url:"https://api.expolis.cloud/assets/opendata/t/kure/png/islands-sightseeing-1/%E6%B2%96%E5%8F%8B9_%E4%BA%94%E8%A7%92%E3%81%AE%E4%BA%95%E6%88%B8.png",
            latitude
            : 
            34.16246,
            location_name
            : 
            "C",
            longitude
            : 
            132.83784}];
      setChoices(data);
      setData(data);

  }, []);
  const containers = ['A', 'B', 'C'];
  const [family, setFamily] = useState<family[]>([]);

  console.log("data",data);
console.log("choices",choices);
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='flex flex-col justify-center items-center w-screen h-screen gap-8'>
         {/* ドロップするコンテナ３個横並び */}
        <div className='flex'>
          {containers.map((id) => (
            <Droppable key={id} id={id} isOverAddClass="bg-green-700">
              <div className='w-52 h-24 border-2 border-dashed border-gray-100/50 flex justify-center items-center'>
                {family.length > 0 ? (
                (() => {
                  const foundItem = family.find((familyItem: any) => familyItem.parentId === id);
                  return foundItem ? (
                    <Draggable key={foundItem.child?.location_name} id={String(foundItem.child?.location_name)}>
                    <div key={foundItem.child?.location_name} id={foundItem.child?.location_name} className='cursor-grab w-48 h-20 bg-blue-200 flex justify-center items-center'>
                      {foundItem.child?.location_name}
                    </div>
                  </Draggable>
                  ) : 'Drop here';
                })()
              ) : 'Drop here'}
              </div>
            </Droppable>
          ))}
        </div>
                 {/* ドラッグするアイテム */}
                 <div className='flex h-20'>
          {choices?.map((items:any)=>{
            return(
              <Draggable key={items.location_name} id={items.location_name}>
              <div key={items.location_name} id={items.location_name} className='cursor-grab w-48 h-20 bg-blue-200 flex justify-center items-center'>
                {items.location_name}
              </div>
            </Draggable>
            )
          })}
        </div>
      </div>

      <div>
            <h1>CSV Data</h1>
            <ul>
                {data.map((spot:any, index:number) => (
                    <li key={index}>
                        {spot.location_name} - {spot.latitude} - {spot.longitude} - {spot.image_url}
                    </li>
                ))}
            </ul>
        </div>
    </DndContext>
  );
  
  function handleDragEnd(event: DragEndEvent) {
    const {over,active} = event;
    console.log("over",over);
    console.log("active",active);
    if(family.length === 0){
      if(over == null){}else{
        console.log("aaa");
        setFamily((prevItems: any) => [...prevItems, {parentId:over?.id,child: data.find((value:any) => value.location_name === active.id)}]); 
        setChoices((prevItems: any) => prevItems.filter((value:any) => value.location_name !== active.id));
      }
    }else {
      if(family.find(item=>item?.child?.location_name === active.id)){
        if(over == null){
          console.log("bbb");
          setFamily((prevItems: any) => prevItems.filter((item:any) => item.child.location_name !== active.id));
          setChoices((prevItems: any) => [...prevItems, data.find((value:any) => value.location_name === active.id)]); 
        }else if(family.find(item=>item?.parentId == over?.id) == undefined){
          console.log("ccc");
          setFamily((prevItems: any) => prevItems.map((item:any) => item.child.location_name === active.id ? {...item,parentId:over?.id} : item));
      }else{
        console.log("ddd");
        setFamily((prevItems: any) =>{
          const afterStock = prevItems.find((obj:any)=>obj.parentId === over?.id);
          const beforeStock = prevItems.find((obj:any)=>obj.child.location_name === active.id);
          console.log("afterStock.child",afterStock.child);
          console.log("beforeStock.child",beforeStock.child);
          if(afterStock && beforeStock){
            return prevItems.map((obj:any)=> obj.parentId === afterStock.parentId ? {...obj,child:beforeStock.child}: obj.parentId === beforeStock.parentId ? {...obj,child:afterStock.child}: obj);
          }
          return prevItems;
        })
      }
      }else{
        if(over == null){

        }else if(family.find(familyItem=>familyItem.parentId === over.id) !== undefined){
          console.log("eee");

        }else{
          console.log("family",family);
          console.log("active.id_family",active.id);
          console.log("fff");
          console.log("family.find(familyItem=>familyItem.child?.location_name === active.id)",family.find(familyItem=>familyItem.child?.location_name === active.id));
          setFamily((prevItems: any) => [...prevItems, {parentId:over?.id,child: data.find((value:any) => value.location_name === active.id)}]);
          setChoices((prevItems: any) => prevItems.filter((value:any) => value.location_name !== active.id));
        }
      }
    }
  }
}
