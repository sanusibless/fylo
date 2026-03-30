export default function Heading({ title, description, children }) {
    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
                {title}
            </h1>

            {description && (
                <p className="mt-2 text-sm text-gray-600">
                    {description}
                </p>
            )}

            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
}
