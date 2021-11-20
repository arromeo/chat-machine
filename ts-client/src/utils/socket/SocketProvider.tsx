import { createContext, FC, useContext, useRef } from "react";
import EventEmitter from "eventemitter3";
import { Subject } from "rxjs";
import { retryWhen } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

export type SocketProviderValue = {
  socket: EventEmitter;
};

export const SocketContext = createContext<SocketProviderValue | undefined>(
  undefined
);

export class Socket extends EventEmitter {
  subject: WebSocketSubject<{}>;
  openObserver: Subject<{}>;
  closeObserver: Subject<{}>;

  constructor(url: string) {
    super();
    this.openObserver = new Subject();
    this.closeObserver = new Subject();
    this.subject = webSocket({
      url,
      openObserver: this.openObserver,
      closeObserver: this.closeObserver,
    });

    this.subject.pipe(retryWhen((errors) => errors)).subscribe({
      next: (evt) => this.emit("message", evt),
      error: (err) => this.emit("error", err),
      complete: () => this.emit("complete"),
    });

    this.openObserver.subscribe({
      next: (evt) => this.emit("open", evt),
      error: (err) => this.emit("error", err),
    });
  }
}

export type SocketProviderProps = {
  url: string;
};

export const SocketProvider: FC<SocketProviderProps> = (props) => {
  const { children, url } = props;
  const socket = useRef<EventEmitter>(new Socket(url)).current;

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}
