import { usePage } from "@inertiajs/react";

export default function useAuth() {
    const authUser = usePage().props.auth?.user;
    return authUser;
}
