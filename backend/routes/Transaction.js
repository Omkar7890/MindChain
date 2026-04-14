import { Router } from 'express'
import Transaction from '../model/Transaction.js'
import User from '../model/User.js'
import Workshop from '../model/WorkShop.js'
const router = Router()

router.post('/workshop', async (req, res) => {
  try {
    const { transactionHash, workshopId, address, amount, token } = req.body

    if (!transactionHash || !workshopId || !address || amount == null) {
      return res
        .status(400)
        .json({ message: 'Required fields are missing for workshop purchase' })
    }

    const workshop = await Workshop.findById(workshopId)
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' })
    }

    const user = await User.findOne({ walletAddress: address })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const tokenAmount = Number(token) || 0
    if (tokenAmount > user.soulBalance) {
      return res.status(400).json({ message: 'Insufficient Soul token balance' })
    }

    const purchaseAmount = Number(amount)
    const workshopTransaction = new Transaction({
      transactionHash,
      type: 'workshop',
      token: workshop.title || 'Workshop',
      workshop: workshopId,
      amount: purchaseAmount,
      transactionType: 'debit',
    })

    user.transactions.push(workshopTransaction._id)
    user.purchasedWorkshops.push(workshopId)
    user.soulBalance -= tokenAmount
    if (user.soulBalance < 0) {
      user.soulBalance = 0
    }

    await workshopTransaction.save()

    if (tokenAmount > 0) {
      const tokenTransaction = new Transaction({
        transactionHash: `${transactionHash}-token`,
        type: 'token',
        token: 'Tokens Redeemed',
        amount: tokenAmount,
        transactionType: 'debit',
      })
      await tokenTransaction.save()
      user.transactions.push(tokenTransaction._id)
    }

    await user.save()

    res.status(201).json({ transaction: workshopTransaction, workshop, user })
  } catch (error) {
    console.error('Error creating workshop transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/token', async (req, res) => {
  try {
    const { transactionHash, token, address } = req.body
    if (!transactionHash || !address) {
      return res
        .status(400)
        .json({ message: 'Transaction hash and address are required' })
    }

    const user = await User.findOne({ walletAddress: address })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const rewardAmount = 10
    const transaction = new Transaction({
      transactionHash,
      type: 'token',
      token: token || 'Activity Reward',
      amount: rewardAmount,
      transactionType: 'credit',
    })

    await transaction.save()
    user.transactions.push(transaction._id)
    user.soulBalance += rewardAmount
    await user.save()

    res.status(201).json({ transaction, user })
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router

