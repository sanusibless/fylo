import { useState } from 'react';

export default function AppearanceTabs() {
    const [activeTab, setActiveTab] = useState('light');

    const tabs = [
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
        { key: 'system', label: 'System' },
    ];

    return (
        <div>
            <div className="flex gap-2 border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === tab.key
                                ? 'border-b-2 border-indigo-500 text-indigo-600'
                                : 'text-gray-500'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="text-sm text-gray-600">
                {activeTab === 'light' && <p>Light mode is active.</p>}
                {activeTab === 'dark' && <p>Dark mode is active.</p>}
                {activeTab === 'system' && <p>System preference is active.</p>}
            </div>
        </div>
    );
}
