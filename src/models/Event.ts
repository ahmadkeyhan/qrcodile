import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

export interface IEvent {
  _id?: string
  name: string
  description: string
  image?: string
  ticketPrice: number
  startDate: Date
  endDate: Date
  location: string
  createdAt?: Date
  updatedAt?: Date
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    ticketPrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

export const Event = mongoose.models?.Event || model<IEvent>("Event", eventSchema)

