const blog = {
  template: `
    <div class="back">
        <nav class="navbar bg-dark" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" style="color:white;">Welcome, {{name}}</a>

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
                <router-link to="/profile_page" class="btn btn-light mr-2" type="submit" role="button">My Profile</router-link>
                <button @click="logout" class="btn btn-danger" type="submit" role="button">Logout</button>
            </div>
        </nav>

        <div class="container my-5 m-auto">
            <div class="row align-items-center">
                <div class="col m-auto">
                    <div v-if="posts.length != 0">
                        <div v-for="post in posts" class="card my-4 m-auto" style="width: 45rem; margin-top: 3%!important; margin-bottom: 3%!important;">
                            <div v-if="post.filename" style="text-align:center; margin-top: 10px;">
                                <img v-bind:src="'/static/blog_posts/' + post.filename" width="600" height="400" alt="Image not loaded">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">From <router-link :to="'/profile_page/'+ post.by">{{post.by}}</router-link> @ {{post.date}}</h5>
                                <h3 class="card-title">{{post.title}}</h3>
                                <p class="card-text">{{post.desc}}</p>                        
                            </div>                            
                        </div>
                    </div>
                    <div v-else>
                        <div class="alert alert-dark" role="alert" style="margin-top: 10px;">
                            Looks like you aren't following anyone. Follow other users, to see their posts.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>`,

    data() {
        return {
            posts: [],
            results: {},
            query: ""
        };
    },

    methods: {
        searchUsers(){
            fetch('/api/users/' + this.query).then(res => res.json()).then(data => {
                this.results = data
            })                  
        },

    logout() {
      fetch("/logout").then((res) => {
        if (res.ok) {
            window.localStorage.clear();
            alert("Logout Successful");
            return this.$router.push("/");
        } else {
            alert("Logout Unsuccessful");
        }
      });
    },
  },

  async beforeCreate() {
    if (localStorage.getItem("login") === null) {
        return this.$router.push("/");
    } else {
        const name = localStorage.getItem("username");
        this.name = name;

        const res2 = await fetch(`/api/followers/None/` + localStorage.getItem("username"),{ method: "get" });
        
        var following_list = await res2.json();
        for (let i = 0; i < following_list.length; i++) {
            const post = await fetch("/api/posts/" + following_list[i].following);
            var posts = await post.json();
            for (let j = 0; j < posts.length; j++) {
            this.posts.push(posts[j]);
            }
      }
    }
  },
};

export default blog;
