import {
    type ComponentProps,
    createContext,
    useRef,
    type PropsWithChildren,
    useContext,
    useCallback,
    useState,
} from "react";
import { Toast } from "../../components/Toast";

type Params = ComponentProps<typeof Toast> & { duration?: number };
type ToastItem = ComponentProps<typeof Toast> & { id: number; timer: ReturnType<typeof setTimeout> };

const defaultPush = (_toast: Params) => {}; // Méthode de base que l'on mettra dans le contexte par défaut

const ToastContext = createContext({
    pushToastRef: { current: defaultPush },
});

// On entourera notre application de ce provider pour rendre le toasts fonctionnel
export function ToastContextProvider({ children }: PropsWithChildren) {
    const pushToastRef = useRef(defaultPush);

    return (
        <ToastContext value={{ pushToastRef }}>
            <Toasts />
            {children}
        </ToastContext>
    );
}

export function useToasts() {
    const { pushToastRef } = useContext(ToastContext);
    return {
        pushToast: useCallback(
            (toast: Params) => {
                pushToastRef.current(toast);
            },
            [pushToastRef],
        ),
    };
}

export function Toasts() {
    const [toasts, setToasts] = useState([] as ToastItem[]);
    // On modifie la méthode du contexte
    const { pushToastRef } = useContext(ToastContext);
    pushToastRef.current = ({ duration, ...props }) => {
        // On génère un id pour différencier les messages
        const id = Date.now();
        // On sauvegarde le timer pour pouvoir l'annuler si le message est fermé
        const timer = setTimeout(
            () => {
                setToasts((v) => v.filter((t) => t.id !== id));
            },
            (duration ?? 5) * 1000,
        );
        const toast = { ...props, id, timer };
        setToasts((v) => [...v, toast]);
    };

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </div>
    );
}
