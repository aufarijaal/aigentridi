"use client";
import Image from "next/image";
import React from "react";

const ListItem = (image: any) => {
  return (
    <a className="flex flex-col gap-4 group" href={image.src} download={`${image.name}.png`}>
      <div className="bg-none group-hover:bg-base-200/50 group-active:scale-95 transition rounded-xl p-2">
        <Image alt={image.name} width="150" height="150" src={image.src} />
      </div>
      <span className="text-gray-400 text-sm">{image.name}</span>
    </a>
  );
};

export default ListItem;
