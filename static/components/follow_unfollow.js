const follow_unfollow = {
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

                <router-link to="/blog" class="btn btn-light mr-2" type="submit" role="button">My Feed</router-link>
                <router-link to="/profile_page" class="btn btn-light mr-2" type="submit" role="button">My Profile</router-link>
                <button @click="logout" class="btn btn-danger" type="submit" role="button">Logout</button>
            </div>
        </nav>
        
        <div class="profile-body">
            <div class="row py-5 px-4">
                <div class="col-md-5 mx-auto">
                    <div class="bg-white shadow rounded overflow-hidden">
                    
                        <div class="px-4 pt-0 pb-3 cover">
                            <div v-if="user.username == name" style="margin-left: 80%; padding-top: 10px;">
                                <button @click="deleteAccount" class="btn btn-block btn-sm btn-danger" style="height:30px; width:120px">Delete Account</button>
                            </div>
                            <div class="media align-items-center profile-head">
                                <div class="profile">
                                <img v-bind:src="'/static/profile_pics/'+ user.pfpname" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                                    <div class="col">
                                        <div v-if="user.username == name">
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

                                    <small v-if="post == 'profile'"><router-link to="/profile_page" class="text-muted" role="button">Post</router-link></small>
                                    <small v-else><router-link :to="'/search'+ user.username" class="text-muted" role="button">Post</router-link></small>
                                </li>
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{follower.length}}</h5>
                                    <small class="text-muted">Followers</small>
                                </li>
                                <li class="list-inline-item">
                                    <h5 class="font-weight-bold mb-0 d-block">{{following.length}}</h5>
                                    <small class="text-muted">Following</small>
                                </li>
                            </ul>
                        </div>

                        <div class="py-4 px-4">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <h5 class="mb-0">Accounts who follow you</h5>
                            </div>
                            <div class="alert alert-dark" role="alert">
                                <div v-if="follower.length != 0">
                                    <div v-for="x in follower" class="card">
                                        <div class="card-body">
                                        <router-link :to="'/search/'+x.follower">{{x.follower}}</router-link>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    You have no followers.
                                </div>
                            </div>
                        </div>

                        <div class="py-4 px-4">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <h5 class="mb-0">Accounts whom you are following</h5>
                            </div>
                            <div class="alert alert-dark" role="alert">
                                <div v-if="following.length != 0">
                                    <div v-for="x in following" class="card">
                                        <div class="card-body">
                                            <router-link :to="'/search/'+x.following">{{x.following}}</router-link>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    You are not following anyone.
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
            post: '',
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
    },

    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/')
        } else {
            const name = this.$route.params.username
            this.name = name

            const res1 = await fetch(`/api/posts/${name}`, { method: 'get' })
            const data1 = await res1.json()
            this.posts = data1.reverse()

            const res2 = await fetch(`/api/followers/` + name + `/0`, { method: 'get' })
            const data2 = await res2.json()
            this.follower = data2

            const res4 = await fetch(`/api/followers/None/${name}`, { method: 'get' })
            const data4 = await res4.json()
            this.following = data4

            const res3 = await fetch(`/api/users/${name}`, { method: 'get' })
            const data3 = await res3.json()
            this.user = data3

            if (name == localStorage.getItem('username')) {
                this.post = 'profile'

            }
        }
    }
}

export default follow_unfollow