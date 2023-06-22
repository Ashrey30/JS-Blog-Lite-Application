const profile_page = {
    template: `
    <div>
        <nav class="navbar bg-dark" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" style="color:white;">{{name}}'s Dashboard</a>

                <form @submit.prevent="searchUsers" class="d-flex mx-auto" role="search" style="width: 500px;">
                    <input class="form-control me-2" name="search" type="search" placeholder="Search" aria-label="Search" v-model="query">
                    <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalid" type="submit">Search</button>
                </form>

                <div class="modal" id="modalid" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="searchModalLabel">Search Results</h1>
                            </div>
                            <div class="modal-body">
                                <div class="card">
                                    <div class="card-body">
                                        <router-link :to="'/search/'+results.username">{{results.username}}</router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <router-link to="/new_blog" class="btn btn-primary mr-2" type="submit" role="button">Create a Post</router-link>
                <router-link to="/blog" class="btn btn-light mr-2" type="submit" role="button">My Feed</router-link>
                <button @click="exportdata" class="btn btn-info mr-2" type="submit" role="button">Export</button>
                <button @click="logout" class="btn btn-danger" type="submit" role="button">Logout</button>
            </div>
        </nav>
        
        <div class="profile-body">
            <div class="row mx-auto" style="padding-top: 20px; width: 1600px;">
                <div class="col-md-5 mx-auto">
                    <div class="bg-white shadow rounded overflow-hidden">
                        <div class="px-4 pt-0 pb-3 cover">
                            <div v-if="user.username == name" style="margin-left: 80%; padding-top: 10px;">
                                <button @click="deleteAccount" class="btn btn-block btn-sm btn-danger" style="height:30px; width:120px">Delete Account</button>
                            </div>
                            <div class="media align-items-center profile-head">
                                <div class="profile">
                                    <img :src="'/static/profile_pics/'+ user.pfpname" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                                    <div class="col">
                                        <div>
                                            <router-link to="/update_profile" class="btn btn-outline-dark btn-sm btn-block mb-2" role="button" style="height:30px; width:90px">Edit profile</router-link>
                                        </div>
                        
                                    </div>
                                </div>

                                <div class="media mb-5 text-white">
                                    <h4 class="ml-3 mt-0 mb-0">{{user.username}}</h4>
                                    <p></p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 d-flex justify-content-end text-center">
                            <ul class="list-inline mb-0"> 
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{posts.length}}</h5>
                                    <small class="text-muted">Posts</small>
                                </li>
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{follower.length}}</h5>
                                    <small><router-link :to="'/follow_unfollow/'+user.username" class="text-muted" role="button">Followers</router-link></small>
                                </li>
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{following.length}}</h5>
                                    <small><router-link :to="'/follow_unfollow/'+user.username" class="text-muted" role="button">Following</router-link></small>
                                </li>
                            </ul>
                        </div>

                        <div class="py-4 px-4">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <h5 class="mb-0">Recent Posts</h5>
                            </div>
                            <div class="col">
                                <div v-if="posts.length != 0">
                                    <div v-for="post in posts">
                                        <div v-if="post.by == name" class="card my-3 mx-auto">
                                            <div v-if="post.filename" style="text-align:center; margin-top: 10px;">
                                                <img v-bind:src="'/static/blog_posts/' + post.filename" width="450" height="300" alt="Image not loaded">
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">From {{ post.by }} @ {{ post.date }}</h5>
                                                <h3 class="card-title">{{ post.title }}</h3>
                                                <p class="card-text">{{ post.desc }}</p>
                                                <button @click="updateblog(post.id)" class="btn btn-block btn-sm btn-primary" role="button" style="height:30px; width:120px">Update Blog</button>
                                                <button @click="deleteBlog(post.id)" class="btn btn-block btn-sm btn-danger" style="height:30px; width:120px">Delete Blog</button>                        
                                            </div>                                                              
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-dark" role="alert" v-else>
                                    Sorry but no posts were found. Try posting something.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,

    data() {
        return {
            user: {},
            posts: {},
            follower: {},
            following: {},
            results: {},
            query: ""
        }
    },

    
    methods: {
        searchUsers() {
            fetch('/api/users/' + this.query).then(res => res.json()).then(data => {
                this.results = data
            })
        },

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

        deleteAccount() {
            fetch(`/api/users/${localStorage.getItem('username')}`, { method: 'delete' }).then(res => {
                if (res.ok) {
                    window.localStorage.clear()
                    alert('Account Deleted Successfully')
                    return this.$router.push('/')
                } else {
                    alert('Account not deleted. Something happened!!')
                }
            })
        },

        follow(username) {
            fetch(`/follow/${username}`).then(res => {
                if (res.ok) {
                    alert('Followed')
                    window.location.reload()
                }
            })
        },

        unfollow(username) {
            fetch(`/unfollow/${username}`).then(res => {
                if (res.ok) {
                    alert('Unfollowed')
                    window.location.reload()
                }
            })
        },

        deleteBlog(id) {
            fetch(`/api/posts/delete/${id}`, { method: 'delete' }).then(res => {
                if (res.ok) {
                    alert('Blog deleted')
                    return window.location.reload()
                } else {
                    alert('Blog could not be deleted')
                }
            })
        },

        updateblog(id) {
            this.$router.push(`/update_blog/${id}`)
        },
        post() {
            location.reload()
        },
        exportdata() {
            fetch('/export').then(res => {
                if (res.ok) {
                    alert("Exported Successfully. Now you will be able to export again after 15 seconds.")
                } else {
                    alert("Export Failed")
                }
            })
        }
    },

    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/')
        } else {
            const name = localStorage.getItem("username")
            this.name = name

            const res1 = await fetch(`/api/posts/${localStorage.getItem('username')}`, { method: 'get' })
            const data1 = await res1.json()
            this.posts = data1.reverse()

            const res2 = await fetch(`/api/followers/` + localStorage.getItem('username') + `/0`, { method: 'get' })
            const data2 = await res2.json()
            this.follower = data2

            const res4 = await fetch(`/api/followers/None/${localStorage.getItem('username')}`, { method: 'get' })
            const data4 = await res4.json()
            this.following = data4

            const res3 = await fetch(`/api/users/${localStorage.getItem('username')}`, { method: 'get' })
            const data3 = await res3.json()
            this.user = data3
        }
    }
}

export default profile_page