



import { toast } from "react-hot-toast"
import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore"


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUserLoading: true })

        try {
            const res = await axiosInstance.get("/message/users")
            set({ users: res.data })
        }

        catch (error) {
            toast.error(error.response.data.message)
        }

        finally {
            set({ isUserLoading: false })
        }
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true })

        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })
        }

        catch (error) {
            toast.error(error.response.data.message)
        }

        finally {
            set({ isMessagesLoading: false })
        }
    },


    sendMessage: async (MessageData) => {
        const { selectedUser, messages } = get()
        const socket = useAuthStore.getState().socket;
        const { authUser } = useAuthStore.getState();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, MessageData)

            set({ messages: [...messages, res.data] })

            if (socket && socket.connected) {
                const socketMessage = {
                    _id: res.data._id,
                    senderId: authUser._id,
                    recieverId: selectedUser._id,
                    text: MessageData.text,
                    image: res.data.image || null,
                    createdAt: new Date().toISOString()
                };

                socket.emit("newMessage", socketMessage);
            }

            else {
                console.warn("Socket not connected, real-time delivery might not work");
            }
        }

        catch (error) {
            toast.error(error.response.data.message)
        }
    },


    subscribeToMessages: () => {
        const { selectedUser } = get()
        const { authUser } = useAuthStore.getState();

        if (!selectedUser) return

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.off("broadcastMessage");

        const handleNewMessage = (newMessage) => {
            console.log("Received new message:", newMessage);
            const currentMessages = get().messages;

            if ((newMessage.senderId === selectedUser._id && newMessage.recieverId === authUser._id) ||
                (newMessage.recieverId === selectedUser._id && newMessage.senderId === authUser._id)) {

                if (!currentMessages.some(msg => msg._id === newMessage._id)) {
                    set({
                        messages: [...currentMessages, newMessage],
                    });
                }
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("broadcastMessage", handleNewMessage);
    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },


    setSelectedUser: (selectedUser) => set({ selectedUser }),

}))



