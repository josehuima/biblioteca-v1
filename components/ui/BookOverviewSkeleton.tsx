export function BookOverviewSkeleton() {
    return (
        <div className="w-full max-w-7xl p-4 border rounded shadow animate-pulse space-y-4">
            <div className="h-48 bg-gray-300 rounded"></div> {/* Capa do livro */}
            <div className="h-6 bg-gray-300 rounded w-3/4"></div> {/* Título */}
            <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Autor */}
            <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Gênero */}
            <div className="h-10 bg-gray-300 rounded w-full"></div> {/* Botões (emprestar/devolver) */}
        </div>
    );
}
  