// import type mongoose from "mongoose"
import { Schema, model } from "mongoose"
import mongoose from "mongoose"

export interface IPriceListItem {
  subItem: string,
  price: number
}

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId | string
  name: string
  description?: string
  iconName?: string
  price?: number // Make the single price optional
  priceList?: IPriceListItem[] // Add the price list array
  categoryId: mongoose.Types.ObjectId | string
  ingredients?: string
  image?: string
  order?: number
  available: boolean
  createdAt?: Date
  updatedAt?: Date
}

const priceListItemSchema = new Schema<IPriceListItem>(
  {
    subItem: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
) // Don't create IDs for embedded documents

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String},
    iconName: {type: String},
    price: { type: Number }, // Make single price optional
    priceList: [priceListItemSchema], // Add the price list array
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ingredients: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
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

