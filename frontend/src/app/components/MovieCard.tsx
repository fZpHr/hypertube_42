import React from 'react';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Loader } from 'lucide-react';

interface Movie {
    id: number;
    title: string;
    tagline: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string
}

interface MovieCardProps {
    movies: Movie[];
    observerRef: React.MutableRefObject<null>;
    loadState: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movies, observerRef, loadState }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.length > 0 && movies.map((movie, index) => (
                movie.poster_path && (
                    <div key={movie.id} className="group cursor-pointer">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md mb-2 bg-zinc-800">
                            <Image
                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}` || "/placeholder.svg"}
                                alt={movie.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-full gap-1 bg-white/20 backdrop-blur-sm text-white border-none hover:bg-white/30"
                                    onClick={() => window.location.href = `/watch/${movie.id}`}
                                >
                                    <Play className="h-4 w-4" />
                                    Play
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {movie.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-zinc-400">{parseInt(movie.release_date) || 'N/A'}</span>
                            <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-xs text-zinc-400">{Math.round(movie.vote_average * 10) || '0'}%</span>
                            </div>
                        </div>
                        {index === movies.length - 5 && <div ref={observerRef}></div>}

                    </div>
                )
            ))}
            {loadState && (
                <div className="flex justify-center items-center w-full mt-4">
                    <Loader className="animate-spin h-8 w-8" />
                </div>
            )}
        </div>
    );
};
