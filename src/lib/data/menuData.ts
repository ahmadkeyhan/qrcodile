"use server";

import connectToDatabase from "../mongodb";
import { MenuSettings, type IMenuSettings } from "../../models/MenuSettings";

// Get menu settings
export async function getMenuSettings() {
  try {
    await connectToDatabase();

    // Try to get existing settings
    let settings = await MenuSettings.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await MenuSettings.create({
        title: "منوی کافه",
        description:
          "مجموعه‌ای از نوشیدنی‌ها و خوراکی‌های ما را که با عشق و بهترین مواد اولیه درست شده‌اند، کاوش کنید.",
      });
    }

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("خطا:", error);
    // Return default settings if there's an error
    return {
      title: "منوی کافه",
      description:
        "مجموعه‌ای از نوشیدنی‌ها و خوراکی‌های ما را که با عشق و بهترین مواد اولیه درست شده‌اند، کاوش کنید.",
    };
  }
}

// Update menu settings
export async function updateMenuSettings(settingsData: Partial<IMenuSettings>) {
  try {
    await connectToDatabase();

    // Find existing settings or create new ones
    let settings = await MenuSettings.findOne();

    if (settings) {
      // Update existing settings
      settings = await MenuSettings.findByIdAndUpdate(
        settings._id,
        { $set: settingsData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new settings
      settings = await MenuSettings.create(settingsData);
    }

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("خطا:", error);
    throw new Error("Failed to update menu settings");
  }
}
