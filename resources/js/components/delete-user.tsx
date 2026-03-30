import { useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DeleteUser() {
    const [confirming, setConfirming] = useState(false);

    const deleteUser = () => {
        router.delete(route('profile.destroy'), {
            onSuccess: () => setConfirming(false),
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-red-600">
                    Delete Account
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </div>

            {confirming ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete your account?
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={deleteUser}
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                        >
                            Confirm Delete
                        </button>

                        <button
                            onClick={() => setConfirming(false)}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setConfirming(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                    Delete Account
                </button>
            )}
        </div>
    );
}
