import { useEffect } from 'react';
import { Crisp } from "crisp-sdk-web";
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const ChatWidget = () => {
    const { auth } = usePage<SharedData>().props;
    const crispWebsiteId = (import.meta as any).env?.VITE_CRISP_WEBSITE_ID;

    useEffect(() => {
        if (!crispWebsiteId || crispWebsiteId === "YOUR_CRISP_WEBSITE_ID") {
            return;
        }

        try {
            Crisp.configure(crispWebsiteId);

            if (auth?.user) {
                Crisp.user.setEmail(auth.user.email);
                Crisp.user.setNickname(auth.user.name);
                Crisp.session.setData({
                    "user_id": auth.user.id,
                    "plan": (auth.user as any).plan_name || 'free'
                });
            }

            Crisp.chat.show();

            return () => {
                try {
                    Crisp.chat.hide();
                } catch {
                    // ignore if already hidden
                }
            };
        } catch {
            // ignore crisp errors
        }
    }, [auth?.user, crispWebsiteId]);

    return null;
};

export default ChatWidget;
