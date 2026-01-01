import toast from "react-hot-toast";

//parameters
interface DeleteConfirmProps {
    title: string;
    message: string;
    onConfirm: () => Promise<void>; // function to execute when we click yes
}

export const showDeleteConfirm = ({
    title,
    message,
    onConfirm,

}: DeleteConfirmProps) => {
    toast((t) => (
        <div className="flex flex-col gap-4 px-10">
            {/* DYNAMIc TITLE */}
            <p className="font-bold text-red-500">⚠️ {title}</p>

            {/* DYNAMIC MESSAGE  */}
            <p>{message}</p>

            <p className="text-sm opacity-70">This action cannot be undone.</p>

            <div className="flex gap-10  pt-10">
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            // Parameter to pass on
                            await onConfirm();
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }}
                    className="btn-sm bg-red-500 hover:bg-red-600 text-white pt-10"
                >
                    Yes, delete
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="btn-sm pr-10 btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </div>
    ), {
        duration: Infinity,
    });
};
