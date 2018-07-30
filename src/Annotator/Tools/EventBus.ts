export class EventBus {
    static listeners = {};

    static on(event: string, listener: (args?: any) => any): number {
        if (!EventBus.listeners[event]) {
            EventBus.listeners[event] = [];
        }
        const id = Math.random();
        EventBus.listeners[event].push(listener);
        return id;
    }

    static offById(event: string, id: number) {
        const list = EventBus.listeners[event];
        for (let i = 0; i < list.length; i++) {
            if (list[i] === id) {
                list.splice(i, 1);
                return;
            }
        }
    }

    static offAll() {
        EventBus.listeners = {}
    }

    public static emit(event: string, args?: any): boolean {
        if (!EventBus.listeners[event]) {
            return false;
        }
        for (let l of EventBus.listeners[event]) {
            l(args);
        }
        return true;
    }

    private static off(event: string) {
        EventBus.listeners[event] = [];
    }
}