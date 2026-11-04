'use client';
import {useEffect} from 'react';
import {mountStoryMotion} from '@/lib/story-motion';
import {mountLabCursor} from '@/lib/lab-cursor';

export function StoryMotion(){
  useEffect(()=>{const root=document.querySelector<HTMLElement>('[data-story-root]');if(!root)return;const stopMotion=mountStoryMotion(root),stopCursor=mountLabCursor(root);return ()=>{stopCursor();stopMotion();};},[]);
  return null;
}
