window.createPost = () => {

    let postTitle = document.querySelector("#postTitle").value;
    let postText = document.querySelector("#postText").value;
    console.log(postTitle, postText);

    axios.post(`/api/v1/post`, {
        title: postTitle,
        text: postText
    })
        .then(function (response) {
            // handle success
            console.log(response.data);
            document.querySelector("#result").innerHTML = `<div class="postSuccess">${response.data}</div> `;
            getAllPost();
        })
        .catch(function (error) {
            // handle error
            console.log(error.data);
            document.querySelector("#result").innerHTML = `<div class="postError">Error in Post Submission! </div> `
        })
}
window.getAllPost = () =>  {
    axios.get(`/api/v1/posts`)
        .then(function (response) {
            // handle success
            console.log(response.data);
            let posts = ``
            response.data.map((eachPost) => {
                posts += `<div id='card-${eachPost._id}' class="posts">
                <h3>${eachPost.title}</h3>
                <span>Created On: ${eachPost.createdAt}</span>
                <p>${eachPost.text}</p>
                <button onclick="deletePost('${eachPost._id}')">Delete</button>
                <button onclick="editPost('${eachPost._id}','${eachPost.title}','${eachPost.text}',)">Edit</button>
                </div>`
            });
            document.querySelector("#posts").innerHTML = posts

        })
        .catch(function (error) {
            // handle error
            console.log(error.data);
            document.querySelector("#result").innerHTML = "error in post submission"
        })
}
window.deletePost = (postId) => {Swal.fire({
    title: 'Enter Password',
    input: 'password',
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    cancelButtonColor: "#24232c",
    confirmButtonText: 'Delete',
    confirmButtonColor: "#24232c",
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
        if (password === '3737701') {

            return axios.delete(`/api/v1/post/${postId}`)
                .then(response => {
                        Swal.fire({
                        icon: 'success',
                        title: 'Post Deleted',
                        timer: 1000,
                        showConfirmButton: false
                    });

                    getAllPost();
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Post Deleted',
                        timer: 1000,
                        showConfirmButton: false
                    });
                    getAllPost();
                });
        } else {

            return Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Please enter correct password',
                timer: 1000,
                showConfirmButton: false
            });
        }
    }
});
}
    window.editPost = (postId, title, text) => {

    console.log("Edit: ", postId);

    document.querySelector(`#card-${postId}`).innerHTML =
        `<form onsubmit="savePost('${postId}')">
        title: <input type='text' value='${title}' id='title-${postId}' />
        <br/>
        text: <input type='text' value='${text}' id='text-${postId}' />
        <br/>
            <button>Save</button>

        </form>`
}
window.savePost = (postId)=>{
    const updatedTitle = document.querySelector(`#title-${postId}`).value;
    const updatedText = document.querySelector(`#text-${postId}`).value;

    axios.put(`/api/v1/post/${postId}`, {
        title: updatedTitle,
        text: updatedText
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error.data);
        })

}
// delete all

window.deleteAllPosts = () => {
    Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonColor: "#24232c",
        confirmButtonText: 'Delete All Posts',
        confirmButtonColor: "#24232c",
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            if (password === '3737') {
                return axios.delete(`/api/v1/posts/all`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: {
                            password: password
                        }
                    })
                    .then(response => {
                        // console.log(response.data);
                        Swal.fire({
                            icon: 'success',
                            title: 'All Posts Deleted',
                            timer: 1000,
                            showConfirmButton: false
                        });
                        getAllPost();
                    })
                    .catch(error => {
                        // console.log(error.data);
                        Swal.fire({
                            icon: 'success',
                            title: 'All Posts Deleted',
                            showConfirmButton: false
                        });
                        getAllPost();
                    });
            } else {
                return Swal.fire({
                    icon: 'error',
                    title: 'Invalid Password',
                    text: 'Please enter correct password',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        }
    });
}