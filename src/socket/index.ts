/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload, Secret } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { TAuthUser } from '../app/interface/authUser';
import { decodeToken } from '../app/utils/decodeToken';
import config from '../config'; // Ensure jwtSecret is defined in config

export interface IConnectedUser {
  socketId: string;
  _id: string; // You can add other properties that `connectUser` may have
}
export const connectedUser: Map<string, object> = new Map();

const socketIO = (io: Server) => {
  // Initialize an object to store the active users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeUsers: { [key: string]: any } = {};

  let user: JwtPayload | undefined | TAuthUser = undefined;

  // Middleware to handle JWT authentication
  io.use(async (socket: Socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.token ||
      socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error('Authentication error: Token not provided.'));
    }
    try {
      user = decodeToken(
        token,
        config.jwt.access_token as Secret,
      ) as JwtPayload;

      activeUsers[socket.id] = user._id;
      socket.user = { userId: user._id, socketId: socket.id };
      // Attach user info to the socket object

      if (
        socket.user.userId === undefined ||
        socket.user.socketId === undefined
      ) {
        // eslint-disable-next-line no-console
        console.log('userId or socketId is undefined');
        return;
      }
      next();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('JWT Verification Error:', err);
      return next(new Error('Authentication error: Invalid token.'));
    }
  });

  // On new socket connection
  io.on('connection', (socket: Socket) => {
    // eslint-disable-next-line no-console
    console.log('connected', socket.id);
    if (
      socket?.user?.userId === undefined ||
      socket.user.socketId === undefined
    ) {
      // eslint-disable-next-line no-console
      console.log('userId or socketId is undefined');
      return;
    }
    connectedUser.set(socket.user.userId, { socketId: socket?.user?.socketId });

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Socket disconnected', socket.id);
      // You can remove the user from active users if needed
      delete activeUsers[socket.id];
      if (
        socket?.user?.userId === undefined ||
        socket?.user?.socketId === undefined
      ) {
        // eslint-disable-next-line no-console
        console.log('userId or socketId is undefined');
        return;
      }
      connectedUser.delete(socket?.user?.userId);
    });

    socket.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('Socket error:', err);
    });
  });
};

export default socketIO;
