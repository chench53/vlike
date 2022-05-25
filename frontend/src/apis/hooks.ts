import { createContext, useState } from 'react';

interface contractType {
  contractAddress: string
}

export const ratingContractContext = createContext<contractType>({
  contractAddress: '',
});

interface useTokenType {
  balance: number,
  refreshToken?: () => void,
}

export const useTokenContext = createContext<useTokenType>({
  balance: 0,
});

interface msgType {
  open: boolean,
  text?: string,
  type?: 'error'
  | 'info'
  | 'success'
  | 'warning',
  show: (text: string, type: 'error'
  | 'info'
  | 'success'
  | 'warning') => void,
  close?: () => void,
}

export const useMsg = () => {
  
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<'error'
  | 'info'
  | 'success'
  | 'warning'>('info');

  const show = (text: string, type: 'error'
    | 'info'
    | 'success'
    | 'warning') => {
    setOpen(true)
    setText(text);
    setType(type);
  }
  const close = () => {
    setOpen(false);
  }
  
  return {
    open,
    text,
    type,
    show,
    close,
  }
}

export const msgContext = createContext<msgType>({
  open: false,
  show: (arg0, arg1) => {}
})