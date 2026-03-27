import { useEffect } from 'react';
import { Crisp } from "crisp-sdk-web";
import { usePage } from '@inertiajs/react';

const ChatWidget = () => {
    const { auth } = usePage().props;

    useEffect(() => {
        // 1. Initialize with your Website ID
        Crisp.configure("YOUR_CRISP_WEBSITE_ID");

        // 2. Identify the user if they are logged in
        if (auth.user) {
            Crisp.user.setEmail(auth.user.email);
            Crisp.user.setNickname(auth.user.name);
            // You can even push custom data like their subscription plan
            Crisp.session.setData({
                "user_id": auth.user.id,
                "plan": auth.user.plan_name || 'free'
            });
        }

        // 3. Optional: Show/Hide based on component mounting
        Crisp.chat.show();

        // Cleanup when the component unmounts
        return () => {
            Crisp.chat.hide();
        };
    }, [auth.user]);

    return null; // This component doesn't need to render HTML
};

export default ChatWidget;