import SlideUp from '@/utils/animations/slideUp';
import React from 'react'

const commentsData = [
    {
        id: 1,
        userName: "John Smith",
        userRole: "Graphic Designer",
        userImage: "/images/blogs/comment1.png",
        text: "Transfer details Choose the amount you want to send abroad, select how your receiver wants to get the money, and lastly, how you want to pay. You will always see our fees upfront.",
        replies: [
            {
                id: 2,
                userName: "Williamson",
                userRole: "UI UX Designer",
                userImage: "/images/blogs/comment2.png",
                text: "Transfer details Choose the amount you want to send abroad, select how your receiver wants to get the money, and lastly, how you want to pay. You will always see our fees upfront."
            }
        ]
    },
    {
        id: 3,
        userName: "William Smith",
        userRole: "Graphic Designer",
        userImage: "/images/blogs/comment1.png",
        text: "Transfer details Choose the amount you want to send abroad, select how your receiver wants to get the money, and lastly, how you want to pay. You will always see our fees upfront.",
        replies: []
    }
];

const Comments = () => {
    return (
        <div className="comments">
            <h1 className="t__54">
                Comments
                <span>02</span>
            </h1>
            <div>
                {commentsData.map(comment => (
                    <SlideUp key={comment.id} className="comment">
                        <div className="main__comment">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="user">
                                    <img src={comment.userImage} alt="img" />
                                    <div>
                                        <h5 className="t__22">{comment.userName}</h5>
                                        <p>{comment.userRole}</p>
                                    </div>
                                </div>
                                <button className="reply">Reply</button>
                            </div>
                            <p className="text">{comment.text}</p>
                        </div>
                        <span className="border__full" />
                        {comment.replies.map(reply => (
                            <div key={reply.id} className="reply__comment">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="user">
                                        <img src={reply.userImage} alt="img" />
                                        <div>
                                            <h5 className="t__22">{reply.userName}</h5>
                                            <p>{reply.userRole}</p>
                                        </div>
                                    </div>
                                    <button className="reply">Reply</button>
                                </div>
                                <p className="text">{reply.text}</p>
                            </div>
                        ))}
                    </SlideUp>
                ))}
            </div>
        </div>

    )
}

export default Comments