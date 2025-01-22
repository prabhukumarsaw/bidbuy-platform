import { io, Socket } from 'socket.io-client';
import { Bid, AuctionUpdate, OutbidNotification } from '@/types/types'; // Adjust the import path

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  // Connect to the WebSocket server
  connect() {
    if (this.socket) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 1000, // Delay between reconnection attempts in ms
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
    });
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  // Check if the WebSocket is connected
  get isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Join an auction room
  joinAuctionRoom(auctionId: string) {
    if (this.socket) {
      this.socket.emit('joinAuction', auctionId);
      console.log(`Joined auction room: ${auctionId}`);
    } else {
      console.warn('WebSocket is not connected. Cannot join auction room.');
    }
  }

  // Leave an auction room
  leaveAuctionRoom(auctionId: string) {
    if (this.socket) {
      this.socket.emit('leaveAuction', auctionId);
      console.log(`Left auction room: ${auctionId}`);
    } else {
      console.warn('WebSocket is not connected. Cannot leave auction room.');
    }
  }

  // Listen for new bids
  onNewBid(callback: (bid: Bid) => void) {
    if (this.socket) {
      this.socket.on('newBid', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for new bids.');
    }
  }

  // Listen for auction updates
  onAuctionUpdate(callback: (update: AuctionUpdate) => void) {
    if (this.socket) {
      this.socket.on('auctionUpdate', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for auction updates.');
    }
  }

  // Listen for outbid notifications
  onOutbid(callback: (notification: OutbidNotification) => void) {
    if (this.socket) {
      this.socket.on('outbid', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for outbid notifications.');
    }
  }

  // Remove all listeners
  removeListeners() {
    if (this.socket) {
      this.socket.off('newBid');
      this.socket.off('auctionUpdate');
      this.socket.off('outbid');
      console.log('Removed all WebSocket listeners');
    }
  }
}

// Singleton instance
export const socketService = new SocketService();