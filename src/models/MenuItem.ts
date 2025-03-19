// import type mongoose from "mongoose"
import { Schema, model } from "mongoose"
import mongoose from "mongoose"

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId | string
  name: string
  description: string
  price: number
  categoryId: mongoose.Types.ObjectId | string
  ingredients?: string
  image?: string
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ingredients: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
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

export const MenuItem = mongoose.models?.MenuItem || model<IMenuItem>("MenuItem", menuItemSchema)

