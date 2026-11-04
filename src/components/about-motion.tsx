'use client';
import {useEffect} from 'react';
import {mountStoryMotion} from '@/lib/story-motion';

export function AboutMotion(){
  useEffect(()=>{const root=document.querySelector<HTMLElement>('[data-about-motion]');if(root)return mountStoryMotion(root);},[]);
  return null;
}
