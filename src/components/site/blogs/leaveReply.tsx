'use client';

import SlideUp from '@/utils/animations/slideUp';
import React, { useState } from 'react';

interface LeaveReplyProps {
    articleId: string;
}

const LeaveReply = ({ articleId }: LeaveReplyProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        saveInfo: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Implémenter l'appel API pour créer un commentaire
        console.log('Submitting comment for article:', articleId, formData);

        // Reset form
        setFormData({
            name: '',
            email: '',
            message: '',
            saveInfo: false,
        });

        alert('Merci pour votre commentaire ! (API non implémentée pour le moment)');
    };

    return (
        <SlideUp className="leave__replay">
            <h2 className="t__54">Leave A Reply</h2>
            <p>
                Your email address will not be published. Required fields are
                marked *
            </p>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>
                    <div className="d-flex align-items-baseline gap-1 w-100">
                        <input
                            type="checkbox"
                            id="check-blog"
                            className="w-auto"
                            checked={formData.saveInfo}
                            onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                        />
                        <label htmlFor="check-blog">
                            Save my name, email, and website in this browser for the
                            next time I comment.
                        </label>
                    </div>
                    <div>
                        <button type="submit" className="common__btn mt-4 mt-md-0">
                            Post A Comment
                            <img src="/icons/arrow-up-rignt-black.svg" alt="img" />
                        </button>
                    </div>
                </div>
            </form>
        </SlideUp>
    );
};

export default LeaveReply;
