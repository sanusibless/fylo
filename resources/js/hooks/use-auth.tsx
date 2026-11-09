import { type SharedData, type User } from "@/types";
import { usePage } from "@inertiajs/react";

export default function useAuth(): User {
    const authUser = usePage<SharedData>().props.auth?.user;
    return authUser || ({} as User);
}
