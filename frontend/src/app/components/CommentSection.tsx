"use client";
import { Textarea } from "@/app/components/ui/textarea";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import Cookies from "js-cookie";
import { Comment, User } from "@/types";
import api from '@/utils/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Edit2, Check, X, Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { transmit } from "@/app/layout";

export const CommentSection = ({ movie_id }: { movie_id: number }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [commentLoading, setCommentLoading] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editedContent, setEditedContent] = useState("")
    const { user } = useAuth()
    const { username, role, language } = user?.user || {}

    const handleEditComment = (commentId: string, content: string) => {
        setEditingCommentId(commentId)
        setEditedContent(content)
    }

    const handleSaveEdit = async (commentId: string) => {
        try {
            const response = await api.patch(`/api/comments/${commentId}`, {
                content: editedContent
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.status !== 200) {
                throw new Error("Failed to update comment");
            }
            setEditingCommentId(null)
            setEditedContent("")
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setEditedContent("")
    }

    const fetchComments = async (movieId: number) => {
        setCommentLoading(true)
        try {
            const response = await api.get(`/api/comments/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }
            });
            if (response.status !== 200) {
                throw new Error("Failed to fetch comments");
            }
            setComments(response.data);
            setCommentLoading(false)
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    }

    useEffect(() => {
        const subscription = transmit.subscription(`movie:${movie_id}`)
        subscription.create()
        
        const stopListening = subscription.onMessage((data: any) => {
            const { type } = data
            
            switch (type) {
                case 'newComment':
                    if (data.comment) {
                        setComments(prev => [...prev, data.comment])
                    } else {
                        fetchComments(movie_id)
                    }
                    break
                    
                case 'updateComment':
                    if (data.comment) {
                        setComments(prev => prev.map(c => c.id === data.comment.id ? data.comment : c))
                    } else {
                        fetchComments(movie_id)
                    }
                    break
                    
                case 'deleteComment':
                    fetchComments(movie_id)
                    break
                    
                default:
                    fetchComments(movie_id)
            }
        })

        return () => {
            stopListening()
            subscription.delete()
        }
    }, [movie_id])

    useEffect(() => {
        (async () => {
            await fetchComments(movie_id);
        })();
    }, [movie_id]);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return

        setCommentLoading(true)
        try {
            const comment = newComment.trim();
            const response = await fetch(`http://localhost:3333/api/comments?id=${movie_id}&content=${comment}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ content: comment })
            })
            if (!response.ok) {
                throw new Error("Failed to add comment");
            }
            
            setNewComment('')
        } catch (error) {
            console.error("Failed to add comment:", error)
        } finally {
            setCommentLoading(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        setCommentLoading(true)

        try {
            const response = await fetch(`http://localhost:3333/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }
            })
            if (!response.ok) {
                throw new Error("Failed to delete comment");
            }
            
        } catch (error) {
            console.error("Failed to delete comment:", error)
        } finally {
            setCommentLoading(false)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short"
        }).format(date)
    }

    return (
        <div className="mt-5 w-full mx-auto pb-24">
            <h2 className="text-xl font-semibold mb-4">
                {language === 'en' ? "Comments" : "Commentaires"}
            </h2>

            <div className="mb-6 space-y-3">
                <Textarea
                    placeholder={language === 'en' ? "Write a comment..." : "Écrire un commentaire..."}
                    className="bg-zinc-900 border-zinc-700 resize-none min-h-24"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment();
                        }
                    }}
                />
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || commentLoading}
                        className="bg-white hover:bg-gray-100 text-black dark:text-black dark:bg-white"
                    >
                        {commentLoading ? (language === 'en' ? "Posting..." : "Publication...") : (language === 'en' ? "Post" : "Publier")}
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-400 mb-4">
                    {comments.length === 0
                        ? language === 'en' ? "No comments yet" : "Pas de commentaires"
                        : `${comments.length} ${comments.length === 1 
                            ? language === 'en' ? "Comment" : "Commentaire" 
                            : language === 'en' ? "Comments" : "Commentaires"}`}
                </h3>

                {comments.length > 0 &&
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className="bg-zinc-800/80 p-5 rounded-lg border border-zinc-700 transition-all hover:border-zinc-600"
                        >
                            <div className="flex items-start gap-4">
                                {comment.user?.username !==  username && (
                                    <Link prefetch={false} href={`/users/${comment?.user?.id}`}>
                                        <Avatar className="h-10 w-10 border border-zinc-700">
                                            <AvatarImage src={comment?.user?.profilePicture} alt={comment?.user?.username || "User"} />
                                        </Avatar>
                                    </Link>
                                )}

                                {comment.user?.username ===  username && (
                                    <Avatar className="h-10 w-10 border border-zinc-700">
                                        <AvatarImage src={comment?.user?.profilePicture} alt={comment?.user?.username || "User"} />
                                    </Avatar>
                                )}

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{comment?.user?.username || "User"}</p>
                                        <div className="flex items-center gap-2">
                                            {comment.user?.username === user?.user?.username && comment.id && editingCommentId !== comment.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-white"
                                                    onClick={() => handleEditComment(comment.id!, comment.content)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        {language === 'en' ? "Edit" : "Modifier"}
                                                    </span>
                                                </Button>
                                            )}
                                            {(comment.user?.username === username || role == 'admin') && comment.id && (
                                                <>
                                                    <AlertDialog >
                                                        <AlertDialogTrigger>
                                                            <Trash className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                {language === 'en' ? "Delete" : "Supprimer"}
                                                            </span>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="border-none">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    {language === 'en' ? "Delete Comment" : "Supprimer le commentaire"}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {language === 'en' ? "Are you sure you want to delete this comment?" : "Êtes-vous sûr de vouloir supprimer ce commentaire ?"}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Close</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                >
                                                                    {language === 'en' ? "Delete" : "Supprimer"}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                            <p className="text-xs text-gray-400">{formatDate(comment?.updated_at)}</p>
                                        </div>
                                    </div>

                                    {comment.user?.username === username && comment.id && editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                className="bg-zinc-900 border-zinc-700 resize-none min-h-20"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-zinc-700 hover:bg-zinc-700"
                                                    onClick={handleCancelEdit}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {language === 'en' ? "Cancel" : "Annuler"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-white hover:bg-gray-100 text-black dark:text-black dark:bg-white"
                                                    onClick={() => handleSaveEdit(comment.id!)}
                                                    disabled={!editedContent.trim()}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    {language === 'en' ? "Save" : "Enregistrer"}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-200 leading-relaxed">{comment.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}