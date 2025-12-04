import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import mongoose from 'mongoose'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'

// PUT /api/habits/[id]/logs/[logId] - Update a habit log entry
export const PUT = secureEndpoint.mutation(
  async (
    request: NextRequest,
    context: SecurityContext,
    { params }: { params: Promise<{ id: string; logId: string }> }
  ): Promise<NextResponse> => {
    const { session } = context
    const { id, logId } = await params

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(logId)
    ) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { notes, value, completedAt } = body

    await connectDB()

    // Verify habit belongs to user
    const habit = await HabitModel.findOne({
      _id: id,
      userId: session!.user.id,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Find the log entry
    const log = await HabitLogModel.findOne({
      _id: logId,
      habitId: id,
      userId: session!.user.id,
    })

    if (!log) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    // Update the log entry
    const updateData: any = {}
    if (notes !== undefined) updateData.notes = notes
    if (value !== undefined) {
      // Validate value if habit has a target
      if (habit.target.type === 'counter' || habit.target.type === 'duration') {
        if (typeof value !== 'number' || value < 0) {
          return NextResponse.json(
            { error: 'Invalid value for this habit type' },
            { status: 400 }
          )
        }
      }
      updateData.value = value
    }
    if (completedAt !== undefined) {
      updateData.completedAt = new Date(completedAt)
    }

    const updatedLog = await HabitLogModel.findByIdAndUpdate(
      logId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    // Update habit's lastCompletedAt if this was the most recent completion
    if (
      completedAt &&
      new Date(completedAt) > new Date(habit.lastCompletedAt || 0)
    ) {
      await HabitModel.findByIdAndUpdate(id, {
        lastCompletedAt: new Date(completedAt),
      })
    }

    return NextResponse.json({
      message: 'Log updated successfully',
      log: updatedLog,
    })
  }
)

// DELETE /api/habits/[id]/logs/[logId] - Delete a habit log entry
export const DELETE = secureEndpoint.mutation(
  async (
    request: NextRequest,
    context: SecurityContext,
    { params }: { params: Promise<{ id: string; logId: string }> }
  ): Promise<NextResponse> => {
    const { session } = context
    const { id, logId } = await params

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(logId)
    ) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await connectDB()

    // Verify habit belongs to user
    const habit = await HabitModel.findOne({
      _id: id,
      userId: session!.user.id,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Find and delete the log entry
    const log = await HabitLogModel.findOneAndDelete({
      _id: logId,
      habitId: id,
      userId: session!.user.id,
    })

    if (!log) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    // Update habit's lastCompletedAt if we deleted the most recent completion
    if (
      log.completedAt &&
      habit.lastCompletedAt &&
      new Date(log.completedAt).getTime() ===
        new Date(habit.lastCompletedAt).getTime()
    ) {
      // Find the new most recent completion
      const mostRecentLog = await HabitLogModel.findOne({
        habitId: id,
        userId: session!.user.id,
        completed: true,
      })
        .sort({ completedAt: -1 })
        .limit(1)

      await HabitModel.findByIdAndUpdate(id, {
        lastCompletedAt: mostRecentLog?.completedAt || null,
      })
    }

    return NextResponse.json({
      message: 'Log deleted successfully',
    })
  }
)
