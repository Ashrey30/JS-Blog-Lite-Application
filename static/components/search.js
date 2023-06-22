const profile = {
    template: `
    <div>
        <nav class="navbar bg-dark" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" style="color:white;">{{user.username}}'s Dashboard</a>

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
                                        <button class="btn" style="border: none;" @click="searchuser(user.username)">{{results.username}}</button>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div> 

                <router-link to="/blog" class="btn btn-light mr-2" type="submit" role="button">My Feed</router-link>
                <router-link to="/profile_page" class="btn btn-light mr-2" type="submit" role="button">My Profile</router-link>
                <button @click="logout" class="btn btn-danger" type="submit" role="button">Logout</button>
            </div>
        </nav>
        
        <div class="profile-body">
            <div class="row mx-auto" style="padding-top: 20px; width: 1600px;">
                <div class="col-md-5 mx-auto">
                    <div class="bg-white shadow rounded overflow-hidden">
                        <div class="px-4 pt-0 pb-3 cover">
                            <div class="media align-items-center profile-head">
                                <div class="profile">
                                    <img v-bind:src="'/static/profile_pics/'+ user.pfpname" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                                    <div class="col">
                                        <div>
                                            <div v-if="follow_button">
                                                <button @click="follow()" class="btn btn-block btn-sm btn-primary" style="height:30px; width:80px">Unfollow</button>
                                                
                                            </div>
                                            <div v-else>
                                                <button @click="follow()" class="btn btn-block btn-sm btn-primary" style="height:30px; width:80px">Follow</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="media mb-5 text-white">
                                    <h4 class="ml-3 mt-0 mb-0">{{user.username}}</h4>
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
                                    <small class="text-muted"><router-link :to="'/follow_unfollow/'+this.user.username" class="text-muted" role="button">Followers</router-link></small>
                                </li>
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{following.length}}</h5>
                                    <small class="text-muted"><router-link :to="'/follow_unfollow/'+this.user.username" class="text-muted" role="button">Followìng</router-link></small>
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
                                        <div v-if="post.by == user.username" class="card my-3 mx-auto">
                                            <div v-if="post.filename" style="text-align:center; margin-top: 10px;">
                                                <img v-bind:src="'/static/blog_posts/' + post.filename" width="450" height="300" alt="Image not loaded">
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">From {{ post.by }} @ {{ post.date }}</h5>
                                                <h3 class="card-title">{{ post.title }}</h3>
                                                <p class="card-text">{{ post.desc }}</p>
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
            follower_list: [],
            follow_button: false,
            results: {},
            query: ""
        }
    },

    methods: {
        searchUsers(){
            fetch('/api/users/' + this.query).then(res => res.json()).then(data => {
                this.results = data
            })                  
        },

        searchuser(user) {
            this.$router.push("/search/" + user)
            location.reload()
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

        follow() {
            fetch(`/follow/${this.$route.params.username}`).then(res => {
                if (res.ok) {
                    location.reload()
                }
            })
        },

    },

    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/')
        } else {
            const res = await fetch(`/api/users/${this.$route.params.username}`, { method: 'get' })
            const data = await res.json()
            this.user = data

            const res1 = await fetch(`/api/posts/${this.$route.params.username}`, { method: 'get' })
            const data1 = await res1.json()
            this.posts = data1.reverse()

            const res2 = await fetch(`/api/followers/` + this.$route.params.username + `/0`, { method: 'get' })
            const data2 = await res2.json()
            this.follower = data2
            this.follower_list = []
            for (let i = 0; i < this.follower.length; i++) {
                this.follower_list.push(this.follower[i].follower)
            }
            if (this.follower_list.includes(localStorage.getItem('username'))) {
                this.follow_button = true
            } else {
                this.follow_button = false
            }
            const res4 = await fetch(`/api/followers/None/${this.$route.params.username}`, { method: 'get' })
            const data4 = await res4.json()
            this.following = data4


        }
    }
}

export default profile