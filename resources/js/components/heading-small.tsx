interface HeadingSmallProps {
    title: string;
    description?: string;
}

export default function HeadingSmall({ title, description }: HeadingSmallProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
                {title}
            </h3>
            {description && (
                <p className="mt-1 text-sm text-gray-600">
                    {description}
                </p>
            )}
        </div>
    );
}
