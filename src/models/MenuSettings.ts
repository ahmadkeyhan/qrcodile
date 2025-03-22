import { Schema, model, models } from "mongoose";

export interface IMenuSettings {
  _id?: string;
  title: string;
  description: string;
  updatedAt?: Date;
}

const menuSettingsSchema = new Schema<IMenuSettings>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const MenuSettings =
  models.MenuSettings ||
  model<IMenuSettings>("MenuSettings", menuSettingsSchema);
