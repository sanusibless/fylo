interface HeadingSmallProps {
    title: string;
    description?: string;
}

export default function HeadingSmall({ title, description }: HeadingSmallProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-white">
                {title}
            </h3>
            {description && (
                <p className="mt-1 text-xs text-gray-400">
                    {description}
                </p>
            )}
        </div>
    );
}
