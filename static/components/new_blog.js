const new_blog = {
    template:`
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand">Blog Lite Application</a>
                <button @click="logout" class="btn btn-danger" type="submit">Logout</button>
            </div>
        </nav>

        <div class="water">
            <div class="form-box">
                <form id=login action="" class="inputs" method="POST">
                    <input type="file" name="file" id="file" class="input-fields" placeholder="Upload Image" required>
                    <input type="text" name="title" id="title" class="input-fields" placeholder="Blog Title" v-model="formData.title" required>
                    <input type="text" name="desc" id="desc" class="input-fields" placeholder="Blog Description" v-model="formData.desc" required>
                    <button type="submit" @click.prevent='newBlog' class="submit-btn">Post Blog</button>
                </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            formData:{
                title: "",
                desc: ""
            }
        }
    },

    methods: {
        logout(){
            fetch("/logout").then(res => {
                if(res.ok){
                    window.localStorage.clear()
                    alert('Logout Successful')
                    return this.$router.push('/')
                } else {
                    alert('Logout Unsuccessful')
                }
            })            
        },
        
        async newBlog(){
            if (this.check()) {
                const blog_image = document.getElementById("file").files[0];
                const formData = new FormData();
                formData.append("by", localStorage.getItem('username'))
                formData.append("file", blog_image)
                formData.append("title", this.formData.title)
                formData.append("desc", this.formData.desc)

                const res = await fetch(`/api/posts`,{
                        method: 'post',
                        body: formData
                    })
                if (res.status != 409) {
                    const data = await res.json()
                    if (res.ok) {
                        alert('New Blog Created')
                        return this.$router.push('/profile_page')
                    } else {
                        alert(data.error_message)
                    }
                }
                else {
                    alert('Please use a different blog title')
                }
            }
        },

        check(){
            var title = document.getElementById("title").value 
            var desc = document.getElementById("desc").value 
            
            if (title.length == 0) {
                alert('Please enter a title')
                return false
            }
            if (desc.length == 0) {
                alert('Please provide a description')
                return false
            }
            return true
        }
    },

    async beforeMount() {
        if (!localStorage.login) {
            return this.$router.push('/login')
        }
    }
}

export default new_blog