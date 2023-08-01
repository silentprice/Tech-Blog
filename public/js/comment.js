function commentHandler (e) {
    e.preventDefault()

    const postId = document.querySelector(".post-info").id
    const content = document.getElementById("comment-content").value
    
    if (content) {
        fetch('/api/post/comment', {
            method: 'POST',
            body: JSON.stringify({
                content: content,
                postId: postId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        document.location.reload()
    }
}

document.querySelector(".btn").addEventListener("click", commentHandler)