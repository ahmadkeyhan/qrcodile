import connectToDatabase from "./mongodb"
import { User } from "../models/User"

async function seedAdminUser() {
  try {
    await connectToDatabase()

    // Check if admin user already exists
    const adminExists = await User.findOne({ name: "adminUser" })

    if (adminExists) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const adminUser = new User({
      name: "adminUser",
    //   email: "admin@example.com",
      password: "admin123", // This will be hashed by the pre-save hook
      role: "admin",
    })

    await adminUser.save()
    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error seeding admin user:", error)
  }
}

export default seedAdminUser

