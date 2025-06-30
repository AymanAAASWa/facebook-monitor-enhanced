export class LargeFilePhoneSearcher {
  private worker: Worker | null = null
  private phoneIndex: Map<string, number> = new Map()
  private fileBuffer: ArrayBuffer | null = null
  private isIndexed = false

  constructor() {
    if (typeof Worker !== "undefined") {
      const workerCode = `
        let phoneIndex = new Map();
        let fileBuffer = null;
        
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          if (type === 'INDEX_FILE') {
            try {
              fileBuffer = data.buffer;
              const text = new TextDecoder().decode(fileBuffer);
              const phoneData = JSON.parse(text);
              
              phoneIndex.clear();
              let position = 0;
              
              for (const [userId, phone] of Object.entries(phoneData)) {
                phoneIndex.set(userId, position);
                position++;
              }
              
              self.postMessage({
                type: 'INDEX_COMPLETE',
                data: { count: phoneIndex.size }
              });
            } catch (error) {
              self.postMessage({
                type: 'INDEX_ERROR',
                data: { error: error.message }
              });
            }
          } else if (type === 'SEARCH_PHONE') {
            try {
              if (!fileBuffer) {
                throw new Error('File not indexed');
              }
              
              const text = new TextDecoder().decode(fileBuffer);
              const phoneData = JSON.parse(text);
              const phone = phoneData[data.userId] || null;
              
              self.postMessage({
                type: 'SEARCH_RESULT',
                data: { userId: data.userId, phone }
              });
            } catch (error) {
              self.postMessage({
                type: 'SEARCH_ERROR',
                data: { userId: data.userId, error: error.message }
              });
            }
          }
        };
      `

      const blob = new Blob([workerCode], { type: "application/javascript" })
      this.worker = new Worker(URL.createObjectURL(blob))
    }
  }

  async indexFile(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error("Worker not supported"))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer
        this.fileBuffer = buffer

        this.worker!.onmessage = (e) => {
          const { type, data } = e.data
          if (type === "INDEX_COMPLETE") {
            this.isIndexed = true
            resolve(data.count)
          } else if (type === "INDEX_ERROR") {
            reject(new Error(data.error))
          }
        }

        this.worker!.postMessage({
          type: "INDEX_FILE",
          data: { buffer },
        })
      }

      reader.onerror = () => reject(new Error("File reading failed"))
      reader.readAsArrayBuffer(file)
    })
  }

  async searchPhone(userId: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.worker || !this.isIndexed) {
        reject(new Error("File not indexed"))
        return
      }

      this.worker.onmessage = (e) => {
        const { type, data } = e.data
        if (type === "SEARCH_RESULT" && data.userId === userId) {
          resolve(data.phone)
        } else if (type === "SEARCH_ERROR" && data.userId === userId) {
          reject(new Error(data.error))
        }
      }

      this.worker.postMessage({
        type: "SEARCH_PHONE",
        data: { userId },
      })
    })
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}
