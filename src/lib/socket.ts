import { socketUrl } from "@/shared/_services/api_service";
import { io } from "socket.io-client";

export const chatSocket = io(socketUrl, {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
});
