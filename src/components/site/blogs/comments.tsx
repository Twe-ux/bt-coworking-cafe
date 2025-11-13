'use client';

import SlideUp from '@/utils/animations/slideUp';
import React from 'react';
import { useGetCommentsQuery } from '@/store/api/blogApi';

interface CommentsProps {
    articleId: string;
}

const Comments = ({ articleId }: CommentsProps) => {
    const { data, isLoading, error } = useGetCommentsQuery({
        article: articleId,
        status: 'approved',
        page: 1,
        limit: 50,
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="comments">
                <h1 className="t__54">
                    Comments
                    <span>...</span>
                </h1>
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comments">
                <h1 className="t__54">
                    Comments
                    <span>00</span>
                </h1>
                <div className="alert alert-warning">
                    Impossible de charger les commentaires.
                </div>
            </div>
        );
    }

    const comments = data?.comments || [];

    return (
        <div className="comments">
            <h1 className="t__54">
                Comments
                <span>{comments.length.toString().padStart(2, '0')}</span>
            </h1>
            {comments.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-muted">
                        Aucun commentaire pour le moment. Soyez le premier à commenter !
                    </p>
                </div>
            ) : (
                <div>
                    {comments.map(comment => (
                        <SlideUp key={comment._id} className="comment">
                            <div className="main__comment">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="user">
                                        <div className="avatar rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <span className="text-primary fs-5 fw-semibold">
                                                {(comment.user.name || comment.user.username).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h5 className="t__22">{comment.user.name || comment.user.username}</h5>
                                            <p>{formatDate(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                    {/* <button className="reply">Reply</button> */}
                                </div>
                                <p className="text">{comment.content}</p>
                            </div>
                            <span className="border__full" />
                            {comment.replies && comment.replies.length > 0 && (
                                comment.replies.map(reply => (
                                    <div key={reply._id} className="reply__comment">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="user">
                                                <div className="avatar rounded-circle bg-success-subtle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                    <span className="text-success fs-5 fw-semibold">
                                                        {(reply.user.name || reply.user.username).charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h5 className="t__22">{reply.user.name || reply.user.username}</h5>
                                                    <p>{formatDate(reply.createdAt)}</p>
                                                </div>
                                            </div>
                                            {/* <button className="reply">Reply</button> */}
                                        </div>
                                        <p className="text">{reply.content}</p>
                                    </div>
                                ))
                            )}
                        </SlideUp>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;
