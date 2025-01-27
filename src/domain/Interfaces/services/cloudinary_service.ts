export default interface CloudinaryService {
    deleteResource(publicId: string): Promise<string>;
  }