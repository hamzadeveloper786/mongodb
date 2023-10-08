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
                posts += `<div id='card-${eachPost.id}' class="posts">
                <h3>${eachPost.title}</h3>
                <p>${eachPost.text}</p>
                <button onclick="deletePost('${eachPost.id}')">Delete</button>
                <button onclick="editPost('${eachPost.id}','${eachPost.title}','${eachPost.text}', )">Edit</button>
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
window.deletePost = (postId) => {
    console.log(postId, "delete");
    axios.delete(`/api/v1/post/${postId}`)
        .then(function (response) {
            console.log(response.data);
            getAllPost();
        })
        .catch(function (error) {
            console.log(error.data)
        })
    }
    window.editPost = (postId, title, text) => {

    console.log("edit: ", postId);

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
