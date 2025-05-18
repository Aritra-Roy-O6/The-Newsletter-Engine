import { ChangeEvent, MouseEvent } from 'react';

export type ChangeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type MouseEventHandler = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void; 