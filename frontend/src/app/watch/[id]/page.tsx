import Link from "next/link"
import { ChevronLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button"
import { MoviePlayer } from "@/app/components/MoviePlayer"

interface WatchMovieParams {
    params: {
        id: number;
    };
}

async function getEmbedUrl(id: number): Promise<string> {
    try {
        const response = await fetch(`http://localhost:3333/api/movies/watch/${id}`);

        if (!response.ok) {
            throw new Error(`Error fetching movie: ${response.status}`);
        }

        const embedUrl = await response.text();

        if (!embedUrl) {
            throw new Error('Empty embed URL returned');
        }
        return embedUrl;
    } catch (error) {
        console.error('Failed to fetch movie:', error);
        throw new Error('Failed to load movie');
    }
}

export default async function WatchMovie({ params }: WatchMovieParams) {
    let embedUrl: string;
    try {
        embedUrl = await getEmbedUrl(params.id);
    } catch (error) {
        return <div className="text-center p-4">Error loading movie</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="flex items-center justify-between">
                <Link href="/" passHref>
                    <Button className="gap-2 hover:bg-white/10">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
            <div className="w-full max-w-4xl mt-4 flex justify-center">
                <MoviePlayer embedUrl={embedUrl} />
            </div>
        </div>
    );
}