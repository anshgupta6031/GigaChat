



import { toast } from "react-hot-toast"
import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { io } from "socket.io-client"


const BASE_URL = "http://localhost:5001"


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")

            set({ authUser: res.data })

            get().connectSocket()
        }

        catch (error) {
            console.log("Error in checkAuth.....", error)
            set({ authUser: null })
        }

        finally {
            set({ isCheckingAuth: false })
        }
    },


    signUp: async (data) => {
        set({ isSigningUp: true })

        try {
            const res = await axiosInstance.post("/auth/signup", data)

            set({ authUser: res.data })

            toast.success("Account created successfully.")

            get().connectSocket()
        }

        catch (error) {
            toast.error(error.response.data.message)
        }

        finally {
            set({ isSigningUp: false })
        }
    },


    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")

            set({ authUser: null })

            toast.success("Logged out successfully.")

            get().disconnectSocket()
        }

        catch (error) {
            toast.error(error.response.data.message)
        }
    },


    login: async (data) => {
        set({ isLoggingIn: true })

        try {
            const res = await axiosInstance.post("/auth/login", data)

            set({ authUser: res.data })

            toast.success("Logged in successfully.")

            get().connectSocket()
        }

        catch (error) {
            toast.error(error.response.data.message)
        }

        finally {
            set({ isLoggingIn: false })
        }
    },


    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })

        try {
            const res = await axiosInstance.put("/auth/update-profile", data)

            set({ authUser: res.data })

            toast.success("Profile updated successfully.")
        }

        catch (error) {
            toast.error(error.response.data.message)
        }

        finally {
            set({ isUpdatingProfile: false })
        }
    },


    connectSocket: () => {
        const { authUser } = get()

        if (!authUser) return;

        if (get().socket) {
            get().socket.disconnect();
        }

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: false,
        });

        set({ socket: socket });

        socket.on("connect", () => {
            socket.emit("requestOnlineUsers");
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);

            setTimeout(() => {
                if (socket && !socket.connected) {
                    console.log("Attempting to reconnect socket...");
                    socket.connect();
                }
            }, 2000);
        });

        socket.on("getOnlineUsers", (userIds) => {
            if (Array.isArray(userIds)) {
                set({ onlineUsers: userIds });
            } else {
                console.error("Received invalid online users data:", userIds);
            }
        });

        socket.connect();

        const intervalId = setInterval(() => {
            const currentSocket = get().socket;
            if (currentSocket && !currentSocket.connected) {
                console.log("Socket detected as disconnected, attempting to reconnect...");
                try {
                    currentSocket.connect();
                }

                catch (err) {
                    console.error("Error reconnecting socket:", err);
                }
            }
        }, 10000); // Check every 10 seconds

        socket._reconnectInterval = intervalId;
    },


    disconnectSocket: () => {
        const socket = get().socket;
        if (!socket) return;

        if (socket._reconnectInterval) {
            clearInterval(socket._reconnectInterval);
        }

        socket.off("connect");
        socket.off("connect_error");
        socket.off("getOnlineUsers");

        if (socket.connected) {
            socket.disconnect();
        }

        set({
            socket: null,
            onlineUsers: []
        });
    },

}))



