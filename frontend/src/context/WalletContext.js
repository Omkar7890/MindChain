// src/context/WalletContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BackendUrl } from '../data/const'

export const WalletContext = createContext()

const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState(0)
  const [pyusdBalance, setPyusdBalance] = useState(0)
  const [user, setUser] = useState({})

  const createUser = async (address) => {
    const response = await axios.post(`${BackendUrl}/user/create-user`, {
      address,
    })
    if (response.status === 201) {
      return response.data.user
    }
    throw new Error('Unable to create user')
  }

  const fetchUser = async (address) => {
    const response = await axios.get(`${BackendUrl}/user/profile`, {
      params: { address },
    })
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Unable to fetch user profile')
  }

  const connectWallet = useCallback(async () => {
    const enteredAddress = window.prompt(
      'Enter a username or email to sign in to MindChain:'
    )
    if (!enteredAddress) {
      toast.error('Sign in cancelled.')
      return
    }

    const normalizedAddress = enteredAddress.trim()
    if (!normalizedAddress) {
      toast.error('Please enter a valid username or email.')
      return
    }

    try {
      const existingUser = await fetchUser(normalizedAddress).catch(() => null)
      const userData = existingUser || (await createUser(normalizedAddress))
      setWalletAddress(normalizedAddress)
      setUser(userData)
      setBalance(userData.soulBalance || 0)
      setPyusdBalance(userData.pyusdBalance || 0)
      toast.success('Signed in successfully!', {
        toastId: 'connect',
      })
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Unable to sign in. Please try again.')
    }
  }, [])

  const fetchBalance = async () => {
    if (!walletAddress) return
    try {
      const userData = await fetchUser(walletAddress)
      setUser(userData)
      setBalance(userData.soulBalance || 0)
      setPyusdBalance(userData.pyusdBalance || 0)
      return userData
    } catch (error) {
      toast.error('Error fetching user data!')
    }
  }

  const earnTokens = useCallback(
    async (token = 'Activity') => {
      if (!walletAddress) {
        throw { code: 'WALLET_NOT_CONNECTED' }
      }
      try {
        const transactionHash = `tx-${Date.now()}-${Math.floor(
          Math.random() * 1000000
        )}`
        const response = await axios.post(`${BackendUrl}/transaction/token`, {
          transactionHash,
          token,
          address: walletAddress,
        })
        if (response.status === 201) {
          const updatedUser = response.data.user
          setUser(updatedUser)
          setBalance(updatedUser.soulBalance || 0)
          setPyusdBalance(updatedUser.pyusdBalance || 0)
          return true
        }
      } catch (error) {
        console.error('Error earning tokens:', error)
        throw error
      }
    },
    [walletAddress]
  )

  const purchaseWorkshop = async (token, amount, workshopId) => {
    if (!walletAddress) {
      throw new Error('Please sign in before purchasing.')
    }
    if (!workshopId) {
      throw new Error('Workshop ID is required.')
    }
    try {
      const transactionHash = `tx-${Date.now()}-${Math.floor(
        Math.random() * 1000000
      )}`
      const response = await axios.post(`${BackendUrl}/transaction/workshop`, {
        transactionHash,
        workshopId,
        address: walletAddress,
        amount,
        token,
      })
      if (response.status === 201) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        setBalance(updatedUser.soulBalance || 0)
        setPyusdBalance(updatedUser.pyusdBalance || 0)
        return response.data
      }
    } catch (error) {
      console.error('Error purchasing workshop:', error)
      throw error
    }
  }

  const approveTokens = async () => {
    return true
  }

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null)
    setBalance(0)
    setPyusdBalance(0)
    setUser({})
    toast.info('Signed out successfully!', {
      toastId: 'disconnect',
    })
  }, [])

  useEffect(() => {
    if (walletAddress) {
      fetchBalance()
    }
  }, [walletAddress])

  return (
    <WalletContext.Provider
      value={{
        approveTokens,
        pyusdBalance,
        walletAddress,
        balance,
        connectWallet,
        disconnectWallet,
        fetchBalance,
        earnTokens,
        purchaseWorkshop,
        user,
        setUser,
      }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
