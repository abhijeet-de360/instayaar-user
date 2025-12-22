import { toast } from "sonner";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  width?: number;
  height?: number;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds" | "none";
  seed?: number | null;
  lora?: string[];
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  private ws: WebSocket | null = null;
  private apiKey: string | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(API_ENDPOINT);
      
      this.ws.onopen = () => {
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        
        if (response.error || response.errors) {
          const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
          toast.error(errorMessage);
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              this.connectionSessionUUID = item.connectionSessionUUID;
              this.isAuthenticated = true;
            } else {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        toast.error("Connection error. Please try again.");
        reject(error);
      };

      this.ws.onclose = () => {
        this.isAuthenticated = false;
        setTimeout(() => {
          this.connectionPromise = this.connect();
        }, 1000);
      };
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID }),
      }];
      
      
      // Set up a one-time authentication callback
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    // Wait for connection and authentication before proceeding
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "imageInference",
        taskUUID,
        model: params.model || "runware:100@1",
        width: params.width || 512,
        height: params.height || 512,
        numberResults: params.numberResults || 1,
        outputFormat: params.outputFormat || "WEBP",
        steps: 4,
        CFGScale: params.CFGScale || 1,
        scheduler: params.scheduler || "FlowMatchEulerDiscreteScheduler",
        strength: params.strength || 0.8,
        promptWeighting: params.promptWeighting || "none",
        lora: params.lora || [],
        positivePrompt: params.positivePrompt,
        ...(params.seed && { seed: params.seed }),
      }];

      if (!params.seed) {
        delete message[0].seed;
      }

      if (message[0].model === "runware:100@1") {
        message[0].promptWeighting = "none";
      }

      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data);
        }
      });

      this.ws?.send(JSON.stringify(message));
    });
  }
}

// Service image generation prompts
export const serviceImagePrompts = {
  "Chef": "Professional chef in white uniform and hat cooking in modern kitchen, high quality commercial photography, clean professional look",
  "Bartender": "Professional bartender mixing cocktails behind bar with bottles and drinks, modern bar setting, professional photography",
  "DJ": "Professional DJ at mixing console with headphones, club lighting, turntables and music equipment, dynamic lighting",
  "Musician": "Professional musician playing guitar on stage, concert lighting, performance setting, artistic composition",
  "Magician": "Professional magician performing magic trick with cards or wand, mysterious lighting, elegant performance attire",
  "Stand-up Comedian": "Professional comedian on stage with microphone, spotlight, comedy club setting, engaging performance",
  "Tattoo Artist": "Professional tattoo artist working with tattoo machine, art studio setting, detailed equipment, artistic workspace",
  "Mehendi Artist": "Professional henna artist applying intricate mehendi designs on hands, traditional patterns, detailed artwork",
  "Theme Decorator": "Professional event decorator arranging beautiful party decorations, colorful balloons and themes, creative setup",
  "Reels Maker": "Professional content creator filming with camera and lighting equipment, modern studio setup, video production",
  "Tour Guide": "Professional tour guide with group of tourists at scenic location, travel setting, professional appearance",
  "Fashion Designer": "Professional fashion designer working on clothing designs, measuring tape and fabric, creative studio workspace"
};