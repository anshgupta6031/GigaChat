



import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";


const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers, socket } = useAuthStore();

    const refreshOnlineStatus = () => {
        if (socket) {
            socket.emit("requestOnlineUsers");
        }
    };

    const isOnline = onlineUsers.includes(selectedUser._id);

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
                            )}
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                            {isOnline
                                ? <><span className="inline-block size-2 bg-green-500 rounded-full mr-1"></span>Online</>
                                : "Offline"
                            }
                            <button
                                onClick={refreshOnlineStatus}
                                className="text-xs opacity-50 hover:opacity-100 ml-1"
                                title="Refresh status">
                                ↻
                            </button>
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};



export default ChatHeader;



