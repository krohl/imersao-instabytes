import { Storage } from "@google-cloud/storage";

const storage = new Storage();

export default class StorageService {
  bucket = 'krohlog';

  getFile(src) {
    return storage.bucket(this.bucket).file(src);
  }

  async uploadFile(src, dst) {
    const options = { destination: dst };

    await storage.bucket(this.bucket).upload(src, options);
  }

  async getUrl(fileName, folder) {
    const [url] = await storage.bucket(this.bucket)
      .file(`${folder}/${fileName}`)
      .getSignedUrl({ expires: (new Date()).getTime() + 3600000, action: 'read', version: 'v2' });
    return url;
  }

  async deleteFile(src) {
    await storage.bucket(this.bucket).file(src).delete();
  }
}
