import { io, Socket } from 'socket.io-client';
import { Bid, AuctionUpdate, OutbidNotification } from '@/types/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.socket) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Disconnected from WebSocket server:', reason);

      if (reason === 'io server disconnect') {
        console.log('Server disconnected the client. Attempting to reconnect...');
        this.socket?.connect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnecting', (attemptNumber: number) => {
      console.log(`Attempting to reconnect (attempt ${attemptNumber})`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  get isSocketConnected(): boolean {
    return this.isConnected;
  }

  joinAuctionRoom(auctionId: string) {
    if (this.socket) {
      this.socket.emit('joinAuction', auctionId);
      console.log(`Joined auction room: ${auctionId}`);
    } else {
      console.warn('WebSocket is not connected. Cannot join auction room.');
    }
  }

  leaveAuctionRoom(auctionId: string) {
    if (this.socket) {
      this.socket.emit('leaveAuction', auctionId);
      console.log(`Left auction room: ${auctionId}`);
    } else {
      console.warn('WebSocket is not connected. Cannot leave auction room.');
    }
  }

  emitNewBid(bid: Bid) {
    if (this.socket) {
      this.socket.emit('newBid', bid);
      console.log('Emitted new bid:', bid);
    } else {
      console.warn('WebSocket is not connected. Cannot emit new bid.');
    }
  }

  onNewBid(callback: (bid: Bid) => void) {
    if (this.socket) {
      this.socket.on('newBid', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for new bids.');
    }
  }

  onAuctionUpdate(callback: (update: AuctionUpdate) => void) {
    if (this.socket) {
      this.socket.on('auctionUpdate', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for auction updates.');
    }
  }

  onOutbid(callback: (notification: OutbidNotification) => void) {
    if (this.socket) {
      this.socket.on('outbid', callback);
    } else {
      console.warn('WebSocket is not connected. Cannot listen for outbid notifications.');
    }
  }

  offNewBid(callback: (bid: Bid) => void) {
    if (this.socket) {
      this.socket.off('newBid', callback);
    }
  }

  offAuctionUpdate(callback: (update: AuctionUpdate) => void) {
    if (this.socket) {
      this.socket.off('auctionUpdate', callback);
    }
  }

  offOutbid(callback: (notification: OutbidNotification) => void) {
    if (this.socket) {
      this.socket.off('outbid', callback);
    }
  }

  removeListeners() {
    if (this.socket) {
      this.socket.off('newBid');
      this.socket.off('auctionUpdate');
      this.socket.off('outbid');
      console.log('Removed all WebSocket listeners');
    }
  }
}

export const socketService = new SocketService();