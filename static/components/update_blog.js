const update_blog = {
    template: `
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand">Update Blog</a>
                <button @click="logout" class="btn btn-danger" type="submit" role="button">Logout</button>
            </div>
        </nav>

        <div class="water">
            <div class="form-box">
                <form id=login action="" class="inputs" @submit.prevent="updateBlog">
                    <input type="text" name="title" id="title" class="input-fields" placeholder="Blog Title" v-model="post.title" required>
                    <input type="text" name="desc" id="desc" class="input-fields" placeholder="Blog Description" v-model="post.desc" required>
                    <button type="submit" class="submit-btn">Update Blog</button>
                </form>
            </div>
        </div>
    </div>`,

    data() {
        return {
            post: {}
        }
    },

    methods: {
        logout() {
            fetch("/logout").then(res => {
                if (res.ok) {
                    window.localStorage.clear()
                    alert('Logout Successful')
                    return this.$router.push('/')
                } else {
                    alert('Logout Unsuccessful')
                }
            })
        },

        async updateBlog() {
            if (this.check()) {
                const res = await fetch('/api/posts', {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.post)
                })
                if (res.status != 409) {
                    const data = await res.json()
                    if (res.ok) {
                        alert('Blog successfully updated.')
                        return this.$router.push('/profile_page')
                    } else {
                        alert(data.error_message)
                    }
                } else {
                    alert('An error occured!!')
                }
            }
        },

        check() {
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

    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/')
        } else {
            const id = this.$route.params.id
            const res = await fetch(`/api/posts/` + id)
            const data = await res.json()
            this.post = data
        }
    }
}

export default update_blog