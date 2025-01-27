import { v2 as cloudinary } from "cloudinary";

export default class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  async deleteResource(publicId: string): Promise<string> {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result;
  }
}
