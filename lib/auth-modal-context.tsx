'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthModalContextType {
  isOpen: boolean
  modalType: 'login' | 'signup' | 'accountType' | null
  accountType: 'general' | 'company'
  openModal: (type: 'login' | 'signup' | 'accountType') => void
  closeModal: () => void
  setAccountType: (type: 'general' | 'company') => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalType, setModalType] = useState<'login' | 'signup' | 'accountType' | null>(null)
  const [accountType, setAccountType] = useState<'general' | 'company'>('general')

  const openModal = (type: 'login' | 'signup' | 'accountType') => {
    setModalType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalType(null)
  }

  return (
    <AuthModalContext.Provider value={{ isOpen, modalType, accountType, openModal, closeModal, setAccountType }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}