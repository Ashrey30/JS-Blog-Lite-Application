const login = {
    template:`
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
            <a class="navbar-brand">Log In</a>
            </div>
        </nav>
        
        <div class="water">
            <div class="form-box">
                <form id="login" class="inputs" action="" method="POST">
                    <input type="text" name="username" id="username" class="input-fields" placeholder="Username" v-model="formData.username" required>
                    <input type="password" name="password" id="password" class="input-fields" placeholder="Password" v-model="formData.password" required>
                    <button @click.prevent='loginUser' type="submit" class="submit-btn">Log In</button>
                    <p>Not a member? <router-link to="/register">Create a new Account</router-link></p>
                </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            formData:{
                username: "",
                password: ""
            }
        }
    },

    methods: {
        async loginUser(){
            if(this.check()){
                const res = await fetch('/login',{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.formData)
                })
                const data = await res.json()
                if(res.ok){
                    localStorage.setItem('username', this.formData.username);
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('login', true);
                    alert("Login Successful")
                    return this.$router.push('/blog')
                } else {
                    alert(data.message)
                }
            }
        },

        check(){
            var username = document.getElementById("username").value 
            var password = document.getElementById("password").value 
            
            if(username.length == 0){
                alert("Please enter a username")
                return false
            }
            if(password.length == 0){
                alert("Please enter a password")
                return false
            }
            if(/ /.test(password)){
                alert("Password cannot contain spaces")
                return false
            }
            return true
        }
    },
}

export default login