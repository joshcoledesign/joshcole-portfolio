'use client';
import {useEffect} from 'react';
import {mountStoryMotion} from '@/lib/story-motion';

export function StoryMotion(){
  useEffect(()=>{const root=document.querySelector<HTMLElement>('[data-story-root]');if(root)return mountStoryMotion(root);},[]);
  return null;
}
